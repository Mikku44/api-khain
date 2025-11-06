import { useEffect, useState } from "react";
import type { Route } from "./+types/payments";
import { transactionsService } from "~/services/transactionsService";

// --- META ---
export function meta() {
  return [
    { title: "My Transactions - Khain.app" },
    { name: "description", content: "View your payment history and API usage transactions." },
  ];
}

// --- COMPONENT ---
export default function TransactionsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage
  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) setCurrentUser(JSON.parse(user));
  }, []);

  // Fetch transactions for the current user
  useEffect(() => {
    if (!currentUser) return;

    const fetchTransactions = async () => {
      try {
        const data = await transactionsService.getAllWithUserID(currentUser.uid);
        // Sort newest first
        const sorted = data.sort(
          (a: any, b: any) =>
            (b.created_at.seconds ?? b.created_at) - (a.created_at.seconds ?? a.created_at)
        );
        setTransactions(sorted);
      } catch (err) {
        console.error("Failed to load transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentUser]);

  // Helper: Group by date (Today, Yesterday, Older)
  const groupTransactions = () => {
    const now = new Date();
    const today: any[] = [];
    const yesterday: any[] = [];
    const older: any[] = [];

    for (const tx of transactions) {
      const txDate = new Date(tx.created_at?.toDate ? tx.created_at.toDate() : tx.created_at);
      const diff = Math.floor((now.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diff < 1) today.push(tx);
      else if (diff < 2) yesterday.push(tx);
      else older.push(tx);
    }

    return { today, yesterday, older };
  };

  // Compute totals
  const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const accountBalance = 18254 + totalAmount; // mock example

  if (!currentUser) {
    return (
      <main className="flex flex-col justify-center items-center h-screen text-gray-600">
        <p>Please sign in to view your transactions.</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex flex-col justify-center items-center h-screen text-gray-500">
        <p>Loading your transactions...</p>
      </main>
    );
  }

  const { today, yesterday, older } = groupTransactions();

  return (
    <main className="flex flex-col min-h-screen mt-[-80px] text-gray-900 bg-gray-50">
      {/* 1. Header / Card Section */}
      <div className="bg-zinc-900 w-full h-auto pb-20 px-6 pt-[120px] text-white relative overflow-hidden">
        <div className="flex max-w-[960px] mx-auto justify-center items-start mb-6">
          <div>
            <p className="text-base text-white">Payment history</p>
            <p className="text-4xl font-bold mt-1">
                Transactions
            </p>
          
          </div>

          
        </div>
      </div>

      {/* 2. Balance + Transaction list */}
      <div className="w-full max-w-lg mx-auto mt-[-80px] px-4 sm:px-6 z-10">
        {/* Account Balance */}
        <div className="bg-white p-5 rounded-xl shadow-lg mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ฿ {accountBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
            {/* <a href="#" className="text-sm text-indigo-600 font-medium hover:text-indigo-500">
              View account
            </a> */}
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-xl shadow-lg pt-4 pb-1">
          <div className="px-5 mb-3 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Transactions</h2>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 8h18m-6 4h6m-6 4h6" />
            </svg>
          </div>

          {transactions.length === 0 ? (
            <div className="p-10 text-center text-gray-500 text-sm">No transactions found.</div>
          ) : (
            <div>
              {/* --- Today --- */}
              {today.length > 0 && (
                <>
                  <p className="px-5 py-2 text-sm font-semibold text-gray-500">Today</p>
                  {today.map((tx) => (
                    <TransactionRow key={tx.session_id} tx={tx} />
                  ))}
                </>
              )}

              {/* --- Yesterday --- */}
              {yesterday.length > 0 && (
                <>
                  <p className="px-5 py-2 text-sm font-semibold text-gray-500">Yesterday</p>
                  {yesterday.map((tx) => (
                    <TransactionRow key={tx.session_id} tx={tx} />
                  ))}
                </>
              )}

              {/* --- Older --- */}
              {older.length > 0 && (
                <>
                  <p className="px-5 py-2 text-sm font-semibold text-gray-500">Earlier</p>
                  {older.map((tx) => (
                    <TransactionRow key={tx.session_id} tx={tx} />
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-black rounded-full shadow-2xl flex items-center justify-center hover:bg-zinc-800 transition">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </main>
  );
}

// --- TransactionRow Component ---
function TransactionRow({ tx }: { tx: any }) {
  const createdAt = new Date(tx.created_at?.toDate ? tx.created_at.toDate() : tx.created_at);
  const iconBg = tx.name?.toLowerCase().includes("pro") ? "bg-purple-600" : "bg-black";

  return (
    <div className="flex items-center justify-between p-5 border-b border-b-zinc-200 last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>
          <span className="text-white font-bold text-xs">
            {tx.name?.[0]?.toUpperCase() ?? "?"}
          </span>
        </div>
        <div>
          <p className="font-medium text-gray-900">{tx.name}</p>
          <p className="text-xs text-gray-500">
            {createdAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
        </div>
      </div>

      <p className={`text-base font-semibold ${tx.amount < 0 ? "text-red-600" : "text-gray-900"}`}>
        {tx.amount < 0 ? "-" : "+"} ฿
        {Math.abs(tx.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
}
