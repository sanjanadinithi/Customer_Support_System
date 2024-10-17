import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import TicketCard from "../components/home/TicketCard";
import {
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  Snackbar,
  AppBar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { motion } from "framer-motion";

const Admin = () => {
  const [tickets, setTickets] = useState([]);
  const [deletedTickets, setDeletedTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortAscending, setSortAscending] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [newTicketNotification, setNewTicketNotification] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchTickets();
    fetchDeletedTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get("http://localhost:5579/ticket");
      setTickets(response.data.data);
      if (response.data.data.length > 0) {
        setNewTicketNotification(true);
        setSnackbarMessage("New tickets have been added.");
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletedTickets = async () => {
    try {
      const response = await axios.get("http://localhost:5579/ticket/deleted");
      setDeletedTickets(response.data.data);
    } catch (error) {
      console.error("Error fetching deleted tickets:", error);
    }
  };

  const handleRestore = async (id) => {
    try {
      await axios.put(`http://localhost:5579/ticket/restore/${id}`);
      fetchTickets();
      fetchDeletedTickets();
    } catch (error) {
      console.error("Error restoring ticket:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.put(`http://localhost:5579/ticket/delete/${id}`);
      fetchTickets();
      fetchDeletedTickets();
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  const handleSnackbarClose = () => {
    setNewTicketNotification(false);
  };

  const filteredTickets = tickets.filter((ticket) =>
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTickets = filteredTickets.sort((a, b) => {
    return sortAscending
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title);
  });

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <div style={{ background: "#f7f9fc", minHeight: "100vh", padding: "2rem" }}>
      <AppBar position="static" sx={{ mb: 4, backgroundColor: "#3B82F6" }}>
        <Typography variant="h5" sx={{ padding: "1rem", color: "#fff" }}>
          Ticket Management
        </Typography>
      </AppBar>

      {/* Tab Navigation */}
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ mb: 2 }}
      >
        <Tab label="Active Tickets" />
        <Tab label="Deleted Tickets" />
      </Tabs>

      {loading ? (
        <Spinner />
      ) : tabIndex === 0 ? (
        <TicketCard
          tickets={sortedTickets}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onDelete={handleDelete}
        />
      ) : (
        <Grid container spacing={3}>
          {deletedTickets.length > 0 ? (
            deletedTickets.map((ticket) => (
              <Grid item xs={12} sm={6} md={4} key={ticket._id}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    marginBottom: "1rem",
                    padding: "1.5rem",
                    backgroundColor: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    transition: "0.3s",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {ticket.title} (Deleted)
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#555" }}>
                    <strong>Email:</strong> {ticket.email}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#555" }}>
                    <strong>Description:</strong> {ticket.description}
                  </Typography>
                  {ticket.attachment && (
                    <Typography variant="body2" sx={{ color: "#555" }}>
                      <strong>Attachment:</strong>{" "}
                      <a
                        href={ticket.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View File
                      </a>
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ color: "#555" }}>
                    <strong>Created At:</strong>{" "}
                    {new Date(ticket.createdAt).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#555" }}>
                    <strong>Updated At:</strong>{" "}
                    {new Date(ticket.updatedAt).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#555" }}>
                    <strong>Deleted At:</strong>{" "}
                    {new Date(ticket.deletedAt).toLocaleString()}
                  </Typography>
                  <Box textAlign="right" mt={2}>
                    <Button
                      variant="contained"
                      color="success"
                      sx={{
                        padding: "0.5rem 1rem",
                        textTransform: "none",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                      }}
                      onClick={() => handleRestore(ticket._id)}
                    >
                      Restore
                    </Button>
                  </Box>
                </motion.div>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography>No deleted tickets found.</Typography>
            </Grid>
          )}
        </Grid>
      )}

      {/* Snackbar for New Ticket Notification */}
      <Snackbar
        open={newTicketNotification}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Admin;
