"use client";

import { useState } from "react";

export function CarGalleryPro({
  images,
  cover,
  alt,
}: {
  images: string[];
  cover?: string | null;
  alt: string;
}) {
  const list = [...new Set([...(cover ? [cover] : []), ...images])];
  const [i, setI] = useState(0);
  const main = list[i] ?? "/placeholder-car.jpg";

  return (
    <div className="card p-2 lg:p-3">
      <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
        {/* главное фото */}
        <div className="rounded-xl overflow-hidden bg-neutral-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={main}
            alt={alt}
            className="w-full h-[420px] md:h-[520px] object-cover"
          />
        </div>

        {/* вертикальные превью на десктопе */}
        <div className="hidden lg:flex flex-col gap-3">
          {list.slice(0, 6).map((src, idx) => (
            <button
              type="button"
              key={src + idx}
              onClick={() => setI(idx)}
              className={`rounded-xl overflow-hidden transition ring-1 ring-white/10 ${
                i === idx ? "outline outline-2 outline-white/60" : ""
              }`}
            >
              <img
                src={src}
                alt=""
                className="w-full h-[120px] object-cover bg-neutral-800"
              />
            </button>
          ))}
          <div className="text-xs text-neutral-400 mt-1">{list.length} фото</div>
        </div>
      </div>

      {/* горизонтальные превью на мобайл */}
      <div className="lg:hidden mt-2 flex gap-2 overflow-x-auto no-scrollbar">
        {list.map((src, idx) => (
          <button
            type="button"
            key={src + idx}
            onClick={() => setI(idx)}
            className={`rounded-lg overflow-hidden ring-1 ring-white/10 ${
              i === idx ? "outline outline-2 outline-white/60" : ""
            }`}
          >
            <img
              src={src}
              alt=""
              className="w-[84px] h-[64px] object-cover bg-neutral-800"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
