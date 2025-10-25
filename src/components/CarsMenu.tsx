"use client";

import { useEffect, useRef, useState } from "react";

type Car = {
  id: number;
  slug: string;
  title: string;
  pricePerDay: number;
  coverImage: string | null;
  isFeatured?: boolean;
};

export function CarsMenu() {
  const [cars, setCars] = useState<Car[]>([]);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Загружаем несколько машин для меню
  useEffect(() => {
    fetch("/api/cars?take=8")
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => {
        const featured = list.filter((x: any) => x.isFeatured).slice(0, 8);
        setCars((featured.length ? featured : list.slice(0, 8)) as Car[]);
      })
      .catch(() => {});
  }, []);

  // Закрытие кликом вне и по Esc
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      {/* ТОЛЬКО КЛИК — НИКАКОГО HOVER */}
      <button
        type="button"
        className="px-3 py-2 rounded-lg hover:bg-white/10 text-neutral-200 inline-flex items-center gap-1"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        Каталог машин
        <svg
          width="14"
          height="14"
          viewBox="0 0 20 20"
          className={`opacity-70 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M5.5 7.5l4.5 4.5 4.5-4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full mt-2 z-50 w-[560px] rounded-2xl border border-white/10 bg-neutral-900/95 backdrop-blur p-3 shadow-xl"
        >
          {cars.length ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                {cars.map((c) => (
                  <a
                    key={c.id}
                    href={`/cars/${c.slug}`}
                    role="menuitem"
                    className="flex gap-3 p-2 rounded-xl hover:bg-white/10 transition"
                    onClick={() => setOpen(false)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.coverImage ?? "/placeholder-car.jpg"}
                      alt={c.title}
                      className="w-20 h-14 rounded-lg object-cover bg-neutral-800"
                    />
                    <div className="min-w-0">
                      <div className="truncate text-sm text-neutral-100 font-medium">
                        {c.title}
                      </div>
                      <div className="text-xs text-neutral-400">
                        {c.pricePerDay.toLocaleString()} ₸ / день
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              <a href="/" className="btn w-full mt-3" onClick={() => setOpen(false)}>
                Смотреть весь каталог
              </a>
            </>
          ) : (
            <div className="text-sm text-neutral-400 p-3">Пока нет объявлений</div>
          )}
        </div>
      )}
    </div>
  );
}
