import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import { Box, Typography, Paper, Button, Grid } from "@mui/material";
import {
  Email as EmailIcon,
  Description as DescriptionIcon,
  AttachFile as AttachFileIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";

const ShowTicket = () => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get(`http://localhost:5579/ticket/${id}`);
        setTicket(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load ticket details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Box sx={{ padding: "2rem", textAlign: "center" }}>
        <Typography variant="h6" sx={{ color: "red" }}>
          {error}
        </Typography>
        <BackButton />
      </Box>
    );
  }

  if (!ticket) {
    return (
      <Box sx={{ padding: "2rem", textAlign: "center" }}>
        <Typography variant="h6" sx={{ color: "gray" }}>
          No ticket found.
        </Typography>
        <BackButton />
      </Box>
    );
  }

  return (
    <Box
      sx={{ padding: "2rem", backgroundColor: "#f4f7f6", minHeight: "100vh" }}
    >
      <BackButton />
      <Typography
        variant="h4"
        sx={{ marginBottom: "1.5rem", color: "#252B42", fontWeight: "bold" }} // Dark blue for text
      >
        Ticket Details
      </Typography>
      <Paper
        elevation={8}
        sx={{
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: 3,
          background: "#ffffff",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                padding: "1rem",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <AccessTimeIcon sx={{ color: "#00796b", marginRight: 1 }} />
              <Typography variant="body1" sx={{ color: "#555" }}>
                Created At:{" "}
                <strong>{new Date(ticket.createdAt).toLocaleString()}</strong>
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                padding: "1rem",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <AccessTimeIcon sx={{ color: "#00796b", marginRight: 1 }} />
              <Typography variant="body1" sx={{ color: "#555" }}>
                Last Updated:{" "}
                <strong>{new Date(ticket.updatedAt).toLocaleString()}</strong>
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper
              elevation={2}
              sx={{
                padding: "1rem",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <DescriptionIcon sx={{ color: "#00796b", marginRight: 1 }} />
              <Typography variant="body1" sx={{ color: "#555" }}>
                Title: <strong>{ticket.title}</strong>
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper
              elevation={2}
              sx={{
                padding: "1rem",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <EmailIcon sx={{ color: "#00796b", marginRight: 1 }} />
              <Typography variant="body1" sx={{ color: "#555" }}>
                Email: <strong>{ticket.email}</strong>
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper
              elevation={2}
              sx={{
                padding: "1rem",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <DescriptionIcon sx={{ color: "#00796b", marginRight: 1 }} />
              <Typography variant="body1" sx={{ color: "#555" }}>
                Issue: <strong>{ticket.description}</strong>
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="body1"
              sx={{ color: "#555", marginBottom: "0.5rem" }}
            >
              Attachment:
            </Typography>
            {ticket.attachment ? (
              <Button
                variant="contained"
                href={ticket.attachment}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  backgroundColor: "#23A6F0",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#1e88e5" },
                  padding: "0.5rem 1rem",
                }}
              >
                <AttachFileIcon sx={{ marginRight: 1 }} />
                View Attachment
              </Button>
            ) : (
              <span>No attachment available</span>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ShowTicket;
