import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineMail } from "react-icons/ai";
import { FaTicketAlt } from "react-icons/fa";
import { BiShow, BiTrash } from "react-icons/bi";
import TicketModal from "./TicketModal";
import axios from "axios";
import { useSnackbar } from "notistack";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Select,
  MenuItem,
} from "@mui/material";

const TicketSingleCard = ({ ticket }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [ticketStatus, setTicketStatus] = useState(ticket.status || "Opened");
  const [statusLoading, setStatusLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Load ticket status from localStorage
  useEffect(() => {
    const savedStatus = localStorage.getItem(`ticketStatus_${ticket._id}`);
    if (savedStatus) {
      setTicketStatus(savedStatus);
    }
  }, [ticket._id]);

  // Save ticket status to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`ticketStatus_${ticket._id}`, ticketStatus);
  }, [ticketStatus, ticket._id]);

  // Function to update ticket status
  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setTicketStatus(newStatus);
    setStatusLoading(true);

    try {
      await axios.patch(`http://localhost:5579/ticket/${ticket._id}`, {
        status: newStatus,
      });
      enqueueSnackbar("Ticket status updated successfully", {
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating ticket status:", error);
    } finally {
      setStatusLoading(false);
    }
  };

  // Delete Ticket function
  const handleDeleteTicket = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5579/ticket/${ticket._id}`);
      enqueueSnackbar("Ticket deleted successfully", {
        variant: "success",
      });
      navigate("/admin");
    } catch (error) {
      enqueueSnackbar("Error deleting ticket", { variant: "error" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Open confirmation dialog
  const handleDeleteClick = () => {
    setOpenDialog(true);
  };

  // Close dialog without deleting
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Get ticket progress based on status
  const getTicketProgress = (status) => {
    switch (status) {
      case "Opened":
        return 0;
      case "In Progress":
        return 50;
      case "Pending":
        return 75;
      case "Resolved":
        return 100;
      default:
        return 0;
    }
  };

  const progress = getTicketProgress(ticketStatus);

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-md transition-shadow duration-200 p-6 m-4 max-w-md">
      {/* Ticket Info */}
      <h4 className="text-gray-500 text-xs mb-1">Ticket ID: {ticket._id}</h4>

      <div className="flex items-center gap-3 mb-4">
        <FaTicketAlt className="text-blue-600 text-3xl" />
        <h2 className="text-xl font-bold text-gray-800">{ticket.title}</h2>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <AiOutlineMail className="text-blue-600 text-lg" />
        <a
          href={`mailto:${ticket.email}`}
          className="text-blue-700 hover:underline text-sm"
        >
          {ticket.email}
        </a>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <LinearProgress variant="determinate" value={progress} />
        <div className="flex justify-between mt-2">
          <span className="text-sm">Progress: {progress}%</span>
          <span className="text-sm">Status: {ticketStatus}</span>
        </div>
      </div>

      {/* Status Update Selection */}
      <div className="mb-4">
        <Select
          value={ticketStatus}
          onChange={handleStatusChange}
          fullWidth
          variant="outlined"
          disabled={statusLoading}
          className="text-sm"
        >
          <MenuItem value="Opened">Opened</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Resolved">Resolved</MenuItem>
        </Select>
        {statusLoading && <CircularProgress size={24} className="mt-2" />}
      </div>

      <div className="flex justify-between items-center mt-4 space-x-1">
        {/* Show Details Button */}
        <Button
          variant="outlined"
          color="primary"
          startIcon={<BiShow className="text-xl" />}
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center rounded-lg hover:bg-blue-50 transition-colors px-4 py-2"
          aria-label="Show Ticket Details"
        >
          Details
        </Button>

        {/* Delete Button */}
        <Button
          variant="outlined"
          color="error"
          startIcon={
            loading ? (
              <CircularProgress size={20} />
            ) : (
              <BiTrash className="text-xl" />
            )
          }
          onClick={handleDeleteClick}
          disabled={loading}
          className="flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors px-4 py-2"
          aria-label="Delete Ticket"
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </div>

      {/* Modal for Ticket Details */}
      {showModal && (
        <TicketModal tickets={ticket} onClose={() => setShowModal(false)} />
      )}

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Delete Ticket</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this ticket? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDeleteTicket();
              handleCloseDialog();
            }}
            color="secondary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TicketSingleCard;
