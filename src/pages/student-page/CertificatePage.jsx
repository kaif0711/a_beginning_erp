// CertificatePage.jsx
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import Api from "../../utils/apiClient";
import AddCertificateEntry from "../../components/features/certificate/AddCertificate";
import { TbSend2 } from "react-icons/tb";
import { toast } from "react-toastify";
import ViewCertificateDetail from "../../components/features/certificate/ViewCertificateDetail";

const CertificatePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [certData, setCertData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({});

  // 🔹 Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const toDDMMYYYY = (dateString) => {
    const [yyyy, mm, dd] = dateString.split("T")[0].split("-");
    return `${dd}-${mm}-${yyyy}`;
  };

  // Fetch Certificates   API → certificate/list
  const fetchCertificates = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await Api.get(
        `/certificate/list?page=${page}&limit=${limit}`
      );

      const certs = res.data?.data?.certificate || [];
      const pag = res.data?.data?.pagination || {};

      setCertData(certs);
      setPagination(pag);

      if (certs.length === 0) setError("No certificate records found");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch certificate records.");
    } finally {
      setLoading(false);
    }
  };

  // Search Certificates   API → certificate/search
  const searchCertificates = async (query) => {
    if (!query.trim()) return fetchCertificates();

    setLoading(true);
    try {
      const res = await Api.get(
        `/certificate/search?q=${query}&page=${page}&limit=${limit}`
      );

      const certs = res.data?.data?.certificates || [];
      setCertData(certs);
      setPagination(res.data?.data?.pagination || {});

      if (certs.length === 0) setError(`No results for "${query}"`);
    } catch (err) {
      console.error(err);
      setError("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on search/page change
  useEffect(() => {
    if (searchQuery.trim()) searchCertificates(searchQuery);
    else fetchCertificates();
  }, [page, searchQuery]);

  const handleViewClick = (student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const handleSendCertificate = async (certificateId) => {
    try {
      const res = await Api.post(`/certificate/send-certificate?id=${certificateId}`);
      toast.success("certificate sent successfully!");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0]?.message ||
        "Failed to send certificate.";
      toast.error(msg);
    }
  };

  // Modal close + refresh list
  const handleModalClose = () => {
    setShowAddModal(false);
    setShowViewModal(false);
    setSelectedStudent(null);

    if (searchQuery.trim()) searchCertificates(searchQuery);
    else fetchCertificates();
  };

  const renderPageNumbers = () => {
    const total = pagination.totalPage;
    const current = pagination.pageNo;
    if (!total) return null;

    let pages = [];
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || Math.abs(i - current) <= 2) {
        pages.push(
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`px-3 py-1 rounded ${
              i === current ? "bg-primary text-white" : "bg-gray-200"
            }`}
          >
            {i}
          </button>
        );
      } else if (i === current - 3 || i === current + 3) {
        pages.push(
          <span key={`dots-${i}`} className="px-2">
            ...
          </span>
        );
      }
    }
    return pages;
  };

  return (
    <div className="max-w-7xl mx-auto my-10 px-4 sm:px-8 md:px-16 lg:px-20 overflow-hidden">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Certificate Students
      </h1>

      {/* Search + Add Student */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
            onChange={(e) => {
              setPage(1);
              const val = e.target.value;
              setSearchQuery(val);
              searchCertificates(val);
            }}
          />
        </div>

        {/* ADD STUDENT BUTTON */}
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-white font-semibold rounded-lg px-6 py-3 shadow-md cursor-pointer"
        >
          Add Student
        </button>
      </div>

      {/* Status messages */}
      {error && !loading && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-4">
          Loading...
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-2">
        <div
          className="overflow-x-auto"
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-primary text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Student Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Phone Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Course Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Issue Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {certData.length > 0
                ? certData.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {student.student.name || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {student.student.mobileNumber || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {student.student.email || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {student.course?.courseName || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {toDDMMYYYY(student.generatedAt) || "N/A"}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleViewClick(student)}
                            className="bg-primary text-white rounded px-3 py-1 cursor-pointer"
                          >
                            <GrView />
                          </button>
                          <button
                            onClick={() => handleSendCertificate(student.id)}
                            className="bg-primary text-white rounded px-3 py-1 cursor-pointer"
                          >
                            <TbSend2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                : !loading && (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-6 text-gray-500"
                      >
                        {error || "No certificate students available"}
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPage > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
          >
            Prev
          </button>

          {renderPageNumbers()}

          <button
            disabled={page >= pagination.totalPage}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <AddCertificateEntry isOpen={showAddModal} onClose={handleModalClose} />
      )}

      {/* View Detail Modal */}
      {showViewModal && (
        <ViewCertificateDetail
          isOpen={showViewModal}
          onClose={handleModalClose}
          certificate={selectedStudent}
        />
      )}
    </div>
  );
};

export default CertificatePage;
