import { Link } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import { Button } from "@mui/material";

const BackButton = ({ destination = "/home" }) => {
  return (
    <div className="flex mb-4">
      <Link to={destination} style={{ textDecoration: "none" }}>
        <Button
          variant="contained"
          startIcon={<BsArrowLeft />}
          sx={{
            backgroundColor: "#23A6F0",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "50px",
            transition: "0.3s",
            "&:hover": {
              backgroundColor: "#1e88e5",
              transform: "scale(1.05)",
            },
          }}
        >
          Back
        </Button>
      </Link>
    </div>
  );
};

export default BackButton;
