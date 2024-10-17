import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateTicket from "./pages/CreateTicket";
import DeleteTicket from "./pages/DeleteTicket";
import EditTicket from "./pages/EditTicket";
import ShowTicket from "./pages/ShowTicket";
import Login from "./components/login/Login";
import SignUp from "./components/login/SignUp";
import LoginHome from "./components/login/LoginHome";
import TicketList from "./components/home/TicketList";
import { Navbar } from "./components/login/Navbar";
import "./styles.css";
import Admin from "./pages/Admin";
import ChatBot from "./components/ChatBot";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/loginhome" element={<LoginHome />} />
        <Route path="/ticket/create" element={<CreateTicket />} />
        <Route path="/ticket/delete/:id" element={<DeleteTicket />} />
        <Route path="/ticket/edit/:id" element={<EditTicket />} />
        <Route path="/ticket/details/:id" element={<ShowTicket />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/ticket/list" element={<TicketList />} />
        <Route path="/chatbot" element={<ChatBot />} />
      </Routes>
    </>
  );
};

export default App;
