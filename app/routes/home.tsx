import type { Route } from "./+types/home";

import { useEffect, useState } from "react";
import { IoChevronBackOutline, IoChevronForward, IoSearch } from "react-icons/io5";
import { LuEye } from "react-icons/lu";
import GenerateKeyModal from "~/components/GenerateKey";
import { Dropdown } from "~/components/Select";
import { useAuthListener } from "~/libs/firebase/auth";
import type { IToken } from "~/models/tokenModel";
import { API_LIST } from "~/repositories/app";
import { getAPIKeys, getAPIKeysWithUser } from "~/services/apiService";


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

  useAuthListener()

  useEffect(() => {
    getAPIKeysWithUser("e007TgNAgI7oQoSfm9ry").then((result) => setKeys(result));
  }, []);

   useEffect(() => {
  
    const user = localStorage.getItem("currentUser");
    if (user) setCurrentUser(JSON.parse(user));
  }, []);

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
                              <button className="text-gray-500 dark:text-[#92adc9] hover:text-primary">
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


            {/* Pagination */}
            {/* <div className="flex items-center justify-center p-4">
              <nav className="flex items-center space-x-1">
                <a className="flex size-10 items-center justify-center text-gray-500 dark:text-white" href="#">
                  <span className="material-symbols-outlined text-lg"><IoChevronBackOutline /></span>
                </a>
                {[1, 2, 3].map((n) => (
                  <a
                    key={n}
                    className={`text-sm flex size-10 items-center justify-center rounded-full ${n === 1
                      ? "font-bold text-white bg-primary"
                      : "font-normal text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-[#233648]"
                      }`}
                    href="#"
                  >
                    {n}
                  </a>
                ))}
                <span className="text-sm flex size-10 items-center justify-center text-gray-500 dark:text-white">
                  ...
                </span>
                {[8, 9, 10].map((n) => (
                  <a
                    key={n}
                    className="text-sm font-normal flex size-10 items-center justify-center text-gray-700 dark:text-white rounded-full hover:bg-gray-200 dark:hover:bg-[#233648]"
                    href="#"
                  >
                    {n}
                  </a>
                ))}
                <a className="flex size-10 items-center justify-center text-gray-500 dark:text-white" href="#">
                  <span className="material-symbols-outlined text-lg"><IoChevronForward /></span>
                </a>
              </nav>
            </div> */}
          </div>
        </div>
      </div>

      {/* Modal */}
      <GenerateKeyModal show={showModal} onClose={() => setShowModal(false)} />


    </div>
  );
}