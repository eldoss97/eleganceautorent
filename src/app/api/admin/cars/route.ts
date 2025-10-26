import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // простая валидация/приведение типов
    const toNum = (v: unknown) =>
      typeof v === 'number' && !Number.isNaN(v) ? v : parseInt(String(v || 0), 10) || 0;

    const data = {
      slug: String(body.slug || ''),
      title: String(body.title || ''),
      brand: String(body.brand || ''),
      model: String(body.model || ''),
      carClass: String(body.carClass || ''),
      year: toNum(body.year),
      pricePerDay: toNum(body.pricePerDay),
      fuel: String(body.fuel || ''),
      transmission: String(body.transmission || ''),
      seats: toNum(body.seats),
      engineVolume: String(body.engineVolume || ''),
      consumption: String(body.consumption || ''),
      price1d: toNum(body.price1d),
      price2_4: toNum(body.price2_4),
      price5_15: toNum(body.price5_15),
      price16_30: toNum(body.price16_30),
      coverImage: String(body.coverImage || ''),
      imagesCsv: String(body.imagesCsv || ''),
      description: String(body.description || ''),
      isFeatured: !!body.isFeatured,
    };

    if (!data.title || !data.slug) {
      return NextResponse.json({ error: 'title/slug required' }, { status: 400 });
    }

    const created = await prisma.car.create({ data });
    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/admin/cars error:', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

// (не обязательно) чтобы GET не давал 405:
export async function GET() {
  return NextResponse.json({ ok: true });
}
