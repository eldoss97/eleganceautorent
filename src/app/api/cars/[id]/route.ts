import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildCarSlug } from "@/lib/buildCarSlug";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!id) return NextResponse.json({ error: "Bad id" }, { status: 400 });

    const body = await req.json();
    const current = await prisma.car.findUnique({ where: { id } });
    if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const nextTitle = (body.title ?? current.title) as string;
    const nextBrand = (body.brand ?? current.brand) as string;
    const nextModel = (body.model ?? current.model) as string;

    const candidateSlug = await buildCarSlug(
      { title: nextTitle, brand: nextBrand, model: nextModel },
      id
    );
    const nextSlug = candidateSlug !== current.slug ? candidateSlug : current.slug;

    const data = {
      slug: nextSlug,
      title: String(nextTitle).trim(),
      brand: String(nextBrand).trim(),
      model: String(nextModel).trim(),
      year: Number(body.year ?? current.year),
      pricePerDay: Number(body.pricePerDay ?? current.pricePerDay),
      fuel: String(body.fuel ?? current.fuel),
      transmission: String(body.transmission ?? current.transmission),
      seats: Number(body.seats ?? current.seats), // seats обязателен

      carClass:
        body.carClass !== undefined
          ? String(body.carClass ?? "").trim()
          : current.carClass,

      engineVolume:
        body.engineVolume !== undefined
          ? String(body.engineVolume ?? "").trim()
          : current.engineVolume,

      consumption:
        body.consumption !== undefined
          ? String(body.consumption ?? "").trim()
          : current.consumption,

      imagesCsv:
        body.imagesCsv !== undefined
          ? String(body.imagesCsv ?? "").trim()
          : current.imagesCsv,

      description:
        body.description !== undefined
          ? String(body.description ?? "").trim()
          : current.description,

      coverImage:
        body.coverImage !== undefined && body.coverImage !== null
          ? String(body.coverImage).trim() || null
          : current.coverImage,

      isFeatured:
        body.isFeatured !== undefined
          ? Boolean(body.isFeatured)
          : current.isFeatured,

      price1d:
        body.price1d !== undefined
          ? Number(body.price1d ?? 0)
          : current.price1d,

      price2_4:
        body.price2_4 !== undefined
          ? Number(body.price2_4 ?? 0)
          : current.price2_4,

      price5_15:
        body.price5_15 !== undefined
          ? Number(body.price5_15 ?? 0)
          : current.price5_15,

      price16_30:
        body.price16_30 !== undefined
          ? Number(body.price16_30 ?? 0)
          : current.price16_30,
    };

    const updated = await prisma.car.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to update car" }, { status: 400 });
  }
}
