"use client";
import { useMemo, useState } from "react";
import { waLink } from "@/lib/config";

function diffNights(a?: string, b?: string) {
  if (!a || !b) return 0;
  const d1 = new Date(a); const d2 = new Date(b);
  const ms = d2.getTime() - d1.getTime();
  return ms > 0 ? Math.ceil(ms / (1000*60*60*24)) : 0;
}

export function PriceCalc({ pricePerDay, title }: { pricePerDay: number; title: string }) {
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const nights = useMemo(() => diffNights(from, to), [from, to]);
  const total = nights * pricePerDay;

  const message = `Здравствуйте! Хочу арендовать ${title}. Даты: ${from || "?"} → ${to || "?"}. Кол-во суток: ${nights}. Сумма: ${total} ₸.`;
  return (
    <div className="card p-4 space-y-3">
      <div className="font-medium">Калькулятор аренды</div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="label">С (дата)</div>
          <input type="date" className="input" value={from} onChange={e=>setFrom(e.target.value)} />
        </div>
        <div>
          <div className="label">По (дата)</div>
          <input type="date" className="input" value={to} onChange={e=>setTo(e.target.value)} />
        </div>
      </div>
      <div className="text-sm text-gray-600">Сутки: <b>{nights}</b></div>
      <div className="text-lg font-semibold">Итого: {total.toLocaleString()} ₸</div>
      <a href={waLink(message)} target="_blank" rel="noreferrer" className="btn btn-primary w-full">Забронировать в WhatsApp</a>
    </div>
  );
}
