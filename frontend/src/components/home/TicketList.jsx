import React, { useState, useEffect } from "react";
import TicketCard from "./TicketCard";
import axios from "axios";
import { Link } from "react-router-dom";

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5579/ticket")
      .then((response) => setTickets(response.data.data))
      .catch((error) => console.error(error));
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTickets = tickets.filter((ticket) =>
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="p-4">
        {/* Move the search bar inside TicketCard */}
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border-2 border-gray-500 px-4 py-2 w-full"
        />
      </div>
      <div className="ticket-list">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))
        ) : (
          <p>No tickets found</p>
        )}
      </div>
    </div>
  );
};

export default TicketList;
