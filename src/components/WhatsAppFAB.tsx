"use client";
import { waLink } from "@/lib/config";

export function WhatsAppFAB() {
  return (
    <a
      href={waLink("Здравствуйте! Хочу арендовать авто.")}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 rounded-full shadow-lg border border-emerald-200 bg-emerald-500 text-white px-5 py-3 hover:bg-emerald-600 transition"
    >
      WhatsApp
    </a>
  );
}
