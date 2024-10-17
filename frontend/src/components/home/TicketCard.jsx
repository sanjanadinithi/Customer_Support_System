import React, { useState } from "react";
import TicketSingleCard from "./TicketSingleCard";
import {
  Box,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import debounce from "lodash/debounce";

const TicketCard = ({ tickets = [], searchTerm, setSearchTerm, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Debounced search function
  const debouncedSearch = debounce((value) => {
    setSearchTerm(value);
  }, 300);

  // Handle Snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const filteredTickets = tickets.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ padding: 4 }}>
      {/* Search Bar */}
      <TextField
        variant="outlined"
        placeholder="Search by title..."
        onChange={(e) => debouncedSearch(e.target.value)}
        fullWidth
        sx={{
          mb: 4,
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#3B82F6",
            },
            "&:hover fieldset": {
              borderColor: "#1D4ED8",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1D4ED8",
            },
          },
        }}
      />

      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading tickets...
          </Typography>
        </Box>
      )}

      {/* Ticket Cards Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
        }}
      >
        {filteredTickets.length > 0 ? (
          filteredTickets.map((item) => (
            <TicketSingleCard
              key={item._id}
              ticket={item}
              onDelete={onDelete}
            />
          ))
        ) : (
          <Typography
            variant="h6"
            sx={{ gridColumn: "span 4", textAlign: "center", mt: 4 }}
          >
            No tickets found
          </Typography>
        )}
      </Box>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default TicketCard;
