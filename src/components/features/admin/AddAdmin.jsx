import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import Modal from "react-modal";
import Api from "../../../utils/apiClient";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const AddAdmin = ({ isOpen, onClose }) => {
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  const validate = () => {
    let newErrors = {};

    if (!adminUsername.trim()) {
      newErrors.username = "Username is required.";
    }

    if (!adminPassword.trim()) {
      newErrors.password = "Password is required.";
    } else if (adminPassword.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleAddAdmin = async () => {
    if (!validate()) {
      toast.error("Please fill required fields.");
      return;
    }

    try {
      await Api.post("/admin/create", {
        username: adminUsername,
        password: adminPassword,
      });

      toast.success("Admin created successfully!");
      onClose(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create admin!");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => onClose(false)}
      className="
        bg-white p-6 rounded-2xl shadow-lg 
        w-[95%] sm:w-[90%] md:w-[70%] lg:w-[40%]
        max-h-[95vh] mx-auto outline-none relative
        overflow-hidden
      "
      overlayClassName="fixed inset-0 bg-[#00000083] backdrop-blur-sm flex justify-center items-center z-50"
    >
      <button
        onClick={() => onClose(false)}
        className="absolute top-4 left-4 cursor-pointer text-xl"
      >
        <RxCross2 />
      </button>

      <h1 className="text-2xl font-semibold text-center mb-4">Add Admin</h1>

      <div className="overflow-y-auto max-h-[75vh] px-2">
        {/* USERNAME */}
        <label className="text-md text-gray-700 block mb-1 mt-4">
          Username
        </label>
        <input
          value={adminUsername}
          onChange={(e) => setAdminUsername(e.target.value)}
          type="text"
          placeholder="Enter Name"
          className="w-full border border-gray-400 rounded-lg px-3 py-2 outline-none"
        />
        {errors.username && (
          <p className="text-red-500 text-xs mt-1">{errors.username}</p>
        )}

        {/* PASSWORD */}
        <label className="text-md text-gray-700 block mb-1 mt-4">
          Password
        </label>
        <input
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          type="password"
          placeholder="Enter Password"
          className="w-full border border-gray-400 rounded-lg px-3 py-2 outline-none"
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
        )}

        {/* BUTTONS */}
        <div className="flex gap-4 justify-end mt-6">
          <button
            onClick={handleAddAdmin}
            className="bg-primary hover:bg-white hover:text-primary hover:border hover:border-primary 
                       px-6 py-2 text-white font-semibold rounded-xl"
          >
            Add
          </button>

          <button
            onClick={() => onClose(false)}
            className="bg-primary hover:bg-white hover:text-primary hover:border hover:border-primary 
                       px-6 py-2 text-white font-semibold rounded-xl"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddAdmin;
