import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { MdOutlineAddBox } from "react-icons/md";
import {
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  CircularProgress,
  Tooltip,
  Grid,
  Paper,
  Container,
} from "@mui/material";
import { motion } from "framer-motion";
import Image1 from "../components/login/Image/home3.jpg";

const Home = () => {
  const location = useLocation();
  const user = location.state?.user;
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5579/ticket", {
        params: { page: 1, limit: 10 }, // Static page for now
      });
      setTickets(response.data.data || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch tickets",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleDelete = (ticketId) => {
    setTicketToDelete(ticketId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5579/ticket/${ticketToDelete}`);
      setTickets(tickets.filter((ticket) => ticket._id !== ticketToDelete));
      setSnackbar({
        open: true,
        message: "Ticket deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting ticket:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete ticket",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <div
      style={{
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Background Image Section */}
      <Box
        sx={{
          backgroundImage: `url(${Image1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: { xs: "400px", sm: "500px", md: "600px" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          zIndex: 0,
          marginBottom: 5,
          paddingBottom: "20px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            padding: "20px",
            background: "rgba(0, 0, 0, 0.6)",
            borderRadius: "15px",
            maxWidth: "600px",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#fff", marginBottom: 2 }}
          >
            Welcome to the Support Ticket System
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: "1.2rem", color: "#fff" }}
          >
            Manage your tickets efficiently and with ease.
          </Typography>
        </motion.div>
      </Box>

      {/* Ticket List Section */}
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 4,
            marginBottom: 4,
            flexWrap: { xs: "wrap", sm: "nowrap" },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#0F172A" }}
          >
            {tickets.length === 0 ? "No Tickets Available" : "Current Tickets"}
          </Typography>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Tooltip title="Create a new support ticket" arrow>
              <Button
                component={Link}
                to="/ticket/create"
                state={{ user }}
                sx={{
                  backgroundColor: "#3B82F6",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "30px",
                  display: "flex",
                  alignItems: "center",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#2563EB",
                  },
                }}
              >
                <MdOutlineAddBox style={{ marginRight: "8px" }} />
                New Ticket
              </Button>
            </Tooltip>
          </motion.div>
        </Box>

        {/* Ticket List Grid */}
        <Grid container spacing={3}>
          {loading ? (
            <Box display="flex" justifyContent="center" mt={4} width="100%">
              <CircularProgress />
            </Box>
          ) : (
            tickets.map((ticket, index) => (
              <Grid item xs={12} sm={6} md={4} key={ticket._id}>
                <Paper
                  elevation={3}
                  sx={{
                    padding: 3,
                    borderRadius: 3,
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "scale(1.03)",
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Ticket #{index + 1}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                    {ticket.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created On:{" "}
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </Typography>
                  <Box
                    sx={{
                      marginTop: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      component={Link}
                      to={`/ticket/details/${ticket._id}`}
                      state={{ user }}
                      variant="contained"
                      sx={{
                        backgroundColor: "#3B82F6",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "#2563EB",
                        },
                        flex: 1,
                        marginRight: 1,
                      }}
                    >
                      View
                    </Button>
                    <Button
                      component={Link}
                      to={`/ticket/edit/${ticket._id}`}
                      state={{ user }}
                      variant="outlined"
                      sx={{
                        color: "#3B82F6",
                        borderColor: "#3B82F6",
                        flex: 1,
                        marginRight: 1,
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(ticket._id)}
                      variant="outlined"
                      color="error"
                      sx={{ flex: 1 }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))
          )}
        </Grid>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this ticket? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Home;
