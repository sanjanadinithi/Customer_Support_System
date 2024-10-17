import React, { useState } from "react";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

const DeleteTicket = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteTicket = () => {
    setLoading(true);
    axios
      .delete(`http://localhost:5579/ticket/${id}`)
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Ticket Deleted successfully", { variant: "success" });
        navigate("/home");
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error", { variant: "error" });
        console.log(error);
      });
  };

  return (
    <div className="p-4">
      <BackButton />
      <h1
        className="text-3xl my-4"
        style={{ color: "#d32f2f", fontWeight: "bold" }}
      >
        Delete Ticket
      </h1>
      {loading ? <Spinner /> : ""}
      <div className="flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto">
        <h3 className="text-2xl">
          Are you sure you want to delete this ticket?
        </h3>

        <button
          className="p-4 bg-red-600 text-white m-8 w-full"
          onClick={handleDeleteTicket}
        >
          Yes, Delete it
        </button>
      </div>
    </div>
  );
};

export default DeleteTicket;
