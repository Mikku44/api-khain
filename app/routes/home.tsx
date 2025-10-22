import type { Route } from "./+types/home";
import { useEffect, useState } from "react";
import { IoChevronBackOutline, IoChevronForward, IoSearch } from "react-icons/io5";
import { LuEye } from "react-icons/lu";
import GenerateKeyModal from "~/components/GenerateKey";
import { Dropdown } from "~/components/Select";
import { useAuthListener } from "~/libs/firebase/auth";
import type { IToken } from "~/models/tokenModel";
import { listenAPIKeysWithUser } from "~/services/apiService";
import { deleteToken } from "~/services/apiService"; // import your delete function

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "API - Khain.app" },
    { name: "description", content: "Discover endpoints, integrations, and API documentation for Khain.app." },
  ];
}

const statusOptions = [
  { label: "All", value: null },
  { label: "Expired", value: "expired" },
  { label: "Active", value: "active" },
];

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [messageSearch, setMessageSearch] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [curStatus, setStatus] = useState<string | null>(null);
  const [keys, setKeys] = useState<IToken[]>([]);

  const [viewKey, setViewKey] = useState<IToken | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<IToken | null>(null);

  useAuthListener();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) setCurrentUser(JSON.parse(user));
  }, []);

  useEffect(() => {
    if (currentUser) {
      const unsub = listenAPIKeysWithUser(currentUser.uid, (tokens) => {
        setKeys(tokens);
      });
      return () => unsub();
    }
  }, [currentUser]);

  // Copy token to clipboard
  const copyToClipboard = (token: string) => {
    navigator.clipboard.writeText(token);
    alert("Token copied to clipboard!");
  };

  // Handle hard delete
  const handleDelete = async () => {
    if (!confirmDelete) return;
    const result = await deleteToken(confirmDelete.id!);
    if (result.success) {
      setConfirmDelete(null);
      setViewKey(null);
    } else {
      alert("Failed to delete token.");
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden font-display">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-start gap-4 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                  API Key Management 
                </p>
                <p className="text-gray-500 dark:text-[#92adc9] text-base font-normal leading-normal">
                  Create, manage, and secure your API keys. For more information, read our{" "}
                  <a className="text-primary hover:underline" href="#">
                    API documentation
                  </a>.
                </p>
              </div>
              <div className="flex-shrink-0 pt-2">
                <button
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white gap-2 pl-5 text-base font-bold leading-normal tracking-[0.015em]"
                  onClick={() => setShowModal(true)}
                >
                  <span className="material-symbols-outlined">add</span>
                  <span className="truncate">Generate New API Key</span>
                </button>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="flex items-center gap-4 px-4 py-3">
              <div className="flex-grow">
                <label className="flex flex-col min-w-40 h-12 w-full">
                  <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                    <div className="text-gray-400 dark:text-[#92adc9] flex bg-gray-100 dark:bg-[#233648] items-center justify-center pl-4 rounded-l-lg border border-gray-200 dark:border-[#324d67] border-r-0">
                      <span className="material-symbols-outlined pr-4"><IoSearch /></span>
                    </div>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 
                      dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-200 
                      dark:border-[#324d67] bg-gray-100 dark:bg-[#233648] h-full placeholder:text-gray-400 
                      dark:placeholder:text-[#92adc9] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                      placeholder="Search by name or partial key..."
                      value={messageSearch}
                      type="text"
                      onChange={(e) => setMessageSearch(e.target.value)}
                    />
                  </div>
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Dropdown
                  options={statusOptions}
                  value={curStatus}
                  onChange={setStatus}
                  placeholder="Select font"
                />
              </div>
            </div>

            {/* Table */}
            <div className="px-4 py-3">
              <div className="flex overflow-hidden rounded-lg border border-gray-200 dark:border-[#324d67] bg-background-light dark:bg-[#111a22]">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-[#192633]">
                      {["Key Name", "Partial Key", "Status", "Permissions", "Last Used", "Actions"].map(
                        (header) => (
                          <th
                            key={header}
                            className="px-4 py-3 text-left text-gray-600 dark:text-white text-sm font-medium leading-normal"
                          >
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {keys
                      .filter(item => {
                        const statusMatch = curStatus
                          ? (item.status || item.plan).toLowerCase() === curStatus.toLowerCase()
                          : true;
                        const nameMatch = messageSearch
                          ? (item?.name || item?.plan || item?.id)
                            .toLowerCase()
                            .includes(messageSearch.toLowerCase())
                          : true;
                        return statusMatch && nameMatch;
                      })
                      .map((item, i) => {
                        const statusColor =
                          item.plan === "free" ? "green" :
                          item.plan === "pro" ? "blue" : "gray";

                        return (
                          <tr key={i} className="border-t border-t-gray-200 dark:border-t-[#324d67]">
                            <td className="h-[72px] px-4 py-2 text-gray-900 dark:text-white text-sm font-normal leading-normal">
                              {item.name || item.plan || item.id}
                            </td>
                            <td className="h-[72px] px-4 py-2 font-mono text-gray-500 dark:text-[#92adc9] text-sm">
                              {item.token.slice(0, 8)}...
                            </td>
                            <td className="h-[72px] px-4 py-2">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-800 dark:bg-${statusColor}-900/50 dark:text-${statusColor}-300`}
                              >
                                {item.status || item.plan}
                              </span>
                            </td>
                            <td className="h-[72px] px-4 py-2 text-gray-500 dark:text-[#92adc9] text-sm">
                              read/write
                            </td>
                            <td className="h-[72px] px-4 py-2 text-gray-500 dark:text-[#92adc9] text-sm">
                              {item.create_at?.seconds
                                ? new Date(item.create_at.seconds * 1000).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td className="h-[72px] px-4 py-2">
                              <button
                                className="text-gray-500 dark:text-[#92adc9] hover:text-primary"
                                onClick={() => setViewKey(item)}
                              >
                                <LuEye size={18} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Key Modal */}
      {showModal && (
        <GenerateKeyModal show={showModal} onClose={() => setShowModal(false)} />
      )}

      {/* View API Key Modal */}
      {viewKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#111a22] rounded-lg p-6 max-w-md w-full shadow-lg relative">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{viewKey.name || viewKey.plan}</h2>
            <p className="text-sm text-gray-500 dark:text-[#92adc9] mb-2">Created: {viewKey.create_at?.seconds ? new Date(viewKey.create_at.seconds * 1000).toLocaleString() : "N/A"}</p>
            <div className="flex items-center justify-between mb-4">
              <code className="font-mono break-all text-gray-700 dark:text-gray-200">{viewKey.token}</code>
              <button
                className="ml-2 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
                onClick={() => copyToClipboard(viewKey.token)}
              >
                Copy
              </button>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                onClick={() => setConfirmDelete(viewKey)}
              >
                Delete
              </button>
              <button
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-black dark:text-white rounded"
                onClick={() => setViewKey(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#111a22] rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Confirm Delete</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Are you sure you want to delete the API key <strong>{confirmDelete.name || confirmDelete.plan}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
              <button
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-black dark:text-white rounded"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
