import { useEffect } from "react";
import Modal from "react-modal";
import Api from "../../../utils/apiClient";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const DeleteCourse = ({ isOpen2, onClose2, courseId }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen2 ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen2]);

  const handleDeleteCourse = async () => {
    try {
      const res = await Api.delete(`/course/remove?id=${courseId}`);

      if (res.status === 200) {
        toast.success("Course deleted successfully!");
        onClose2(false);
      }
    } catch (error) {
      toast.error("Failed to delete course!");
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
        mx-auto outline-none relative
      "
      overlayClassName="fixed inset-0 bg-[#00000083] backdrop-blur-sm flex justify-center items-center z-50"
    >
      <div className="pt-5 text-2xl text-center font-semibold">
        Are you sure you want to delete this course?
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={handleDeleteCourse}
          className="bg-red-600 font-semibold text-white px-4 py-2 rounded-xl hover:bg-white hover:text-red-600 hover:border hover:border-red-600"
        >
          Delete
        </button>

        <button
          onClick={() => onClose2(false)}
          className="bg-primary font-semibold text-white px-4 py-2 rounded-xl hover:bg-white hover:text-primary hover:border hover:border-primary"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default DeleteCourse;
