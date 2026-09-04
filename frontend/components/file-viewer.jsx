"use client";

import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";

export function FileViewer({ resource }) {
    const docs = [{ uri: resource.fileUrl, fileName: resource.title }];

    return (
        <DocViewer
            documents={docs}
            pluginRenderers={DocViewerRenderers}
            style={{ width: "100%", height: 600 }}
            config={{
                header: { disableHeader: false, disableFileName: true },
            }}
        />
    );
}
