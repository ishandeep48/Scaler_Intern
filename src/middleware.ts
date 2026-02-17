import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Protect all /api/quiz routes
    if (path.startsWith('/api/quiz')) {
        const token = request.cookies.get('auth-token')?.value;

        // We only check for presence here to avoid Edge Runtime issues with jsonwebtoken
        // The API route will verify the signature.
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/api/quiz/:path*'],
};
