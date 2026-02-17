import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Question from '@/models/Question';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();

        const token = req.cookies.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || !decoded.userId) {
            return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
        }

        const userId = decoded.userId;

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // 2. Fetch a random question for the user's difficulty
        const questions = await Question.aggregate([
            { $match: { difficulty: user.currentDifficulty } },
            { $sample: { size: 1 } }
        ]);

        let question = questions[0];

        // Fallback: If no questions at this difficulty, find ANY question
        if (!question) {
            console.log(`No questions found for difficulty ${user.currentDifficulty}, fetching fallback.`);
            const fallback = await Question.aggregate([{ $sample: { size: 1 } }]);
            question = fallback[0];
        }

        if (!question) {
            return NextResponse.json({ error: 'No questions in DB.' }, { status: 404 });
        }

        // 3. Return Data
        return NextResponse.json({
            user: {
                id: user._id,
                username: user.username,
                score: user.currentScore,
                streak: user.currentStreak,
                difficulty: user.currentDifficulty
            },
            question: {
                _id: question._id,
                prompt: question.prompt,
                choices: question.choices,
                difficulty: question.difficulty
            }
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
