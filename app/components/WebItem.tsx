import { useState } from "react";
import { Pause, Play, Trash2 } from "lucide-react";
import { Link } from "react-router";
import type { IWeb } from "~/models/webModel";
import { webResponsesService } from "~/services/webResponseService";

interface Props {
  webList: IWeb[];
}

export default function WebItem({ webList }: Props) {
  const [confirmType, setConfirmType] = useState<"delete" | "run" | "pause" | null>(null);
  const [selectedWeb, setSelectedWeb] = useState<IWeb | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!selectedWeb || !confirmType) return;
    setLoading(true);

    try {
      if (confirmType === "delete") {
        await webResponsesService.deleteWebById(selectedWeb.id!);
      } else if (confirmType === "run") {
        await webResponsesService.createOrUpdateWeb({
          ...selectedWeb,
          status: "active",
        });
      } else if (confirmType === "pause") {
        await webResponsesService.createOrUpdateWeb({
          ...selectedWeb,
          status: "draft",
        });
      }

      setConfirmType(null);
      setSelectedWeb(null);
      window.location.reload(); // reload after completion
    } catch (err) {
      console.error("Action failed:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        All Web Responses
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {webList?.map((web) => (
          <Link
            key={web.id}
            className="group relative bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
            to={`/web/${web.id}`}
          >
            {/* Status dot */}
            <div className="absolute top-3 right-3">
              <span
                className={`inline-block w-3 h-3 rounded-full ${
                  web.status === "active"
                    ? "bg-green-500"
                    : web.status === "draft"
                    ? "bg-yellow-400"
                    : "bg-gray-300"
                }`}
              />
            </div>

            {/* Name */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                {web.name?.charAt(0).toUpperCase() || "W"}
              </div>
              <h3 className="text-lg font-medium text-gray-800 truncate">
                {web.name || "Untitled Workflow"}
              </h3>
            </div>

            {/* Meta info */}
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
              {web.body
                ? web.body.replace(/<[^>]+>/g, "").slice(0, 80) + "..."
                : "No description"}
            </p>

            {/* Bottom actions */}
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-gray-400">
                {/* {new Date(web.create_at.seconds * 1000).toLocaleDateString()} */}
              </span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                {/* Delete */}
                <button
                  className="p-1.5 hover:bg-gray-100 rounded-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedWeb(web);
                    setConfirmType("delete");
                  }}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>

                {/* Run / Pause */}
                <button
                  className="p-1.5 hover:bg-blue-50 rounded-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedWeb(web);
                    setConfirmType(web.status !== "active" ? "run" : "pause");
                  }}
                >
                  {web.status !== "active" ? (
                    <Play className="w-4 h-4 text-blue-500" />
                  ) : (
                    <Pause className="w-4 h-4 text-yellow-500" />
                  )}
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Confirm Modal */}
      {confirmType && selectedWeb && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-xl text-center">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              {confirmType === "delete"
                ? "Delete Web Response?"
                : confirmType === "run"
                ? "Activate Workflow?"
                : "Pause Workflow?"}
            </h3>

            <p className="text-gray-500 mb-4">
              {confirmType === "delete"
                ? `Are you sure you want to delete "${selectedWeb.name}"?`
                : confirmType === "run"
                ? `Do you want to run and activate "${selectedWeb.name}"?`
                : `Do you want to pause "${selectedWeb.name}"? It will move to draft.`}
            </p>

            <div className="flex justify-center gap-3">
              <button
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                disabled={loading}
                onClick={() => {
                  setConfirmType(null);
                  setSelectedWeb(null);
                }}
              >
                Cancel
              </button>

              <button
                className={`px-4 py-2 rounded-lg text-white ${
                  confirmType === "delete"
                    ? "bg-red-500 hover:bg-red-600"
                    : confirmType === "run"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-yellow-500 hover:bg-yellow-600"
                }`}
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : confirmType === "delete"
                  ? "Delete"
                  : confirmType === "run"
                  ? "Run"
                  : "Pause"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
