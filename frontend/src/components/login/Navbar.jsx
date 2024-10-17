import React, { useState } from "react";
import {
  AppBar,
  Typography,
  Toolbar,
  Button,
  Box,
  Drawer,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import { Logout } from "./Logout";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #071952 0%, #088395 100%)",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          padding: { xs: "10px 20px", md: "20px 40px" },
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
          {/* Logo or Title */}
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              letterSpacing: 1.5,
              color: "#ffffff",
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            Customer Support
          </Typography>

          {/* Desktop Navigation Buttons */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<LoginIcon />}
              sx={{
                color: "#ffffff",
                borderColor: "#ffffff",
                padding: { xs: "6px 14px", md: "8px 16px" },
                borderRadius: "30px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                borderWidth: "2px",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderColor: "#ffffff",
                  transform: "scale(1.05)",
                },
              }}
              onClick={() => navigate("/login")}
            >
              LOGIN
            </Button>

            <Logout />
          </Box>

          {/* Mobile Menu Icon */}
          <IconButton
            sx={{ display: { xs: "block", md: "none" }, color: "#fff" }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer for Mobile */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250, padding: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              color: "rgba(33,150,243,1)",
              marginBottom: 2,
            }}
          >
            Navigation
          </Typography>

          <Button
            fullWidth
            startIcon={<LoginIcon />}
            sx={{
              color: "#1976D2",
              justifyContent: "flex-start",
              marginBottom: 1,
              padding: "10px 20px",
              borderRadius: "10px",
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
            onClick={() => {
              setDrawerOpen(false);
              navigate("/login");
            }}
          >
            LOGIN
          </Button>

          <Logout onClose={() => setDrawerOpen(false)} />
        </Box>
      </Drawer>
    </>
  );
};
