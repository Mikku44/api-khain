import { useEffect, useState } from "react";
import { GoCopy } from "react-icons/go";
import { createToken } from "~/services/apiService";

export default function GenerateKeyModal({ show, onClose }: { show: boolean; onClose: () => void }) {
  const [keyName, setKeyName] = useState("");
  const [permissions, setPermissions] = useState<{ read: boolean; write: boolean }>({ read: false, write: false });
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
   const [currentUser, setCurrentUser] = useState<any>(null);

  const handleGenerate = async () => {
    // simple random key generator (for demo purposes)
    // const key = `sk_${Math.random().toString(36).substring(2, 10)}_${Math.random()
    //   .toString(36)
    //   .substring(2, 6)}`;
      const result = await createToken({ user_id: currentUser.uid,name:keyName || "Free" })
    setGeneratedKey(result.data.token);
  };

  const handleSave  = () => {
    onClose()
    // window.location.reload();
  }

    useEffect(() => {
      // Load user from localStorage
      const user = localStorage.getItem("currentUser");
      if (user) setCurrentUser(JSON.parse(user));
    }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-background-dark rounded-xl shadow-2xl w-full max-w-lg">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Generate New API Key</h2>
            <button
              className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
              onClick={onClose}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <p className="mt-2 text-gray-500 dark:text-[#92adc9]">
            Assign a name and permissions to your new key.
          </p>

          <div className="mt-6 space-y-4">
            {/* Key Name */}
            <div>
              <label className="block text-sm mb-2 font-medium text-gray-700 dark:text-gray-300" htmlFor="key-name">
                Key Name
              </label>
              <input
                id="key-name"
                className="form-input w-full p-3 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-[#233648] border border-gray-300 dark:border-[#324d67] focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g. My Web App"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
              />
            </div>


            {/* Warning */}
            <div className="bg-blue-50 dark:bg-blue-900/30 flex-col border-blue-400 dark:border-blue-500 p-4 rounded-lg flex gap-2">
              <span className="material-symbols-outlined text-blue-500 dark:text-blue-400">warning</span>
              <p className="text-sm text-blue-700 dark:text-blue-200">
                <strong>Important:</strong> Your API key will be shown only once. Please copy and store it securely.
              </p>
            </div>

            {/* Generated Key Display */}
            {generatedKey && (
              <div className="relative bg-gray-100 dark:bg-[#233648] p-3 rounded-lg font-mono text-gray-800 dark:text-white break-all">
                {generatedKey}
                <div
                  onClick={() => navigator.clipboard.writeText(generatedKey)}
                  className="absolute top-[15px] right-2 text-gray-500 dark:text-gray-300 hover:text-primary"
                  title="Copy to clipboard"
                >
                  <span className="material-symbols-outlined text-lg"><GoCopy /></span>
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="py-4 flex justify-end gap-3 rounded-b-xl">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
              onClick={onClose}
            >
              Cancel
            </button>
            {generatedKey ? 
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90"
              onClick={handleSave}
            >
              Save
            </button>
            :
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90"
              onClick={handleGenerate}
            >
              Generate Key
            </button>}
          </div>
        </div>
      </div>
    </div>
  );
}
