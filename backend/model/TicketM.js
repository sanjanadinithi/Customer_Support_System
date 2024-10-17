import mongoose from 'mongoose';

const ticketSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    description: { 
      type: String,
      required: true,
    },
    attachment: {
      name: String, 
      url: String    
    },
    deleted: {
       type: Boolean, 
       default: false 
    },
    deletedAt: { 
      type: Date,
      default: null 
    },
  },
  {
    timestamps: true,
  }
);
export const Ticket = mongoose.model('Ticket', ticketSchema); 
