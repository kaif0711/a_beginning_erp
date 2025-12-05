import Modal from "react-modal";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";

Modal.setAppElement("#root");

const InternshipPreviewModal = ({ isOpen, onClose, internship }) => {
  if (!internship) return null;

  const [zoomed, setZoomed] = useState(false);

  const handleZoomToggle = () => {
    setZoomed((prev) => !prev);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => onClose(false)}
      className="
        bg-white p-6 rounded-2xl shadow-lg 
        w-[95%] sm:w-[90%] md:w-[70%] lg:w-[50%]
        max-h-[90vh] mx-auto outline-none relative
        overflow-hidden z-[99999]
      "
      overlayClassName="
        fixed inset-0 bg-[#00000083] backdrop-blur-sm 
        flex justify-center items-center z-[99998]
      "
    >
      {/* CLOSE BUTTON */}
      <button
        onClick={() => onClose(false)}
        className="absolute top-4 left-4 cursor-pointer text-xl"
      >
        <RxCross2 />
      </button>

      {/* HEADING */}
      <h1 className="text-2xl font-semibold text-center mb-6">
        Internship Letter Preview
      </h1>

      {/* IMAGE WRAPPER */}
      <div
        className={`
    px-2 flex justify-center items-center relative
    ${zoomed ? "overflow-y-scroll" : "overflow-hidden"}
  `}
        style={{
          maxHeight: "70vh",
          cursor: zoomed ? "zoom-out" : "zoom-in",
        }}
        onClick={handleZoomToggle}
      >
        <img
          src={internship.intershipLetterUrl}
          alt="Internship Letter"
          className="object-contain rounded-lg shadow transition-transform duration-300"
          style={{
            transform: zoomed ? "scale(2)" : "scale(1)",
            transformOrigin: "top center",
            maxHeight: zoomed ? "scale(2)" : "70vh",
          }}
        />
      </div>
    </Modal>
  );
};

export default InternshipPreviewModal;
