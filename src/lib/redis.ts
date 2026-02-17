import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(REDIS_URL);

/**
 * Updates the leaderboards for score and streak.
 * @param userId - Unique identifier for the user
 * @param username - Display name
 * @param score - Total score
 * @param streak - Current streak
 */
export async function updateLeaderboard(userId: string, username: string, score: number, streak: number) {
    const scoreMember = `${score}:${username}`; // Storing score in member for display if needed, or just username
    // Ideally, we just store username and fetch details, or store a JSON string.
    // For simplicity and standard zboard usage: Member = Username (assuming unique) or UserID. 
    // Requirement says: "Returns top 10 users with their scores/streaks".
    // Let's store Username as member. If usernames aren't unique, we'd use "username:userId".
    // Assuming username is unique from User model.

    // Using pipeline for atomic-like batch execution
    const pipeline = redis.pipeline();

    pipeline.zadd('leaderboard:score', score, username);
    pipeline.zadd('leaderboard:streak', streak, username);

    await pipeline.exec();
}

/**
 * Retrieves the top N users from a specific leaderboard.
 * @param type - 'score' or 'streak'
 * @param limit - Number of users to return
 */
export async function getTopScorers(type: 'score' | 'streak' = 'score', limit: number = 10) {
    const key = `leaderboard:${type}`;
    // ZREVRANGE returns highest scores first. With WITHSCORES to get values.
    const result = await redis.zrevrange(key, 0, limit - 1, 'WITHSCORES');

    // Result is [User1, Score1, User2, Score2, ...]
    const parsed = [];
    for (let i = 0; i < result.length; i += 2) {
        parsed.push({
            username: result[i],
            value: parseFloat(result[i + 1]),
        });
    }

    return parsed;
}

export default redis;
