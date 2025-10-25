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

export default function CarCard({ car }: { car: Car }) {
  const gallery =
    (car.imagesCsv || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean) || [];
  const img = car.coverImage || gallery[0] || "/placeholder-car.jpg";

  return (
    <article className="relative card overflow-hidden hover:bg-white/5 transition group">
      {/* кликабельный оверлей на всю карточку */}
      <Link
        href={`/cars/${encodeURIComponent(car.slug)}`}
        className="absolute inset-0 z-10 block"
        aria-label={car.title}
      >
        <span className="sr-only">{car.title}</span>
      </Link>

      {/* картинка */}
      <div className="aspect-[16/10] bg-neutral-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={car.title} className="w-full h-full object-cover" />
      </div>

      {/* контент */}
      <div className="p-3 space-y-2">
        <h3 className="text-lg font-semibold truncate">{car.title}</h3>

        <div className="text-sm text-neutral-400 flex flex-wrap gap-2">
          {car.seats ? <span className="badge">{car.seats} мест</span> : null}
          {car.transmission ? (
            <span className="badge">КПП: {car.transmission}</span>
          ) : null}
          {car.fuel ? <span className="badge">Топливо: {car.fuel}</span> : null}
        </div>

        <div className="flex items-center justify-between">
          <div className="price text-white font-semibold">
            {car.pricePerDay.toLocaleString()} ₸{" "}
            <span className="text-xs text-neutral-400">/ день</span>
          </div>

          {/* кнопка поверх оверлея */}
          <a
            href={waLink(`Здравствуйте! Интересует ${car.title}.`)}
            className="btn z-20"
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}

// чтобы можно было импортировать и как named
export { CarCard };
