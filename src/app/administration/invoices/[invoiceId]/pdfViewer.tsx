"use client";

import { useEffect, useState } from "react";

interface Props {
    base64Pdf: string;
}

export function PdfViewer({ base64Pdf }: Props) {
    const [rendered, setRendered] = useState(false);

    useEffect(() => {
        setTimeout(() => setRendered(true));
    }, []);

    const buffer = Buffer.from(base64Pdf, "base64");
    const blob = new Blob([buffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    return (rendered && <iframe className="w-full h-full" key="HUHU" src={url} />);
}