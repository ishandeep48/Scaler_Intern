
import { NextRequest, NextResponse } from 'next/server';
import { getLeaderboardWithStreaks, getTopScorers } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        // New combined data for "Top Scores" tab
        const scores = await getLeaderboardWithStreaks(10);

        // Keep "Top Streaks" tab working as is (sorted by streak)
        const streaks = await getTopScorers('streak', 10);

        return NextResponse.json({
            scores, // Now contains { username, score, streak }
            streaks
        });
    } catch (error) {
        console.error('Error in /api/leaderboard:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
