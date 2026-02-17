# Low-Level Design (LLD) - Scaler Quiz App

## 1. System Architecture

The application follows a **Next.js App Router** architecture with a clear separation of concerns.

### Module Responsibilities
-   **`src/models/`**: Defines MongoDB Schemas and Indexes. Responsible for data validation and persistence structure.
    -   `User.ts`: Stores user profile, stats (score, streak), and progress tracking (usedQuestions).
    -   `Question.ts`: Stores quiz content. Indexed by `difficulty` for efficient random sampling.
    -   `AnswerLog.ts`: Immutable log of every answer for audit trails and idempotency checks.
-   **`src/lib/`**: Infrastructure and Utility layer.
    -   `mongodb.ts`: Manages persistent connection to MongoDB.
    -   `redis.ts`: Manages connection to Redis and encapsulates Leaderboard logic (Sorted Sets).
    -   `auth.ts`: JWT verification helper.
-   **`src/app/api/`**: Business Logic Layer.
    -   Endpoints orchestrate database calls, Redis updates, and response formatting.

---

## 2. Database Schema & Indexing

### User Collection
| Field | Type | Index | Description |
| :--- | :--- | :--- | :--- |
| `username` | String | Unique | User's display name |
| `currentScore` | Number | **Yes** | Total accumulated score. Indexed for potential DB-based leaderboards. |
| `currentStreak` | Number | **Yes** | Consecutive correct answers. Indexed for high-streak queries. |
| `lastAnswerAt` | Date | **Yes** | Timestamp of last activity. Used for Streak Decay logic. |
| `usedQuestionIds` | ObjectIds[] | No | Array of question IDs answered in the current session cycle. |

### Question Collection
| Field | Type | Index | Description |
| :--- | :--- | :--- | :--- |
| `difficulty` | Number | **Yes** | 1-10 scale. Critical for the `next` question algorithm. |
| `correctAnswer` | String | No | **select: false** by default to prevent leaking to frontend. |

---

## 3. Cache Strategy (Redis)

Redis is used primarily for **Real-Time Leaderboards**, offering sub-millisecond ranking queries.

### Data Structures
-   **`leaderboard:score`** (Sorted Set):
    -   **Member**: `username` (or `userId`)
    -   **Score**: `currentScore`
    -   **Usage**: `ZADD` to update, `ZREVRANGE` to fetch top 10.
-   **`leaderboard:streak`** (Sorted Set):
    -   **Member**: `username`
    -   **Score**: `currentStreak`

### Usage Pattern
1.  **Write**: `updateLeaderboard` is called immediately after a successful `User.save()` in the Answer API. We `await` this call to ensure strong consistency (Strict Sync).
2.  **Read**: The `/api/leaderboard` endpoint polls Redis every 1 second (SWR) to provide real-time updates.

---

## 4. Adaptive Quiz Algorithm (Pseudocode)

### Fetching Next Question (`GET /api/quiz/next`)
```typescript
function getNextQuestion(user):
  filter = { 
    difficulty: user.currentDifficulty, 
    _id: { $nin: user.usedQuestionIds } // Session Filtering
  }
  
  question = db.Questions.aggregate([ $match: filter, $sample: 1 ])
  
  if !question:
    // Fallback: Expand search range (+/- 1 difficulty)
    filter.difficulty = { $gte: user.currentDifficulty - 1, $lte: user.currentDifficulty + 1 }
    question = db.Questions.aggregate([ $match: filter, $sample: 1 ])
    
  if !question:
    // Cycle Complete: Reset usage history
    user.usedQuestionIds = []
    save(user)
    return getNextQuestion(user) // Recursion with fresh pool
    
  // Streak Decay Check
  if (now() - user.lastAnswerAt > 24 hours):
     user.streak = 0
     user.momentum = 0
     user.difficulty = max(1, user.difficulty - 1)
     save(user)
     
  return question
```

### Processing Answer (`POST /api/quiz/answer`)
```typescript
function processAnswer(user, questionId, answer):
  // Idempotency
  if AnswerLog.exists(user, questionId):
    return previousResult
    
  isCorrect = (answer == question.correctAnswer)
  
  if isCorrect:
    streak++
    momentum++
    if momentum >= 2:
       difficulty = min(10, difficulty + 1)
       momentum = 0
    score += (difficulty * 10) * streakMultiplier
  else:
    streak = 0
    momentum = 0
    difficulty = max(1, difficulty - 1)
    
  // Update State
  user.usedQuestionIds.push(questionId)
  user.currentScore = score
  user.currentDifficulty = difficulty
  user.lastAnswerAt = now()
  
  await user.save()
  
  // Real-Time Sync
  await redis.zadd('leaderboard:score', score, user.username)
```

---

## 5. API Schema

### `GET /api/quiz/next`
**Response:**
```json
{
  "user": {
    "score": 1200,
    "streak": 5,
    "difficulty": 4,
    "streakDecayed": false
  },
  "question": {
    "_id": "65d...",
    "prompt": "What is the time complexity of...",
    "choices": ["O(n)", "O(1)", "O(log n)", "O(n^2)"],
    "difficulty": 4
  }
}
```

### `POST /api/quiz/answer`
**Request:**
```json
{
  "questionId": "65d...",
  "answer": "O(log n)",
  "idempotencyKey": "0.12345..."
}
```

**Response:**
```json
{
  "correct": true,
  "correctAnswer": "O(log n)",
  "newScore": 1250,
  "newStreak": 6,
  "newDifficulty": 5,
  "scoreDelta": 50,
  "user": { ...updatedStats }
}
```
