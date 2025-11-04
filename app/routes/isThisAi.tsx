import { useState, useEffect, useRef } from "react";
import { GoPaperAirplane } from "react-icons/go";
import type { Route } from "./+types/isThisAi";

// META
export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Is this Ai - Khain.app" },
        { name: "description", content: "Check if content or messages are from human or AI using Gemini Chat." },
    ];
}

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

export default function GeminiChatPage() {
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const chatEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom on new messages
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory]);

    // Handle input typing
    function handleType(event: React.ChangeEvent<HTMLInputElement>) {
        setMessage(event.target.value);
    }

    // Submit message
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!message.trim()) return;

        // Add user message to history
        const userMsg: ChatMessage = { role: "user", content: message };
        setChatHistory(prev => [...prev, userMsg]);
        setMessage("");
        setIsLoading(true);

        try {
            // Call Gemini Chat API
            const response = await fetch("/api/gemini_chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: message }),
            });

            if (!response.ok) throw new Error("Failed to fetch Gemini Chat");

            // Stream response (assume JSON with { reply: string })
            const data = await response.json();
            const assistantMsg: ChatMessage = { role: "assistant", content: data?.content?.parts?.[0]?.text };
            setChatHistory(prev => [...prev, assistantMsg]);
        } catch (err) {
            console.error(err);
            setChatHistory(prev => [...prev, { role: "assistant", content: "Error: failed to get response." }]);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="container-x flex overflow-auto flex-col gap-3 h-[80vh] items-center justify-center pt-10">
            {chatHistory.length === 0 && <div className="text-center">
                <h1 className="text-6xl text-black/80">Hello, Human!</h1>
                <p className="text-gray-600 mt-2 text-center max-w-lg">
                    Quickly check if content or messages are from a real human or AI. Stay confident and authentic online.
                </p>
            </div>
            }
            {/* Chat box */}
            { <div className={`flex flex-col w-full mt-6 p-4 prose`}>
               

                {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-2`}>
                        <div
                            className={`px-4 py-2 rounded-xl max-w-[70%] ${msg.role === "user" ? "bg-cyan-500 text-white" : "bg-gray-100 text-gray-900"
                                }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}

                <div ref={chatEndRef} />
            </div>}

            {/* Input form */}
            <form onSubmit={handleSubmit} className={` flex justify-center absolute duration-300
                 mt-4 ${chatHistory.length === 0 ? "bottom-[20%] w-[60%]" : "bottom-[2%] w-[90%]"}`}>
                <label htmlFor="input" className="w-[70%] relative border border-zinc-200 rounded-xl h-[50px] flex items-center">
                    <input
                        type="text"
                        id="input"
                        value={message}
                        onChange={handleType}
                        placeholder="Type your message..."
                        className="px-4 h-[50px] rounded-xl w-full focus:outline-none"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="absolute right-2 text-xl text-cyan-500 hover:text-cyan-600"
                    >
                        <GoPaperAirplane />
                    </button>
                </label>
            </form>

            {isLoading && <p className="text-gray-500 mt-2">Thinking...</p>}
        </main>
    );
}
