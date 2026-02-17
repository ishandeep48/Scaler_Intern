import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        const decoded = verifyToken(token);
        if (!decoded || !decoded.userId) {
            return NextResponse.json({ user: null }, { status: 200 }); // Invalid token
        }

        await connectToDatabase();
        const user = await User.findById(decoded.userId);

        if (!user) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        return NextResponse.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                score: user.currentScore,
                streak: user.currentStreak,
                difficulty: user.currentDifficulty
            }
        });

    } catch (error) {
        console.error('Auth Check Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
