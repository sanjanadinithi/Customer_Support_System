import React, { useState } from "react";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Button, TextField, Typography, Box, Paper } from "@mui/material";

const CreateTicket = () => {
  const { state } = useLocation();
  const { user } = state || {};
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Attachment validation
  const validateAttachment = (file) => {
    const maxFileSize = 5 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      enqueueSnackbar("Only JPG, PNG, and PDF files are allowed.", {
        variant: "warning",
      });
      return false;
    }
    if (file.size > maxFileSize) {
      enqueueSnackbar("File size should not exceed 5MB.", {
        variant: "warning",
      });
      return false;
    }
    return true;
  };

  const handleSaveTicket = (e) => {
    e.preventDefault();
    // Frontend validation
    if (!title) {
      enqueueSnackbar("Please select a title.", { variant: "warning" });
      return;
    }

    if (!description || description.length < 10) {
      enqueueSnackbar("Description must be at least 10 characters long.", {
        variant: "warning",
      });
      return;
    }

    if (attachment && !validateAttachment(attachment)) {
      return;
    }

    const data = new FormData();
    data.append("title", title);
    data.append("email", user?.email);
    data.append("description", description);
    if (attachment) {
      data.append("attachment", attachment);
    }

    setLoading(true);
    axios
      .post("http://localhost:5579/ticket", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Ticket created successfully", { variant: "success" });
        navigate("/home");
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error: " + error.message, { variant: "error" });
        console.error("Error creating ticket:", error);
      });
  };

  return (
    <Box
      sx={{ padding: "2rem", backgroundColor: "#f7f9fc", minHeight: "100vh" }}
    >
      <BackButton />
      <Typography
        variant="h4"
        sx={{ marginBottom: "1.5rem", color: "#252B42" }}
      >
        Create New Ticket
      </Typography>
      {loading && <Spinner />}
      <Paper
        elevation={3}
        sx={{
          padding: "2rem",
          borderRadius: "16px",
          width: "600px",
          margin: "auto",
        }}
      >
        <form onSubmit={handleSaveTicket}>
          <div className="my-4">
            <Typography
              variant="h6"
              sx={{ marginBottom: "0.5rem", color: "#252B42" }}
            >
              Title
            </Typography>
            <select
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-2 border-gray-500 px-4 py-2 w-full"
              required
            >
              <option value="" disabled>
                Select an Issue
              </option>
              {[
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
              ]
                .sort()
                .map((issue) => (
                  <option key={issue} value={issue}>
                    {issue}
                  </option>
                ))}
            </select>
          </div>
          <div className="my-4">
            <Typography
              variant="h6"
              sx={{ marginBottom: "0.5rem", color: "#252B42" }}
            >
              Email
            </Typography>
            <TextField
              type="text"
              value={user?.email || ""}
              variant="outlined"
              fullWidth
              sx={{ marginBottom: "1rem" }}
              placeholder="Enter your email"
              disabled
            />
          </div>
          <div className="my-4">
            <Typography
              variant="h6"
              sx={{ marginBottom: "0.5rem", color: "#252B42" }}
            >
              Description
            </Typography>
            <TextField
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{ marginBottom: "1rem" }}
              placeholder="Describe your issue in detail"
              required
            />
          </div>
          <div className="my-4">
            <Typography
              variant="h6"
              sx={{ marginBottom: "0.5rem", color: "#252B42" }}
            >
              Attachment
            </Typography>
            <input
              type="file"
              onChange={(e) => setAttachment(e.target.files[0])}
              className="border-2 border-gray-500 px-4 py-2 w-full"
            />
          </div>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#23A6F0",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#1e88e5",
              },
              width: "100%",
              marginTop: "1rem",
            }}
          >
            Submit Ticket
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateTicket;
