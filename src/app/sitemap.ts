// src/app/sitemap.ts
import { prisma } from "@/lib/prisma"; // если есть БД со слагами авто

export default async function sitemap() {
  // статичные страницы
  const base = "https://eleganceautorent.kz";
  const pages = ["", "/cars", "/how", "/contact"].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
  }));

  // динамика по авто (если есть)
  let carUrls: { url: string; lastModified?: Date }[] = [];
  try {
    const cars = await prisma.car.findMany({ select: { slug: true, updatedAt: true } });
    carUrls = cars.map((c) => ({
      url: `${base}/cars/${c.slug}`,
      lastModified: c.updatedAt ?? new Date(),
    }));
  } catch {}

  return [...pages, ...carUrls];
}
