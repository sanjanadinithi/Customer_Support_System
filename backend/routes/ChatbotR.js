import express from "express";
import { Chat } from '../model/ChatBot.js'; 
const router = express.Router();

// Sample product list for handling product inquiries
const sampleProducts = [
  { id: 'P001', name: 'Red T-shirt', price: 19.99, availability: 'In Stock' },
  { id: 'P002', name: 'Blue Jeans', price: 49.99, availability: 'Out of Stock' }
];

router.post('/', async (req, res) => {
    const userMessage = req.body.message.toLowerCase();
    
    let botMessage = 'Sorry, I do not understand that. Could you ask something else?';

    // Chatbot logic: Identify common inquiries based on keywords
    if (userMessage.includes('order status')) {
        botMessage = 'Please provide your order ID for the status.';
    } else if (userMessage.includes('shipping')) {
        botMessage = 'Shipping usually takes 3-5 business days. Do you need further details about your order’s shipment?';
    } else if (userMessage.includes('return policy')) {
        botMessage = 'You can return your order within 30 days of purchase. Would you like help starting a return?';
    } else if (userMessage.includes('product')) {
        const productId = userMessage.match(/p\d+/i); 
        const product = sampleProducts.find(p => p.id.toLowerCase() === productId?.[0].toLowerCase());
        botMessage = product ? 
          `The ${product.name} is ${product.availability} and priced at $${product.price}. Would you like to order it?` : 
          'I could not find that product. Could you please provide the product ID again?';
    } else if (userMessage.includes('refund')) {
        botMessage = 'Refunds are processed within 7-10 business days. Would you like me to assist with your refund request?';
    } else if (userMessage.includes('payment')) {
        botMessage = 'It looks like you have an issue with payment. Please check your payment method or contact customer service if the issue persists.';
    } else if (userMessage.includes('discount') || userMessage.includes('promotion')) {
        botMessage = 'We have a 10% discount on your first order. Use code "FIRST10" at checkout!';
    } else if (userMessage.includes('account')) {
        botMessage = 'It seems you need help with your account. Would you like to reset your password or create a new account?';
    }

    // Save chat conversation to the database
    const newChat = new Chat({
        userMessage: req.body.message,
        botMessage: botMessage,
    });

    await newChat.save();

    res.json({ botMessage });
});

export default router;