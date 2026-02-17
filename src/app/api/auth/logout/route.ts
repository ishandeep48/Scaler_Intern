import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
    const cookie = serialize('auth-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: -1,
        path: '/',
    });

    const response = NextResponse.json({ success: true });
    response.headers.set('Set-Cookie', cookie);
    return response;
}
