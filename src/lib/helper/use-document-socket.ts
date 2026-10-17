"use client";

import { useEffect, useRef } from "react";
import { getSession } from "next-auth/react";
import { io } from "socket.io-client";

export interface DocumentProgressEvent {
  documentUuid: string;
  status: string;
  note?: string;
  notifiedTarget?: string;
  updatedBy: string;
  updatedAt: string;
}

// The gateway lives on the backend origin (the Next rewrite proxy does not carry websockets) and
// answers CORS only for the backend's FRONTEND_URL, so the connection stays quiet if that is wrong.
export function useDocumentSocket(onProgress: (event: DocumentProgressEvent) => void) {
  const handler = useRef(onProgress);
  useEffect(() => {
    handler.current = onProgress;
  });

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_API_URL;
    if (!url) return;
    let socket: ReturnType<typeof io> | undefined;
    let cancelled = false;
    void getSession().then((session) => {
      if (cancelled || !session?.accessToken) return;
      socket = io(`${url}/document-workflow`, {
        auth: { token: session.accessToken },
        reconnectionAttempts: 3,
      });
      socket.on("document-workflow.progress-updated", (event) =>
        handler.current(event),
      );
    });
    return () => {
      cancelled = true;
      socket?.disconnect();
    };
  }, []);
}
