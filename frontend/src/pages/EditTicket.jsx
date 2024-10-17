import React, { useState, useEffect } from "react";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Box, Button, Typography, TextField, Paper, Grid } from "@mui/material";

const EditTicket = () => {
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5579/ticket/${id}`)
      .then((response) => {
        setTitle(response.data.title);
        setEmail(response.data.email);
        setDescription(response.data.description);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("An error occurred. Check console for details.", {
          variant: "error",
        });
        console.error("Error fetching ticket:", error);
      });
  }, [id, enqueueSnackbar]);

  const handleEditTicket = () => {
    if (!title || !email || !description) {
      enqueueSnackbar("Please fill all the fields", { variant: "warning" });
      return;
    }

    const data = new FormData();
    data.append("title", title);
    data.append("email", email);
    data.append("description", description);
    if (attachment) {
      data.append("attachment", attachment);
    }

    setLoading(true);
    axios
      .put(`http://localhost:5579/ticket/${id}`, data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Ticket edited successfully", { variant: "success" });
        navigate("/home");
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error updating ticket", { variant: "error" });
        console.error("Error updating ticket:", error);
      });
  };

  return (
    <Box
      sx={{ padding: "2rem", backgroundColor: "#f7f9fc", minHeight: "100vh" }}
    >
      <BackButton />
      <Typography
        variant="h4"
        sx={{ marginBottom: "1.5rem", color: "#252B42", fontWeight: "bold" }} // Dark blue for text
      >
        Edit Ticket
      </Typography>
      {loading && <Spinner />}
      <Paper
        elevation={8}
        sx={{
          padding: "2rem",
          borderRadius: "16px",
          backgroundColor: "#ffffff",
          width: "600px",
          margin: "auto",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={{ marginBottom: "0.5rem", color: "#252B42" }} // Dark blue for text
            >
              Title
            </Typography>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={title}
              inputProps={{ readOnly: true }} // Make the title field read-only
              sx={{ marginBottom: "1rem" }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={{ marginBottom: "0.5rem", color: "#252B42" }} // Dark blue for text
            >
              Email
            </Typography>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              inputProps={{ readOnly: true }} // Make the email field read-only
              sx={{ marginBottom: "1rem" }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={{ marginBottom: "0.5rem", color: "#252B42" }} // Dark blue for text
            >
              Description
            </Typography>
            <TextField
              label="Description"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ marginBottom: "1rem" }}
              placeholder="Describe your issue in detail"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={{ marginBottom: "0.5rem", color: "#252B42" }} // Dark blue for text
            >
              Attachment
            </Typography>
            <input
              type="file"
              onChange={(e) => setAttachment(e.target.files[0])}
              className="border-2 border-gray-500 px-4 py-2 w-full"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleEditTicket}
              sx={{
                backgroundColor: "#23A6F0", // Blue color for button
                color: "#fff",
                "&:hover": { backgroundColor: "#1e88e5" }, // Darker blue on hover
                padding: "0.5rem 2rem",
                borderRadius: "8px",
                width: "100%",
              }}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default EditTicket;
