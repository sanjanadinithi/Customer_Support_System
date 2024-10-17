import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineDelete } from "react-icons/md";
import { Tooltip, Skeleton, Pagination } from "@mui/material";

const LoadingSkeleton = () => (
  <tr>
    <td colSpan="5" className="py-4 px-6 text-center text-gray-500">
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="60%" />
    </td>
  </tr>
);

const TicketTable = ({
  tickets,
  loading,
  onDelete,
  page,
  setPage,
  totalPages,
}) => {
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse rounded-lg overflow-hidden shadow-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left text-gray-700 border-b">No</th>
            <th className="py-3 px-4 text-left text-gray-700 border-b">
              Title
            </th>
            <th className="py-3 px-4 text-left text-gray-700 border-b max-md:hidden">
              Email
            </th>
            <th className="py-3 px-4 text-left text-gray-700 border-b">Date</th>
            <th className="py-3 px-4 text-left text-gray-700 border-b">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <>
              <LoadingSkeleton />
              <LoadingSkeleton />
              <LoadingSkeleton />
            </>
          ) : tickets.length > 0 ? (
            tickets.map((ticket, index) => (
              <tr key={ticket._id} className="border-b">
                <td className="py-2 px-4 text-gray-600">
                  {index + 1 + (page - 1) * 10}
                </td>
                <td className="py-2 px-4 text-gray-600">{ticket.title}</td>
                <td className="py-2 px-4 text-gray-600 max-md:hidden">
                  {ticket.email}
                </td>
                <td className="py-2 px-4 text-gray-600">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">
                  <div className="flex space-x-2">
                    <Link
                      to={`/ticket/details/${ticket._id}`}
                      state={{ ticket }}
                    >
                      <Tooltip title="View Details">
                        <BsInfoCircle className="text-blue-600 hover:text-blue-800 cursor-pointer" />
                      </Tooltip>
                    </Link>
                    <Link to={`/ticket/edit/${ticket._id}`} state={{ ticket }}>
                      <Tooltip title="Edit Ticket">
                        <AiOutlineEdit className="text-yellow-600 hover:text-yellow-800 cursor-pointer" />
                      </Tooltip>
                    </Link>
                    <Tooltip title="Delete Ticket">
                      <MdOutlineDelete
                        onClick={() => onDelete(ticket._id)}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                      />
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-4 px-6 text-center text-gray-500">
                No tickets found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTable;
