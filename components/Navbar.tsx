"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const links = [
  {
    href: "/home",
    label: "Crear orden",
    primary: true,
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
  },
  {
  href: "/history",
  label: "Historial",
  primary: false,
  icon: (
    <svg width="20" height="13" viewBox="0 0 20 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 3H0V1H5V3ZM5 6H0V8H5V6ZM18.59 13L14.76 9.17C13.96 9.69 13.02 10 12 10C9.24 10 7 7.76 7 5C7 2.24 9.24 0 12 0C14.76 0 17 2.24 17 5C17 6.02 16.69 6.96 16.17 7.75L20 11.59L18.59 13ZM15 5C15 3.35 13.65 2 12 2C10.35 2 9 3.35 9 5C9 6.65 10.35 8 12 8C13.65 8 15 6.65 15 5ZM0 13H10V11H0V13Z" fill="currentColor"/>
    </svg>
  ),
},
];

function NavContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const {  logout } = useAuth();

  return (
    <>
      {/* Logo */}
      <div className="mb-8 px-2">
        <Image
          src="/boxful_logo.png"
          alt="Boxful"
          width={110}
          height={30}
          priority
        />
      </div>

      {/* Menú label */}
      <p className="text-xs font-black text-gray-900 tracking-widest uppercase px-2 mb-3">
        Menú
      </p>

      {/* Links */}
      <nav className="flex flex-col gap-1 flex-1">
        {links.map(({ href, label, icon, primary }) => {
          const isActive = pathname === href;

          if (primary) {
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-6 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: isActive ? "#3b5bdb" : "transparent",
                  color: isActive ? "white" : "#6b7280",
                }}
              >
                {icon}
                {label}
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-6 rounded-xl text-sm font-medium transition-all"
              style={{
                background: isActive ? "#3b5bdb" : "transparent",
                color: isActive ? "white" : "#6b7280",
              }}
            >
              {icon}
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
        
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all w-full"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col h-screen w-64 bg-white border-r border-gray-100 px-4 py-6 fixed left-0 top-0 z-40">
        <NavContent />
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <Image
          src="/boxful_logo.png"
          alt="Boxful"
          width={90}
          height={26}
          priority
        />
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-gray-500 hover:text-gray-800 transition-colors p-1"
        >
          {open ? (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/30" />
          <aside
            className="absolute top-0 left-0 h-full w-64 bg-white flex flex-col px-4 py-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <NavContent onClose={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
