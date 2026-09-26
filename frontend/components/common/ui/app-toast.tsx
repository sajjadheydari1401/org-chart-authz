"use client";

import { ToastContainer } from "react-toastify";

export function AppToast() {
  return (
    <ToastContainer
      rtl
      position="top-center"
      theme="light"
      autoClose={6000}
      limit={3}
      pauseOnFocusLoss
      pauseOnHover
      style={{
        width: "min(24rem, calc(100vw - 2rem))",
        maxWidth: "calc(100vw - 2rem)",
        margin: "1rem",
      }}
      toastClassName="!bg-surface !text-foreground !font-[inherit] border border-border !rounded-lg whitespace-pre-line break-words"
    />
  );
}
