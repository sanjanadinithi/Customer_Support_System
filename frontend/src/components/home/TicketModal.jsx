import React from "react";
import { AiOutlineClose, AiOutlineMail } from "react-icons/ai";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { FaPaperclip } from "react-icons/fa";
import { MdShare } from "react-icons/md";
import { PDFDownloadLink } from "@react-pdf/renderer";
import TicketReport from "./TicketReport";

const TicketModal = ({ tickets, onClose }) => {
  const createShareEmail = () => {
    const subject = `Ticket Details: ${tickets.title}`;
    const body = `
      Ticket ID: ${tickets._id}
      Title: ${tickets.title}
      Email: ${tickets.email}
      Description: ${tickets.description}
      Created At: ${new Date(tickets.createdAt).toLocaleString()}
      Updated At: ${new Date(tickets.updatedAt).toLocaleString()}
      ${
        tickets.attachment
          ? `Attachment: ${tickets.attachment.url}`
          : "No Attachment"
      }
    `;
    return `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div
      className="fixed bg-black bg-opacity-50 inset-0 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-[600px] max-w-full bg-white rounded-lg p-8 relative shadow-lg border border-gray-200"
      >
        {/* Close Button */}
        <AiOutlineClose
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-red-600 cursor-pointer transition duration-200"
          onClick={onClose}
        />

        {/* Issue Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {tickets.title}
        </h2>
        <h4 className="text-gray-500 mb-4">Ticket ID: {tickets._id}</h4>

        {/* Ticket Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Description:
          </h3>
          <p className="text-gray-700">{tickets.description}</p>
        </div>

        {/* Ticket Owner's Email */}
        <div className="flex items-center gap-3 mb-6">
          <AiOutlineMail className="text-blue-500 text-2xl" />
          <h2 className="text-lg text-gray-800">
            <a
              href={`mailto:${tickets.email}`}
              className="text-blue-600 hover:underline"
            >
              {tickets.email}
            </a>
          </h2>
        </div>

        {/* Created At */}
        <div className="flex items-center gap-3 mb-6">
          <AccessTimeIcon className="text-blue-500 text-2xl" />
          <h2 className="text-lg text-gray-800">
            Created: {new Date(tickets.createdAt).toLocaleString()}
          </h2>
        </div>

        {/* Updated At */}
        <div className="flex items-center gap-3 mb-6">
          <AccessTimeIcon className="text-blue-500 text-2xl" />
          <h2 className="text-lg text-gray-800">
            Updated: {new Date(tickets.updatedAt).toLocaleString()}
          </h2>
        </div>

        {/* Attachment Section */}
        {tickets.attachment ? (
          <div className="flex items-center gap-3 mb-6">
            <FaPaperclip className="text-blue-500 text-2xl" />
            <h2 className="text-lg text-gray-800">
              Attachment:{" "}
              <a
                href={tickets.attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline hover:text-blue-700"
              >
                {tickets.attachment.name || "Download Attachment"}
              </a>
            </h2>
          </div>
        ) : (
          <div className="flex items-center gap-3 mb-6">
            <FaPaperclip className="text-blue-500 text-2xl" />
            <h2 className="text-lg text-gray-800">No Attachment</h2>
          </div>
        )}

        {/* Share Button */}
        <div className="flex justify-between p-4 border-t border-gray-200">
          <a
            href={createShareEmail()}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 shadow-md"
            aria-label="Share ticket via email"
          >
            <MdShare className="mr-2" />
            Share Ticket
          </a>

          {/* PDF Report Generation Button */}
          <PDFDownloadLink
            document={<TicketReport ticket={tickets} />}
            fileName={`Ticket_Report_${tickets._id}.pdf`}
            className="flex items-center px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200 shadow-md"
            aria-label="Download ticket report"
          >
            {({ loading }) =>
              loading ? "Generating Report..." : "Download Report"
            }
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
