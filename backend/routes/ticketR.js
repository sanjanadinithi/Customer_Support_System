import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { Ticket } from '../model/TicketM.js';

const router = express.Router();

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); 
  },
});

// Add file type validation
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only JPG, PNG, or PDF allowed.'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 } 
});

// Helper function for email validation
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};


const validTitles = [
  "Billing Error",
  "Order Canceled",
  "Order Delayed",
  "Order Not Received",
  "Payment Failed",
  "Product Defect",
  "Product Not as Described",
  "Refund Request",
  "Shipping Damage",
  "Wrong Item Received",
];

// Create a new ticket with file upload and validation
router.post('/', upload.single('attachment'), async (req, res) => {
  try {
    const { title, email, description } = req.body;

    // Validate required fields
    if (!title || !email || !description) {
      return res.status(400).json({ message: 'Please provide title, email, and description.' });
    }

    // Validate title
    if (!validTitles.includes(title)) {
      return res.status(400).json({ message: 'Invalid title selected.' });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    // Validate description length
    if (description.length < 10) {
      return res.status(400).json({ message: 'Description must be at least 10 characters long.' });
    }

    // Create attachment object if file is uploaded
    const attachment = req.file
      ? {
          name: req.file.originalname,
          url: `http://localhost:5579/uploads/${req.file.filename}`,
        }
      : null;

    // Create a new ticket object
    const newTicket = { title, email, description, attachment };

    // Save the ticket to the database
    const ticket = await Ticket.create(newTicket);
    return res.status(201).json(ticket);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Error creating ticket' });
  }
});

// Update an existing ticket with validation
router.put('/:id', upload.single('attachment'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, email, description } = req.body;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ticket ID' });
    }

    // Validate required fields
    if (!title || !email || !description) {
      return res.status(400).json({ message: 'Please provide title, email, and description.' });
    }

    // Validate title
    if (!validTitles.includes(title)) {
      return res.status(400).json({ message: 'Invalid title selected.' });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    // Validate description length
    if (description.length < 10) {
      return res.status(400).json({ message: 'Description must be at least 10 characters long.' });
    }

    // Update attachment if new file is uploaded
    const updatedAttachment = req.file
      ? {
          name: req.file.originalname,
          url: `http://localhost:5579/uploads/${req.file.filename}`,
        }
      : undefined; 

    // Create updated ticket object
    const updatedTicket = { title, email, description, attachment: updatedAttachment };

   
    Object.keys(updatedTicket).forEach((key) => {
      if (updatedTicket[key] === undefined) {
        delete updatedTicket[key];
      }
    });

    // Update the ticket in the database
    const result = await Ticket.findByIdAndUpdate(id, updatedTicket, { new: true });

    if (!result) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    return res.status(200).json({ message: 'Ticket updated successfully', ticket: result });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Error updating ticket' });
  }
});

// Fetch a ticket by ID with validation
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ticket ID' });
  }

  try {
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    return res.status(200).json(ticket);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Error fetching ticket' });
  }
});

// Fetch all non-deleted tickets
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.find({ deleted: false });
    return res.status(200).json({ count: tickets.length, data: tickets });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Fetch deleted tickets
router.get('/deleted', async (req, res) => {
  try {
    const deletedTickets = await Ticket.find({ deleted: true });
    return res.status(200).json({ count: deletedTickets.length, data: deletedTickets });
  } catch (error) {
    console.error('Error fetching deleted tickets:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Restore a deleted ticket
router.put('/restore/:id', async (req, res) => {
  const { id } = req.params;

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ticket ID' });
  }

  try {
    const ticket = await Ticket.findByIdAndUpdate(id, { deleted: false }, { new: true });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    return res.status(200).json({ message: 'Ticket restored', ticket });
  } catch (error) {
    console.error('Error restoring ticket:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Soft delete a ticket (mark as deleted)
router.put('/delete/:id', async (req, res) => {
  const { id } = req.params;

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ticket ID' });
  }

  try {
    const ticket = await Ticket.findByIdAndUpdate(id, { deleted: true, deletedAt: new Date() }, { new: true });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    return res.status(200).json({ message: 'Ticket marked as deleted', ticket });
  } catch (error) {
    console.error('Error marking ticket as deleted:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Permanently delete a ticket
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ticket ID' });
  }

  try {
    const ticket = await Ticket.findByIdAndDelete(id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    return res.status(204).send(); 
  } catch (error) {
    console.error('Error deleting ticket:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
