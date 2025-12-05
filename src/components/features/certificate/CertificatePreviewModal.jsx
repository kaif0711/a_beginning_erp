import Modal from "react-modal";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";

Modal.setAppElement("#root");

const CertificatePreviewModal = ({ isOpen, onClose, certificate }) => {
  if (!certificate) return null;

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
      {/* Close Button */}
      <button
        onClick={() => onClose(false)}
        className="absolute top-4 left-4 cursor-pointer text-xl"
      >
        <RxCross2 />
      </button>

      {/* Heading */}
      <h1 className="text-2xl font-semibold text-center mb-6">
        Certificate Preview
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
          src={certificate.certificateUrl}
          alt="Certificate"
          className="object-contain rounded-lg shadow transition-transform duration-300"
          style={{
            transform: zoomed ? "scale(1.5)" : "scale(1)",
            transformOrigin: "top center",
            maxHeight: zoomed ? "scale(1)" : "60vh",
          }}
        />
      </div>
    </Modal>
  );
};

export default CertificatePreviewModal;
