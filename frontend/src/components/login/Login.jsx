import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Grid, Paper, TextField, Typography, Button } from "@mui/material";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:5579/login",
        { email, password },
        { withCredentials: true }
      )
      .then((result) => {
        if (result.data) {
          navigate("/loginhome", { state: { user: result.data } });
        } else {
          alert("Login failed");
        }
      })
      .catch((err) => {
        console.error("Error during login:", err);
        alert("An error occurred. Please try again.");
      });
  };

  const paperStyle = {
    padding: "2rem",
    margin: "100px auto",
    borderRadius: "1rem",
    boxShadow: "10px 10px 10px",
  };
  const heading = { fontSize: "2.5rem", fontWeight: "600" };
  const row = { display: "flex", marginTop: "2rem" };
  const btnStyle = {
    marginTop: "2rem",
    fontSize: "1.2rem",
    fontWeight: "700",
    backgroundColor: "blue",
    borderRadius: "0.5rem",
  };
  const label = { fontWeight: "700" };

  return (
    <div>
      <Grid align="center" className="wrapper">
        <Paper
          style={paperStyle}
          sx={{
            width: {
              xs: "80vw",
              sm: "50vw",
              md: "40vw",
              lg: "30vw",
              xl: "20vw",
            },
            height: { lg: "60vh" },
          }}
        >
          <Typography component="h1" variant="h5" style={heading}>
            Login
          </Typography>
          <form onSubmit={handleLogin}>
            <span style={row}>
              <TextField
                sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
                style={label}
                label="Email"
                fullWidth
                variant="outlined"
                type="email"
                placeholder="Enter Email"
                name="email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </span>
            <span style={row}>
              <TextField
                sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
                label="Password"
                fullWidth
                variant="outlined"
                type="password"
                placeholder="Enter Password"
                name="password"
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </span>
            <Button style={btnStyle} variant="contained" type="submit">
              Login
            </Button>
          </form>
        </Paper>
      </Grid>
    </div>
  );
}

export default Login;
