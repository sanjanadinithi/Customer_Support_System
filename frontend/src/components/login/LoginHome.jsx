import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BiChat } from "react-icons/bi";
import { motion } from "framer-motion";
import Image1 from "./Image/cus1.jpg";

function LoginHome() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(location.state?.user);
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    if (!user) {
      axios
        .get("http://localhost:5579/user", { withCredentials: true })
        .then((response) => {
          if (response.data.user) {
            setUser(response.data.user);
          } else {
            navigate("/login");
          }
        })
        .catch(() => navigate("/login"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#FCFAEE]">
        <h1 className="text-2xl font-bold text-[#252B42]">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F0F4F8]">
      {/* Image Section */}
      <div
        className="w-2/5 bg-cover bg-center relative hidden lg:block"
        style={{ backgroundImage: `url(${Image1})` }}
      >
        <div className="absolute top-10 left-10 w-1/2 h-1/2 rounded-full bg-[#98DED9] opacity-30 blur-3xl transform -translate-x-1/2"></div>
        <div className="absolute bottom-10 right-10 w-1/3 h-1/3 rounded-full bg-[#98DED9] opacity-20 blur-2xl transform translate-x-1/2"></div>
      </div>

      {/* Content Section */}
      <div className="flex-grow flex flex-col justify-center items-center bg-white px-8 md:px-16 py-12 md:py-16">
        {/* Welcome Message */}
        <motion.p
          className="text-[#252B42] text-3xl md:text-4xl font-semibold mb-6 text-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Welcome, {user && user.name}!
        </motion.p>

        {/* Action Section */}
        <motion.div
          className="relative bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg text-center transition-all duration-300 transform hover:scale-105 hover:shadow-3xl z-10"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#23A6F0] to-[#FCFAEE] opacity-70 rounded-3xl z-[-1]"></div>

          {/* Admin Panel for ADMIN */}
          {user && user.role === "ADMIN" && (
            <motion.button
              onClick={() => navigate("/admin")}
              className="text-base text-white bg-[#23A6F0] py-2 px-3 rounded-lg mb-4 w-full font-medium shadow-lg hover:shadow-2xl transform hover:bg-[#1C92D2] transition-all duration-300"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
            >
              Manage Tickets
            </motion.button>
          )}

          {/* Actions for CUSTOMER */}
          {user && user.role === "CUSTOMER" && (
            <div className="flex flex-col gap-4 w-full">
              <motion.button
                onClick={() => navigate("/home", { state: { user } })}
                className="text-base text-white bg-[#23A6F0] py-2 px-3 rounded-lg w-full font-medium shadow-lg hover:shadow-2xl transform hover:bg-[#1C92D2] transition-all duration-300"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.97 }}
              >
                My Tickets
              </motion.button>

              <motion.button
                onClick={() => navigate("/chatbot")}
                className="text-base text-white bg-[#23A6F0] py-2 px-3 rounded-lg w-full font-medium shadow-lg hover:shadow-2xl flex items-center justify-center gap-2 transform hover:bg-[#1C92D2] transition-all duration-300"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.97 }}
              >
                <BiChat className="text-xl" />
                Chat with ECo
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default LoginHome;
