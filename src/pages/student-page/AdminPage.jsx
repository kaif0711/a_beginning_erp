// AdminPage.jsx
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Api from "../../utils/apiClient";
import { TiEdit } from "react-icons/ti";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrView } from "react-icons/gr";
import { toast } from "react-toastify";

import AddAdmin from "../../components/features/admin/AddAdmin";
import EditAdmin from "../../components/features/admin/EditAdmin";
import DeleteAdmin from "../../components/features/admin/DeleteAdmin";
import ViewAdminDetail from "../../components/features/admin/ViewAdminDetail";

const AdminPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [adminsData, setAdminsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [viewAdmin, setViewAdmin] = useState(null);

  // ========================================
  // FETCH ADMINS
  // ========================================
  const fetchAdmins = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await Api.get(`/admin/list?page=${page}&limit=${limit}`);
      const admins = res.data?.data?.admins || [];
      const pag = res.data?.data?.pagination || {};

      // FIX: normalize pagination
      setPagination({
        totalPage: pag.totalPage || Math.ceil((pag.total || 0) / limit),
        pageNo: pag.pageNo || pag.page || page,
      });

      setAdminsData(admins);

      if (admins.length === 0) setError("No admins found");
    } catch (err) {
      setError("Failed to fetch admins.");
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // SEARCH ADMINS
  // ========================================
  const searchAdmins = async (query) => {
    if (!query.trim()) return fetchAdmins();

    setLoading(true);
    setError("");

    try {
      const res = await Api.get(
        `/admin/search?q=${query}&page=${page}&limit=${limit}`
      );

      const admins = res.data?.data?.admins || [];
      const pag = res.data?.data?.pagination || {};

      // FIX: normalize pagination
      setPagination({
        totalPage: pag.totalPage || Math.ceil((pag.total || 0) / limit),
        pageNo: pag.pageNo || pag.page || page,
      });

      setAdminsData(admins);

      if (admins.length === 0) setError(`No results for "${query}"`);
    } catch (err) {
      setError("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  // Auto reload on page change
  useEffect(() => {
    if (searchQuery.trim()) searchAdmins(searchQuery);
    else fetchAdmins();
  }, [page]);

  const handleEditClick = (id) => {
    setSelectedAdminId(id);
    setShowModal1(true);
  };

  const handleDeleteClick = (id) => {
    setSelectedAdminId(id);
    setShowModal2(true);
  };

  const handleViewClick = (admin) => {
    setViewAdmin(admin);
    setShowModal3(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setShowModal1(false);
    setShowModal2(false);
    setShowModal3(false);
    setSelectedAdminId(null);

    if (searchQuery.trim()) searchAdmins(searchQuery);
    else fetchAdmins();
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
          <span key={i} className="px-2">
            ...
          </span>
        );
      }
    }

    return pages;
  };

  return (
    <div className="max-w-7xl mx-auto my-10 px-4 sm:px-8 md:px-16 lg:px-20 overflow-hidden">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admins</h1>

      {/* Search + Add */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search admin..."
            value={searchQuery}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
            onChange={(e) => {
              setPage(1);
              const val = e.target.value;
              setSearchQuery(val);
              searchAdmins(val);
            }}
          />
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white font-semibold rounded-lg px-6 py-3 shadow-md cursor-pointer"
        >
          Add Admin
        </button>
      </div>

      {/* TABLE */}
      {/* TABLE */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-2">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-primary text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Created At
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {/* Loading */}
              {loading && (
                <tr>
                  <td
                    colSpan="20"
                    className="text-center py-10 text-blue-600 font-semibold"
                  >
                    Loading...
                  </td>
                </tr>
              )}

              {/* Error */}
              {!loading && error && (
                <tr>
                  <td
                    colSpan="20"
                    className="text-center py-10 text-red-500 font-semibold"
                  >
                    {error}
                  </td>
                </tr>
              )}

              {/* No Data */}
              {!loading && !error && adminsData.length === 0 && (
                <tr>
                  <td
                    colSpan="20"
                    className="text-center py-10 text-gray-500 font-medium"
                  >
                    No admins available
                  </td>
                </tr>
              )}

              {/* DATA */}
              {!loading &&
                !error &&
                adminsData.length > 0 &&
                adminsData.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{admin.username}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          admin.status === "active"
                            ? "bg-green-100 text-green-700"
                            : admin.status === "deActive"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {admin.status || "N/A"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {admin.createdAt
                        ? new Date(admin.createdAt).toLocaleDateString("en-IN")
                        : "N/A"}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleViewClick(admin)}
                          className="bg-primary text-white rounded px-3 py-1 cursor-pointer"
                        >
                          <GrView />
                        </button>

                        <button
                          onClick={() => handleEditClick(admin.id)}
                          className="bg-primary text-white rounded px-3 py-1 cursor-pointer"
                        >
                          <TiEdit />
                        </button>

                        <button
                          onClick={() => handleDeleteClick(admin.id)}
                          className="bg-red-500 text-white rounded px-3 py-1 cursor-pointer"
                        >
                          <RiDeleteBin6Line />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      {pagination.totalPage > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
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

          {/* 🔥 Smart Jump Dropdown */}
          <select
            value={page}
            onChange={(e) => setPage(Number(e.target.value))}
            className="border px-3 py-2 rounded bg-white cursor-pointer"
          >
            {(() => {
              const total = pagination.totalPage;
              const current = page;

              const jumps = [];
              for (let i = 1; i <= total; i += 5) jumps.push(i);

              const nearby = [current - 1, current, current + 1];

              const options = [...new Set([...jumps, ...nearby])]
                .filter((p) => p >= 1 && p <= total)
                .sort((a, b) => a - b);

              return options.map((p) => (
                <option key={p} value={p}>
                  Go to Page {p}
                </option>
              ));
            })()}
          </select>
        </div>
      )}

      {/* MODALS */}
      {showModal && <AddAdmin isOpen={showModal} onClose={handleModalClose} />}
      {showModal1 && (
        <EditAdmin
          isOpen1={showModal1}
          adminId={selectedAdminId}
          onClose1={handleModalClose}
        />
      )}
      {showModal2 && (
        <DeleteAdmin
          isOpen2={showModal2}
          adminId={selectedAdminId}
          onClose2={handleModalClose}
        />
      )}
      {showModal3 && (
        <ViewAdminDetail
          isOpen3={showModal3}
          admin={viewAdmin}
          onClose3={handleModalClose}
        />
      )}
    </div>
  );
};

export default AdminPage;
