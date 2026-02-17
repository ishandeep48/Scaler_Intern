import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Question from '@/models/Question';
import { verifyToken } from '@/lib/auth';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        // 1. Auth Check
        const token = req.cookies.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || !decoded.userId) {
            return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
        }
        const userId = decoded.userId;

        const body = await req.json();
        console.log("Incoming Answer Body:", body); // DEBUG LOG

        const { questionId, answer } = body;

        if (!questionId || answer === undefined) {
            return NextResponse.json({ error: 'Missing questionId or answer' }, { status: 400 });
        }

        if (!mongoose.Types.ObjectId.isValid(questionId)) {
            return NextResponse.json({ error: 'Invalid questionId format' }, { status: 400 });
        }

        const [user, question] = await Promise.all([
            User.findById(userId),
            Question.findById(questionId).select('+correctAnswer') // Ensure we get the correct answer
        ]);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        if (!question) {
            return NextResponse.json({ error: 'Question not found' }, { status: 404 });
        }

        // 3. User Logic - Initialize default fields if missing
        if (user.momentum === undefined) user.momentum = 0;
        if (user.currentStreak === undefined) user.currentStreak = 0;
        if (user.currentDifficulty === undefined) user.currentDifficulty = 1;

        // 4. Validate Answer
        const isCorrect = String(answer).trim().toLowerCase() === String(question.correctAnswer).trim().toLowerCase();

        // 5. Calculate New State
        let newMomentum = user.momentum;
        let newDifficulty = user.currentDifficulty;
        let newStreak = user.currentStreak;
        let scoreDelta = 0;

        if (isCorrect) {
            newMomentum++;
            newStreak++;
            if (newMomentum >= 2) {
                newDifficulty = Math.min(newDifficulty + 1, 10);
                newMomentum = 0;
            }
            const multiplier = Math.min(1 + (newStreak * 0.1), 2.5);
            scoreDelta = Math.round((question.difficulty * 10) * multiplier);
            if (isNaN(scoreDelta)) scoreDelta = 10;
        } else {
            newMomentum = 0;
            newStreak = 0;
            newDifficulty = Math.max(newDifficulty - 1, 1);
            scoreDelta = 0;
        }

        // 6. Update Database
        user.currentScore = (user.currentScore || 0) + scoreDelta;
        user.currentStreak = newStreak;
        user.currentDifficulty = newDifficulty;
        user.momentum = newMomentum;

        await user.save();

        return NextResponse.json({
            correct: isCorrect,
            correctAnswer: question.correctAnswer,
            newDifficulty,
            newStreak,
            scoreDelta,
            newScore: user.currentScore,
            user: {
                score: user.currentScore,
                streak: newStreak,
                difficulty: newDifficulty
            }
        });

    } catch (error) {
        console.error('Answer API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
