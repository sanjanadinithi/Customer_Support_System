import React from "react";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
  const navigate = useNavigate();
  const logout = () => {
    axios
      .get(
        "http://localhost:5579/logout",

        { withCredentials: true }
      )
      .then((result) => {
        navigate("/login");
      });
  };

  return (
    <Button
      variant="contained"
      startIcon={<LogoutIcon />}
      sx={{
        backgroundColor: "#ff4081",
        color: "#ffffff",
        padding: "8px 16px",
        borderRadius: "50px",
        boxShadow: "0px 4px 8px rgba(255, 64, 129, 0.3)",
        transition: "0.3s",
        "&:hover": {
          backgroundColor: "#f50057",
          transform: "scale(1.05)",
        },
      }}
      onClick={logout}
    >
      LOGOUT
    </Button>
  );
};
