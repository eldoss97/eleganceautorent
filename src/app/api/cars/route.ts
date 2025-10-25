import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildCarSlug } from "@/lib/buildCarSlug";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const slug = await buildCarSlug({
      title: body.title,
      brand: body.brand,
      model: body.model,
    });

    const data = {
      // обязательные
      slug,
      title: String(body.title ?? "").trim(),
      brand: String(body.brand ?? "").trim(),
      model: String(body.model ?? "").trim(),
      year: Number(body.year ?? 0),
      pricePerDay: Number(body.pricePerDay ?? 0),
      fuel: String(body.fuel ?? ""),
      transmission: String(body.transmission ?? ""),
      seats: Number(body.seats ?? 5), // в схеме seats — обязательный Int

      // строки с дефолтом "" — либо передаем строку, либо вообще опускаем
      carClass: body.carClass !== undefined ? String(body.carClass ?? "").trim() : undefined,
      engineVolume: body.engineVolume !== undefined ? String(body.engineVolume ?? "").trim() : undefined,
      consumption: body.consumption !== undefined ? String(body.consumption ?? "").trim() : undefined,
      imagesCsv: body.imagesCsv !== undefined ? String(body.imagesCsv ?? "").trim() : undefined,
      description: body.description !== undefined ? String(body.description ?? "").trim() : undefined,

      // опциональное поле
      coverImage: body.coverImage ? String(body.coverImage).trim() : undefined,

      // флаг
      isFeatured: Boolean(body.isFeatured),

      // тарифы — всегда числом, дефолт 0
      price1d: Number(body.price1d ?? 0),
      price2_4: Number(body.price2_4 ?? 0),
      price5_15: Number(body.price5_15 ?? 0),
      price16_30: Number(body.price16_30 ?? 0),
    };

    const created = await prisma.car.create({ data });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to create car" }, { status: 400 });
  }
}
