import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildCarSlug } from '@/lib/buildCarSlug';

// Удобные нормализаторы
const toInt = (v: unknown, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const toStr = (v: unknown, fallback = '') =>
  (v ?? fallback).toString().trim();

const toBool = (v: unknown, fallback = false) =>
  typeof v === 'boolean' ? v : Boolean(v ?? fallback);

// Принимаем либо строку CSV, либо массив URL-ов
const toCsv = (v: unknown, fallback = ''): string => {
  if (Array.isArray(v)) {
    return v.map((x) => String(x || '').trim()).filter(Boolean).join(',');
  }
  return toStr(v, fallback);
};

// GET /api/cars/:id — получить машину
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = toInt(params.id);
  if (!id) return NextResponse.json({ error: 'Bad id' }, { status: 400 });

  const car = await prisma.car.findUnique({ where: { id } });
  if (!car) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(car);
}

// PATCH просто прокидываем в PUT
export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  return PUT(req, ctx);
}

// PUT /api/cars/:id — обновить машину
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = toInt(params.id);
    if (!id) return NextResponse.json({ error: 'Bad id' }, { status: 400 });

    const body = await req.json();
    const current = await prisma.car.findUnique({ where: { id } });
    if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Берём новые значения (или текущие, если не приходили)
    const nextTitle = toStr(body.title, current.title);
    const nextBrand = toStr(body.brand, current.brand);
    const nextModel = toStr(body.model, current.model);

    // Пересчёт slug только если реально меняются данные,
    // при этом исключаем текущий id из проверки уникальности:
    const candidateSlug = await buildCarSlug(
      { title: nextTitle, brand: nextBrand, model: nextModel },
      id
    );
    const nextSlug = candidateSlug || current.slug;

    // Собираем данные к обновлению
    const data = {
      slug: nextSlug,
      title: nextTitle,
      brand: nextBrand,
      model: nextModel,

      year: toInt(body.year ?? current.year, current.year),
      pricePerDay: toInt(body.pricePerDay ?? current.pricePerDay, current.pricePerDay),
      fuel: toStr(body.fuel, current.fuel),
      transmission: toStr(body.transmission, current.transmission),
      seats: toInt(body.seats ?? current.seats, current.seats),

      carClass:
        body.carClass !== undefined ? toStr(body.carClass) : current.carClass,

      engineVolume:
        body.engineVolume !== undefined ? toStr(body.engineVolume) : current.engineVolume,

      consumption:
        body.consumption !== undefined ? toStr(body.consumption) : current.consumption,

      // Принимаем либо CSV, либо массив URL-ов
      imagesCsv:
        body.imagesCsv !== undefined ? toCsv(body.imagesCsv) : current.imagesCsv,

      description:
        body.description !== undefined ? toStr(body.description) : current.description,

      coverImage:
        body.coverImage !== undefined
          ? (toStr(body.coverImage) || null)
          : current.coverImage,

      isFeatured:
        body.isFeatured !== undefined ? toBool(body.isFeatured) : current.isFeatured,

      price1d:
        body.price1d !== undefined ? toInt(body.price1d) : current.price1d,

      price2_4:
        body.price2_4 !== undefined ? toInt(body.price2_4) : current.price2_4,

      price5_15:
        body.price5_15 !== undefined ? toInt(body.price5_15) : current.price5_15,

      price16_30:
        body.price16_30 !== undefined ? toInt(body.price16_30) : current.price16_30,
    };

    const updated = await prisma.car.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (e: any) {
    // Ловим возможные ошибки уникальности и т.п.
    const message = e?.message || 'Failed to update car';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// DELETE /api/cars/:id — удалить машину
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = toInt(params.id);
    if (!id) return NextResponse.json({ error: 'Bad id' }, { status: 400 });

    await prisma.car.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to delete car' }, { status: 400 });
  }
}
