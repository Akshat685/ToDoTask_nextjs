"use client";

import Script from "next/script";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" />
      <main>{children}</main>
    </>
  );
}
