import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { RxCross2 } from "react-icons/rx";
import Api from "../../../utils/apiClient";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const EditSMTPModal = ({ isOpen, onClose, smtp }) => {
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState("");
  const [showPass, setShowPass] = useState(false);
  
  // Load SMTP values when modal opens
  useEffect(() => {
    if (isOpen && smtp) {
      setHost(smtp.host || "");
      setPort(smtp.port || "");
      setUsername(smtp.username || "");
      setPassword(smtp.password || "");
      setSecure(smtp.secure ? "true" : "false");
    }
  }, [isOpen, smtp]);

  // Disable scroll when modal open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  const handleClose = () => {
    onClose && onClose(false);
  };

  const handleSave = async () => {
    try {
      await Api.post("/admin/smtp", {
        host,
        port,
        username,
        ...(password && { password }),
        secure: secure === "true",
      });

      toast.success("SMTP details updated successfully!");
      handleClose();
    } catch (err) {
      console.log(err);
      toast.error("Update failed!");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="
        bg-white p-4 rounded-2xl shadow-lg 
        w-[95%] sm:w-[90%] md:w-[70%] lg:w-[50%]
        max-h-[100vh]
        mx-auto outline-none relative
        overflow-hidden
      "
      overlayClassName="fixed inset-0 bg-[#00000083] backdrop-blur-sm 
                        flex justify-center items-center z-50"
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        className="sm:hidden absolute left-0 text-sm sm:text-lg cursor-pointer pl-4"
      >
        <RxCross2 />
      </button>

      {/* Heading */}
      <div className="pt-5 text-2xl font-semibold">
        <h1>Edit SMTP Details</h1>
      </div>

      {/* Form */}
      <div className="mx-2 sm:mx-4 overflow-y-auto max-h-[70vh] pb-6 mt-5 pr-2">
        <div className="rounded-xl">
          {/* HOST */}
          <label className="text-xs text-gray-500 block mb-1 mt-4">Host</label>
          <input
            value={host}
            onChange={(e) => setHost(e.target.value)}
            type="text"
            className="w-full border border-gray-400 rounded-lg px-3 py-2 outline-none"
          />

          {/* PORT */}
          <label className="text-xs text-gray-500 block mb-1 mt-4">Port</label>
          <input
            value={port}
            onChange={(e) => setPort(e.target.value)}
            type="text"
            className="w-full border border-gray-400 rounded-lg px-3 py-2 outline-none"
          />

          {/* USERNAME */}
          <label className="text-xs text-gray-500 block mb-1 mt-4">
            Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            className="w-full border border-gray-400 rounded-lg px-3 py-2 outline-none"
          />

          <label className="text-xs text-gray-500 block mb-1 mt-4">
            Password
          </label>

          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 outline-none pr-10"
              placeholder="Leave blank to keep old password"
            />

            {/* Toggle Button */}
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm"
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>

          {/* SECURE */}
          <label className="text-xs text-gray-500 block mb-1 mt-4">
            Secure
          </label>
          <select
            value={secure}
            onChange={(e) => setSecure(e.target.value)}
            className="w-full border border-gray-400 rounded-lg px-3 py-2 outline-none"
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>

          {/* BUTTONS */}
          <div className="flex gap-4 justify-end mt-5">
            <button
              onClick={handleSave}
              className="
                bg-primary hover:bg-white hover:text-primary hover:border hover:border-primary 
                px-6 py-2 text-white font-semibold rounded-xl
              "
            >
              Update
            </button>

            <button
              onClick={handleClose}
              className="
                bg-primary hover:bg-white hover:text-primary hover:border hover:border-primary 
                px-6 py-2 text-white font-semibold rounded-xl
              "
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditSMTPModal;
