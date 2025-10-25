"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Навбар без зависимостей от сторонних компонентов.
 * Ссылка "Админ" скрыта по умолчанию и показывается, если:
 *  - NEXT_PUBLIC_SHOW_ADMIN_LINK === "true", или
 *  - в localStorage выставлено showAdmin = "1"
 */
export default function Navbar() {
  const pathname = usePathname();

  const [showAdmin, setShowAdmin] = useState(false);
  useEffect(() => {
    const fromEnv = process.env.NEXT_PUBLIC_SHOW_ADMIN_LINK === "true";
    const fromLS =
      typeof window !== "undefined" && window.localStorage.getItem("showAdmin") === "1";
    setShowAdmin(Boolean(fromEnv || fromLS));
  }, []);

  const item = (href: string, label: string) => {
    const active =
      href === "/"
        ? pathname === "/"
        : pathname.startsWith(href);
    return (
      <Link
        href={href}
        className={
          "px-3 py-2 rounded-lg hover:bg-white/10 text-neutral-200 transition-colors " +
          (active ? "bg-white/10 text-white" : "")
        }
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/80 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60">
      <div className="container-max flex h-16 items-center justify-between">
        {/* Логотип */}
        <Link href="/" className="font-display text-2xl tracking-tight text-white">
          ELEGANCE AUTORENT
        </Link>

        {/* Навигация */}
        <nav className="flex items-center gap-2">
          {item("/#catalog", "Каталог машин")}
          {item("/#how", "Как это работает")}
          {item("/#contact", "Контакты")}
          {showAdmin && item("/admin", "Админ")}
        </nav>
      </div>
    </header>
  );
}
