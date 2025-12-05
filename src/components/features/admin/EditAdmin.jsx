import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import Modal from "react-modal";
import Api from "../../../utils/apiClient";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const EditAdmin = ({ isOpen1, onClose1, adminId }) => {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [password, setPassword] = useState("");

  // FETCH ADMIN DETAILS
  const fetchAdminDetail = async () => {
    try {
      const res = await Api.get(`/admin/details?id=${adminId}`);
      const a = res.data?.data;

      if (a) {
        setUsername(a.username || "");
        setStatus(a.status || "");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load admin details!");
    }
  };

  useEffect(() => {
    if (isOpen1 && adminId) {
      fetchAdminDetail();
    }
  }, [isOpen1, adminId]);

  // Disable scroll
  useEffect(() => {
    document.body.style.overflow = isOpen1 ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen1]);

  // CLOSE HANDLER
  const handleClose = () => {
    onClose1 && onClose1(false);
  };

  // UPDATE ADMIN
  const handleUpdateAdmin = async () => {
    try {
      await Api.put(`/admin/update?id=${adminId}`, {
        username,
        status,
        ...(password && { password }),
      });

      toast.success("Admin updated successfully!");
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error("Update failed!");
    }
  };

  return (
    <Modal
      isOpen={isOpen1}
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
        <h1>Edit Admin</h1>
      </div>

      {/* Form */}
      <div className="mx-2 sm:mx-4 overflow-y-auto max-h-[70vh] pb-6 mt-5 pr-2">
        <div className="rounded-xl">
          {/* USERNAME */}
          <label className="text-sm text-gray-700  font-semibold block mb-1 mt-4">
            Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            className="w-full border border-gray-400 rounded-lg px-3 py-2 outline-none"
          />

          {/* status */}
          <label className="text-sm text-gray-700 font-semibold block mb-1 mt-4">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-400 rounded-lg px-3 py-2 outline-none"
          >
            <option value="active">Active</option>
            <option value="deActive">Deactive</option>
          </select>

          {/* PASSWORD */}
          <label className="text-sm text-gray-700  font-semibold block mb-1 mt-4">
            Add New Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="w-full border border-gray-400 rounded-lg px-3 py-2 outline-none"
            placeholder="Leave blank to keep old password"
          />

          {/* BUTTONS */}
          <div className="flex gap-4 justify-end mt-5">
            <button
              onClick={handleUpdateAdmin}
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

export default EditAdmin;
