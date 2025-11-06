import React, { useState } from "react";
import { Copy, Check, BookOpen, Lock } from "lucide-react";
import type { Route } from "./+types/docs";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Documentaion API - Khain.app" },
    { name: "description", content: "Discover endpoints, integrations, and API documentation for Khain.app." },
  ];
}


export default function DocsPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text : string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const curlExample = `curl -X POST "https://api.khain.app/api/v1/web-response" \\
  -H "Authorization: Bearer YOUR_ACTIVE_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "body": "<h1>Hello World!</h1>",
    "name": "Example Web Response"
  }'`;

  const exampleResponse = `{
  "message": "Web response saved successfully",
  "data": {
    "id": "abc123xyz",
    "create_at": "2025-11-06T09:05:48.000Z",
    "body": "<h1>Hello World!</h1>",
    "name": "Example Web Response",
    "user_id": "UidlHdFGEXc0UmWmbfRQ9yqO9Cf2",
    "status": "active"
  },
  "url": "https://api.khain.app/web/abc123xyz"
}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-[960px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="text-xl font-bold text-gray-900">Khain</div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <a href="#" className="text-gray-900 font-medium">Documentation</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">API Reference</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Guides</a>
            </div>
          </div>
          <a
            href="https://api.khain.app"
            className="text-sm font-medium text-gray-900 hover:text-gray-600"
          >
            Dashboard
          </a>
        </div>
      </nav>

      <div className="max-w-[960px] mx-auto px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24">
              <div className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
                Documentation
              </div>
              <nav className="space-y-1">
                <a href="#overview" className="block py-2 text-sm text-gray-600 hover:text-gray-900">
                  Overview
                </a>
                <a href="#authentication" className="block py-2 text-sm text-gray-900 font-medium">
                  Authentication
                </a>
                <a href="#making-requests" className="block py-2 text-sm text-gray-600 hover:text-gray-900">
                  Making requests
                </a>
                <a href="#response-schema" className="block py-2 text-sm text-gray-600 hover:text-gray-900">
                  Response schema
                </a>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            {/* Header */}
            <header className="mb-12">
              <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                API Reference
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Create and manage dynamic web responses through our REST API.
              </p>
            </header>

            {/* Overview */}
            <section id="overview" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-base text-gray-600 leading-relaxed mb-4">
                The Khain API allows you to programmatically create web responses that can be accessed via unique URLs. All API requests must be made over HTTPS and include proper authentication headers.
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
                <div className="font-mono text-gray-900">
                  <span className="text-green-600">POST</span> https://api.khain.app/api/v1/web-response
                </div>
              </div>
            </section>

            {/* Authentication */}
            <section id="authentication" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Authentication</h2>
              <p className="text-base text-gray-600 leading-relaxed mb-6">
                The Khain API uses Bearer token authentication. Include your API key in the Authorization header of every request.
              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Getting your API key</div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Visit <a href="https://api.khain.app" className="text-blue-600 hover:underline font-medium">api.khain.app</a>, navigate to "New API Key", click "Generate Key", and copy your token.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-semibold text-gray-900 mb-2">Header format:</div>
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-white/80">
                  Authorization: Bearer YOUR_ACTIVE_TOKEN
                </div>
              </div>
            </section>

            {/* Making Requests */}
            <section id="making-requests" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Making requests</h2>
              <p className="text-base text-gray-600 leading-relaxed mb-6">
                Send a POST request to the endpoint with your HTML content and an optional name for the web response.
              </p>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">Example request</h3>
                  <button
                    onClick={() => handleCopy(curlExample)}
                    className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 font-medium"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <pre className="p-4 overflow-x-auto text-sm text-white/80 font-mono">
                    <code>{curlExample}</code>
                  </pre>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Request body</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Parameter</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="py-3 px-4 font-mono text-gray-900">body</td>
                        <td className="py-3 px-4 text-gray-600">string</td>
                        <td className="py-3 px-4 text-gray-600">HTML content to be rendered</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-mono text-gray-900">name</td>
                        <td className="py-3 px-4 text-gray-600">string</td>
                        <td className="py-3 px-4 text-gray-600">Optional name for the web response</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Example response</h3>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <pre className="p-4 overflow-x-auto text-sm text-white/80 font-mono">
                    <code>{exampleResponse}</code>
                  </pre>
                </div>
              </div>
            </section>

            {/* Response Schema */}
            <section id="response-schema" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Response schema</h2>
              <p className="text-base text-gray-600 leading-relaxed mb-6">
                The API returns a JSON object containing the operation status, saved data, and a public URL.
              </p>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Field</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="bg-white">
                      <td className="py-3 px-4 font-mono text-gray-900">message</td>
                      <td className="py-3 px-4 text-gray-600">string</td>
                      <td className="py-3 px-4 text-gray-600">Status message indicating success or failure</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="py-3 px-4 font-mono text-gray-900">data</td>
                      <td className="py-3 px-4 text-gray-600">object</td>
                      <td className="py-3 px-4 text-gray-600">Web response object containing all saved data</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="py-3 px-4 pl-8 font-mono text-gray-900">data.id</td>
                      <td className="py-3 px-4 text-gray-600">string</td>
                      <td className="py-3 px-4 text-gray-600">Unique identifier for the web response</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="py-3 px-4 pl-8 font-mono text-gray-900">data.create_at</td>
                      <td className="py-3 px-4 text-gray-600">string</td>
                      <td className="py-3 px-4 text-gray-600">ISO 8601 timestamp of creation time</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="py-3 px-4 pl-8 font-mono text-gray-900">data.body</td>
                      <td className="py-3 px-4 text-gray-600">string</td>
                      <td className="py-3 px-4 text-gray-600">HTML content stored in the web response</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="py-3 px-4 pl-8 font-mono text-gray-900">data.name</td>
                      <td className="py-3 px-4 text-gray-600">string</td>
                      <td className="py-3 px-4 text-gray-600">User-defined name for the web response</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="py-3 px-4 pl-8 font-mono text-gray-900">data.user_id</td>
                      <td className="py-3 px-4 text-gray-600">string</td>
                      <td className="py-3 px-4 text-gray-600">Unique identifier of the user who created it</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="py-3 px-4 pl-8 font-mono text-gray-900">data.status</td>
                      <td className="py-3 px-4 text-gray-600">string</td>
                      <td className="py-3 px-4 text-gray-600">Current status of the web response (e.g., "active")</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="py-3 px-4 font-mono text-gray-900">url</td>
                      <td className="py-3 px-4 text-gray-600">string</td>
                      <td className="py-3 px-4 text-gray-600">Public URL where the web response can be accessed</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Footer */}
            <footer className="pt-12 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  © 2025 Khain.app. All rights reserved.
                </p>
                <div className="flex items-center gap-6 text-sm">
                  <a href="mailto:khain.app@gmail.com" className="text-gray-600 hover:text-gray-900">
                    Support
                  </a>
                  {/* <a href="#" className="text-gray-600 hover:text-gray-900">
                    Terms
                  </a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Privacy
                  </a> */}
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}