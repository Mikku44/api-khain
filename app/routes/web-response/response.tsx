import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import DOMPurify from "dompurify";
import type { IWeb } from "~/models/webModel";
import { webResponsesService } from "~/services/webResponseService";
import type { Route } from "./+types/response";
import FloatingAIChat from "~/components/FloatingAIChat";



export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {

  const webResponse = webResponsesService.getWebById(params.id);


  return webResponse;
}

export function meta({ data }: any) {
  if (!data) {
    return [
      { title: "Not Found - Khain.app" },
      { name: "description", content: "This web response could not be found." },
    ];
  }

  const title = data?.name || "Web Response";
  const description = `${title} - Web response created by Khain.app API`;

  return [
    { title },
    { name: "description", content: description },
  ];
}



export default function Response() {
  const { id } = useParams();
  const [web, setWeb] = useState<(IWeb & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
      let headerTag = document.querySelector("head > link:nth-child(6)");
      headerTag?.remove();
      headerTag = document.querySelector("head > link:nth-child(7)");
      headerTag?.remove();
      headerTag?.remove();
      headerTag = document.querySelector("head > style:nth-child(10)");
    
  }, [document]);

  useEffect(() => {
    if (!id) return;

    const unsubscribe = webResponsesService.listenWebById(id, (data) => {
      setWeb(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  if (loading) return <div className="flex w-full h-screen items-center justify-center">Loading...</div>;
  if (!web) return <div className="flex w-full h-screen items-center justify-center">Not found.</div>;


  const cleanHTML = (web.body || "");

  return (
    <div className="">
      {/* <FloatingAIChat /> */}
      {/* <h1 className="text-xl font-bold mb-4">{web.name || "Untitled Page"}</h1> */}
      {web.status !== "active" && <div className="w-full bg-indigo-500 text-white text-center
       sticky top-0 py-2 flex items-center justify-center gap-2">
        <Link to="/web-list" target="_blank" className="rounded-md border w-fit px-4 py-1 border-white">Preview Mode</Link>
        This web response is currently in draft mode.</div>}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: cleanHTML }}
      />

      {/* <div className="text-sm text-gray-500 mt-6">
        <p>Status: {web.status || "N/A"}</p>
        <p>
          Created at:{" "}
          {web.create_at?.toDate
            ? web.create_at.toDate().toLocaleString()
            : "unknown"}
        </p>
      </div> */}
    </div>
  );
}
