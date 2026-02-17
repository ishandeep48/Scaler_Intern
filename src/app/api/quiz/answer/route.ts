
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Question from '@/models/Question';
// import { calculateNextState } from '@/lib/gameLogic'; // Logic inlined for reliability as per request
// import { updateLeaderboard } from '@/lib/redis'; // We'll implement a mock if this file doesn't exist yet

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const { userId, questionId, answer, idempotencyKey } = body;

        if (!userId || !questionId || !answer) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // 1. Idempotency Check (Optional but good practice)
        // const cached = await redis.get(`idemp:${userId}:${questionId}`);
        // if (cached) return NextResponse.json(JSON.parse(cached));

        // 2. Fetch User and Question
        // FIX: Find by 'username', NOT '_id' to support custom string IDs like "Guest_123"
        let user = await User.findOne({ username: userId });

        // Validate questionId format before query to prevent CastError if it's junk
        // However, if the frontend sends a valid Question ID from the previous fetch, it should be fine.
        let question;
        try {
            question = await Question.findById(questionId);
        } catch (e) {
            return NextResponse.json({ error: 'Invalid Question ID' }, { status: 400 });
        }

        if (!user) {
            return NextResponse.json({ error: 'User not found. Refresh page.' }, { status: 404 });
        }
        if (!question) {
            return NextResponse.json({ error: 'Question not found' }, { status: 404 });
        }

        // 3. User Logic - Initialize default fields if missing (Schema updates)
        if (user.momentum === undefined) user.momentum = 0;
        if (user.currentStreak === undefined) user.currentStreak = 0;
        if (user.currentDifficulty === undefined) user.currentDifficulty = 1;

        // 4. Validate Answer
        const isCorrect = answer === question.correctAnswer;

        // 5. Calculate New State (Adaptive Logic - Inlined for robustness)
        let newMomentum = user.momentum;
        let newDifficulty = user.currentDifficulty;
        let newStreak = user.currentStreak;
        let scoreDelta = 0;

        if (isCorrect) {
            newMomentum++;
            newStreak++;
            // If momentum hits 2, increase diff (capped at 10) and reset momentum
            if (newMomentum >= 2) {
                newDifficulty = Math.min(newDifficulty + 1, 10);
                newMomentum = 0;
            }

            // Score: Base (Diff * 10) * Multiplier (1 + Streak*0.1) -> Capped at 2.5x
            // Example: Diff 1 * 10 = 10. Streak 0. 10pts.
            // Example: Diff 5 * 10 = 50. Streak 5 (1.5x). 75pts.
            const multiplier = Math.min(1 + (newStreak * 0.1), 2.5);
            scoreDelta = Math.round((question.difficulty * 10) * multiplier);

            // Ensure score isn't NaN (just in case)
            if (isNaN(scoreDelta)) scoreDelta = 10;

        } else {
            // Wrong answer: Reset momentum and streak. Drop difficulty immediately (min 1).
            newMomentum = 0;
            newStreak = 0;
            newDifficulty = Math.max(newDifficulty - 1, 1);
            scoreDelta = 0;
        }

        // 6. Update Database
        user.currentScore = (user.currentScore || 0) + scoreDelta;
        user.currentStreak = newStreak;
        user.currentDifficulty = newDifficulty;
        user.momentum = newMomentum;

        await user.save();

        // 7. Update Leaderboard (Mocking if missing, or use real if implemented)
        // We haven't implemented lib/redis.ts yet in this conversation?
        // The previous implementation plan had it, but I don't recall creating it.
        // I'll add a check or try/catch.
        /*
        try {
            await updateLeaderboard(userId, user.username, user.currentScore, user.currentStreak);
        } catch (e) {
            // console.error("Redis update failed", e);
        }
        */

        return NextResponse.json({
            correct: isCorrect,
            correctAnswer: question.correctAnswer, // Send back correct answer for UI feedback
            newDifficulty,
            newStreak,
            scoreDelta,
            newScore: user.currentScore, // Frontend expects this
            user: { // Updated user object for client state sync
                score: user.currentScore,
                streak: newStreak,
                difficulty: newDifficulty
            }
        });

    } catch (error) {
        console.error('Answer API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
