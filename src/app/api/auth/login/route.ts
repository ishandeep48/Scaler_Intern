import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { comparePassword, signToken } from '@/lib/auth';
import { serialize } from 'cookie';

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        // Keep password selected to compare
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isValid = await comparePassword(password, user.password!);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const token = signToken({ userId: user._id, username: user.username });

        const cookie = serialize('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        const response = NextResponse.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                score: user.currentScore,
            },
        });

        response.headers.set('Set-Cookie', cookie);
        return response;

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
