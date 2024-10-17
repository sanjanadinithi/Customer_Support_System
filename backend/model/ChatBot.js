import mongoose from 'mongoose';

const ChatSchema = mongoose.Schema({
    userMessage: {
        type: String,
        required: true,
    },
    botMessage: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

export const Chat = mongoose.model('Chat', ChatSchema);
