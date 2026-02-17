import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnswerLog extends Document {
    userId: mongoose.Types.ObjectId;
    questionId: mongoose.Types.ObjectId;
    isCorrect: boolean;
    timestamp: Date;
}

const AnswerLogSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    isCorrect: { type: Boolean, required: true },
    timestamp: { type: Date, default: Date.now },
});

const AnswerLog: Model<IAnswerLog> = mongoose.models.AnswerLog || mongoose.model<IAnswerLog>('AnswerLog', AnswerLogSchema);

export default AnswerLog;
