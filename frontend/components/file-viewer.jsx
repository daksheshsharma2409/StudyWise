"use client";

import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import { ExternalLink, FileText } from "lucide-react";

export function FileViewer({ resource }) {
    if (!resource || !resource.fileUrl) {
        return (
            <div className="flex h-96 w-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400">
                <FileText className="h-10 w-10 text-slate-300" />
                <p className="mt-2 text-sm font-medium">
                    No document file available to preview.
                </p>
            </div>
        );
    }

    const docs = [{ uri: resource.fileUrl, fileName: resource.title }];

    return (
        <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-2.5 backdrop-blur-sm">
                <div className="flex items-center gap-2 truncate">
                    <FileText className="h-4 w-4 text-indigo-500 shrink-0" />
                    <span className="truncate text-xs font-semibold text-slate-700">
                        {resource.title}
                    </span>
                </div>
                <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                    <span>Full view</span>
                    <ExternalLink className="h-3 w-3" />
                </a>
            </div>

            <div className="min-h-[550px] w-full bg-slate-100/50">
                <DocViewer
                    documents={docs}
                    pluginRenderers={DocViewerRenderers}
                    style={{
                        width: "100%",
                        height: 650,
                        backgroundColor: "#f8fafc",
                    }}
                    config={{
                        header: { disableHeader: true, disableFileName: true },
                    }}
                />
            </div>
        </div>
    );
}
