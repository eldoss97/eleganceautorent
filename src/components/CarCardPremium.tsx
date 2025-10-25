"use client";

import Link from "next/link";
import { waLink } from "@/lib/config";

type Car = {
  id: number;
  slug: string;
  title: string;
  pricePerDay: number;
  coverImage?: string | null;
  imagesCsv?: string | null;
  seats?: number;
  transmission?: string;
  fuel?: string;
};

export default function CarCardPremium({ car }: { car: Car }) {
  const gallery =
    (car.imagesCsv || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean) || [];
  const img = car.coverImage || gallery[0] || "/placeholder-car.jpg";

  return (
    <article className="relative card overflow-hidden hover:ring-1 hover:ring-white/15 transition group">
      {/* кликабельный оверлей */}
      <Link
        href={`/cars/${encodeURIComponent(car.slug)}`}
        className="absolute inset-0 z-10 block"
        aria-label={car.title}
      >
        <span className="sr-only">{car.title}</span>
      </Link>

      <div className="aspect-[16/10] bg-neutral-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={car.title} className="w-full h-full object-cover" />
      </div>

      <div className="p-4 space-y-3">
        <div className="text-lg font-display font-semibold truncate">
          {car.title}
        </div>

        <div className="flex flex-wrap gap-2 text-sm text-neutral-300">
          {car.seats ? <span className="badge">{car.seats} мест</span> : null}
          {car.transmission ? (
            <span className="badge">КПП: {car.transmission}</span>
          ) : null}
          {car.fuel ? <span className="badge">Топливо: {car.fuel}</span> : null}
        </div>

        <div className="flex items-center justify-between">
          <div className="price text-2xl font-semibold">
            {car.pricePerDay.toLocaleString()} ₸
            <span className="text-xs text-neutral-400"> / день</span>
          </div>

          <a
            href={waLink(`Здравствуйте! Интересует ${car.title}.`)}
            className="btn btn-primary z-20"
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            rel="noreferrer"
          >
            Бронь
          </a>
        </div>
      </div>
    </article>
  );
}

export { CarCardPremium };
