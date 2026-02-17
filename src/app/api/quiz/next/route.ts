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

        // Filter out questions used in this session (cycle)
        const excludeIds = user.usedQuestionIds || [];

        // 1. Try to find a question at current difficulty NOT in used
        let questions = await Question.aggregate([
            {
                $match: {
                    difficulty: user.currentDifficulty,
                    _id: { $nin: excludeIds }
                }
            },
            { $sample: { size: 1 } }
        ]);

        let question = questions[0];

        // 2. Fallback: If no questions at this difficulty (excluding used), 
        // try expanding search to adjacent difficulties (+/- 1)
        if (!question) {
            console.log(`No unique questions found for difficulty ${user.currentDifficulty}, expanding search.`);
            const minDiff = Math.max(1, user.currentDifficulty - 1);
            const maxDiff = Math.min(10, user.currentDifficulty + 1);

            questions = await Question.aggregate([
                {
                    $match: {
                        difficulty: { $gte: minDiff, $lte: maxDiff },
                        _id: { $nin: excludeIds }
                    }
                },
                { $sample: { size: 1 } }
            ]);
            question = questions[0];
        }

        // 3. Cycle Reset: If STILL no question, it means the user has exhausted ALL valid questions for their level/range (or entire DB).
        // Only then do we clear the 'usedQuestionIds' to start a new cycle.
        if (!question) {
            console.log(`User exhausted all questions (Cycle Complete). Resetting usedQuestionIds.`);

            await User.updateOne({ _id: userId }, { $set: { usedQuestionIds: [] } });

            // Try again without exclusions
            questions = await Question.aggregate([
                {
                    $match: {
                        difficulty: user.currentDifficulty
                    }
                },
                { $sample: { size: 1 } }
            ]);
            question = questions[0];
        }

        // 4. Absolute Fallback
        if (!question) {
            const fallback = await Question.aggregate([{ $sample: { size: 1 } }]);
            question = fallback[0];
        }

        if (!question) {
            return NextResponse.json({ error: 'No questions in DB.' }, { status: 404 });
        }

        return NextResponse.json({
            user: {
                id: user._id,
                username: user.username,
                score: user.currentScore,
                streak: user.currentStreak,
                difficulty: user.currentDifficulty,
                stateVersion: user.stateVersion || 0
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
