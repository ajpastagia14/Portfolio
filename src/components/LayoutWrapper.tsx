"use client";

import { usePathname } from "next/navigation";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";
import { Mail } from "lucide-react";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {children}

      {!isAdmin && (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "var(--text-secondary)",
            fontSize: "12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", gap: 16 }}>
            <a
              href="https://www.linkedin.com/in/akshar-pastagia-228203269/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              style={{ color: "var(--text-secondary)" }}
            >
              <FaLinkedinIn size={14} />
            </a>
            <a
              href="https://github.com/ajpastagia14"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              style={{ color: "var(--text-secondary)" }}
            >
              <FaGithub size={14} />
            </a>
            <a
              href="mailto:aksharpastagia007@gmail.com"
              aria-label="Email"
              style={{ color: "var(--text-secondary)" }}
            >
              <Mail size={14} />
            </a>
          </div>
          <div>Designed and developed for Akshar Pastagia&apos;s professional portfolio.</div>
        </div>
      )}
    </>
  );
}
