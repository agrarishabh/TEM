import mongoose from 'mongoose';

const doneSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: { type: String, required: true },
    workDetails: { type: String, required: true },
    workType: { type: String, enum: ['task', 'other'], required: true }, // ✅ add this field
}, { timestamps: true });

export default mongoose.model('Done', doneSchema);
