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

export async function getLeaderboardWithStreaks(limit: number = 10) {
    // 1. Get Top Scorers
    // Result: [User1, Score1, User2, Score2, ...]
    const topScorers = await redis.zrevrange('leaderboard:score', 0, limit - 1, 'WITHSCORES');

    if (!topScorers.length) return [];

    const result = [];
    const pipeline = redis.pipeline();

    // 2. Queue up commands to get streaks for these users
    for (let i = 0; i < topScorers.length; i += 2) {
        const username = topScorers[i];
        pipeline.zscore('leaderboard:streak', username);
    }

    const streakResults = await pipeline.exec();

    // 3. Merge Data
    for (let i = 0; i < topScorers.length; i += 2) {
        const username = topScorers[i];
        const score = parseFloat(topScorers[i + 1]);
        // streakResults[i/2] corresponds to the i-th user
        // result format for ioredis pipeline: [null, result] or [error, result]
        const streakRes = streakResults ? streakResults[i / 2] : null;
        const streak = streakRes && streakRes[1] ? parseInt(streakRes[1] as string) : 0;

        result.push({
            username,
            value: score, // Mapped to 'value' for frontend compatibility
            score,        // Keeping 'score' just in case
            streak
        });
    }

    return result;
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
            // For backward compatibility or single-dimension usage
        });
    }

    return parsed;
}

export default redis;
