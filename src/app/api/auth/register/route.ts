import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, signToken } from '@/lib/auth';
import { serialize } from 'cookie';

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const { username, email, password } = await req.json();

        if (!username || !email || !password) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        const hashedPassword = await hashPassword(password);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

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
        console.error('Registration Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
