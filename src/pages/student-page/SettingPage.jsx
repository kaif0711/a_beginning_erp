import React, { useEffect, useState } from "react";
import Api from "../../utils/apiClient";
import { TiEdit } from "react-icons/ti";
import EditSMTPModal from "../../components/features/setting/EditSMTPModal";

const SettingPage = () => {
  const [smtp, setSmtp] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showEdit, setShowEdit] = useState(false);

  // Fetch SMTP details
  const fetchSMTP = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await Api.get("/admin/smtpdetails");
      const data = res?.data?.data;
      setSmtp(data || {}); // ⭐ ALWAYS keep an object, never null
    } catch (err) {
      console.log(err);
      setError("Failed to fetch SMTP details.");
      setSmtp({}); // ⭐ keep structure visible even if failed
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSMTP();
  }, []);

  return (
    <div className="max-w-3xl mx-auto my-10 px-4 sm:px-8">

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">SMTP Settings</h1>

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-4">
          Loading...
        </div>
      )}

      {/* SETTINGS CARD */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-8 border border-gray-100">

        {/* HOST */}
        <div className="flex justify-between items-start pb-2 border-b border-gray-400">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Host</p>
            <p className="text-lg font-semibold text-gray-900">
              {smtp.host || "N/A"}
            </p>
          </div>
        </div>

        {/* PORT */}
        <div className="flex justify-between items-start pb-2 border-b border-gray-400">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Port</p>
            <p className="text-lg font-semibold text-gray-900">
              {smtp.port || "N/A"}
            </p>
          </div>
        </div>

        {/* USERNAME */}
        <div className="flex justify-between items-start pb-2 border-b border-gray-400">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Username</p>
            <p className="text-lg font-semibold text-gray-900">
              {smtp.username || "N/A"}
            </p>
          </div>
        </div>

        {/* PASSWORD */}
        <div className="flex justify-between items-start pb-2 border-b border-gray-400">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Password</p>
            <p className="text-lg font-semibold text-gray-900">
              {smtp.password || "N/A"}
            </p>
          </div>
        </div>

        {/* SECURE */}
        <div className="flex justify-between items-start pb-2 border-b border-gray-400">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Secure</p>
            <p className="text-lg font-semibold text-gray-900">
              {smtp.secure ? "Yes" : "No"}
            </p>
          </div>
        </div>

        {/* EDIT BUTTON */}
        <div className="flex justify-end pt-3">
          <button
            onClick={() => setShowEdit(true)}
            className="bg-primary text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 shadow-md"
          >
            <TiEdit className="text-xl" />
            Edit SMTP
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showEdit && (
        <EditSMTPModal
          isOpen={showEdit}
          onClose={() => {
            setShowEdit(false);
            fetchSMTP();
          }}
          smtp={smtp}
        />
      )}
    </div>
  );
};

export default SettingPage;
