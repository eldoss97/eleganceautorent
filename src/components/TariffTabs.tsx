"use client";

import { useState } from "react";
import { waLink } from "@/lib/config";

type Prices = {
  p1: number;
  p24: number;
  p515: number;
  p1630: number;
};

const TABS = [
  { key: "p1", label: "1 день" },
  { key: "p24", label: "2–4 дня" },
  { key: "p515", label: "5–15 дней" },
  { key: "p1630", label: "16–30 дней" },
] as const;

export function TariffTabs({ title, prices }: { title: string; prices: Prices }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("p1");
  const price = prices[tab];

  return (
    <div className="card p-4 space-y-4">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            type="button"
            key={t.key}
            className={`px-3 py-1.5 rounded-xl text-sm ${
              tab === t.key ? "bg-white text-black" : "bg-white/10 text-neutral-200 hover:bg-white/15"
            }`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="text-2xl font-semibold price">
        {price.toLocaleString()} ₸ <span className="text-sm text-neutral-400">/ сутки</span>
      </div>

      <a
        href={waLink(`Здравствуйте! Хочу забронировать ${title} (${TABS.find(t => t.key === tab)?.label}).`)}
        target="_blank"
        rel="noreferrer"
        className="btn btn-primary w-full h-12 text-base"
      >
        ВЫБРАТЬ АВТО
      </a>
    </div>
  );
}
