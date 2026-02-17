import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuestion extends Document {
    difficulty: number;
    prompt: string;
    choices: string[];
    correctAnswer: string;
}

const QuestionSchema: Schema = new Schema({
    difficulty: { type: Number, required: true, index: true },
    prompt: { type: String, required: true },
    choices: { type: [String], required: true },
    correctAnswer: { type: String, required: true, select: false }, // Hidden by default
});

const Question: Model<IQuestion> = mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;
