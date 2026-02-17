
import { NextRequest, NextResponse } from 'next/server';
import { getTopScorers } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const scores = await getTopScorers('score', 10);
        const streaks = await getTopScorers('streak', 10);

        return NextResponse.json({
            scores,
            streaks
        });
    } catch (error) {
        console.error('Error in /api/leaderboard:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
