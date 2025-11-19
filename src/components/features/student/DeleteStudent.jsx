import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import Modal from "react-modal";
import Api from "../../../utils/apiClient";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const DeleteStudent = ({ isOpen2, onClose2, studentId }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen2 ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen2]);

  const handleDeleteStudent = async () => {
    try {
      const res = await Api.delete(`/student/remove?id=${studentId}`);

      if (res.status === 200) {
        toast.success("Student deleted successfully!");
        onClose2(false);
      }
    } catch (error) {
      toast.error("Failed to delete student!");
      console.log(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen2}
      onRequestClose={() => onClose2(false)}
      className="
        bg-white p-4 rounded-2xl shadow-lg 
        w-[70%] sm:w-[60%] md:w-[50%] lg:w-[40%]
        max-h-[50vh]
        mx-auto outline-none relative overflow-hidden
      "
      overlayClassName="fixed inset-0 bg-[#00000083] backdrop-blur-sm flex justify-center items-center z-50"
    >
      <div>
        <div className="pt-5 text-2xl font-semibold text-center">
          <h1>Are you sure you want to delete?</h1>
        </div>

        <div className="flex gap-4 justify-end mt-8">
          <button
            onClick={handleDeleteStudent}
            className="bg-red-600 hover:bg-white hover:text-red-600 hover:border hover:border-red-600 
                       px-4 py-2 text-white font-semibold rounded-xl"
          >
            Delete
          </button>

          <button
            onClick={() => onClose2(false)}
            className="bg-primary hover:bg-white hover:text-primary hover:border hover:border-primary 
                       px-4 py-2 text-white font-semibold rounded-xl"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteStudent;
