import { useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import Modal from "react-modal";

Modal.setAppElement("#root");

const ViewAdminDetail = ({ isOpen3, onClose3, admin }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen3 ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen3]);

  if (!admin) return null;

  return (
    <Modal
      isOpen={isOpen3}
      onRequestClose={() => onClose3(false)}
      className="
        bg-white p-6 rounded-2xl shadow-lg 
        w-[95%] sm:w-[90%] md:w-[70%] lg:w-[50%]
        max-h-[90vh] mx-auto outline-none relative
        overflow-hidden
      "
      overlayClassName="fixed inset-0 bg-[#00000083] backdrop-blur-sm flex justify-center items-center z-50"
    >
      <button
        onClick={() => onClose3(false)}
        className="absolute top-4 left-4 cursor-pointer text-xl"
      >
        <RxCross2 />
      </button>

      <h1 className="text-2xl font-semibold text-center mb-6">Admin Details</h1>

      <div className="overflow-y-auto max-h-[70vh] px-2 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Detail label="Username" value={admin.username} />
          <Detail label="status" value={admin.status} />
          <Detail
            label="Created At"
            value={
              admin.createdAt
                ? new Date(admin.createdAt).toLocaleDateString("en-IN")
                : "N/A"
            }
          />
        </div>
      </div>
    </Modal>
  );
};

export default ViewAdminDetail;

/* REUSABLE COMPONENT */
const Detail = ({ label, value }) => (
  <div className="border p-4 rounded-lg bg-gray-50 shadow-sm">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-base font-medium text-gray-900 mt-1">{value}</p>
  </div>
);
