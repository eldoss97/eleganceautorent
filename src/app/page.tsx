// app/(root)/page.tsx или где у тебя страница каталога
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { CategoryTabs } from "@/components/CategoryTabs";
import { FiltersBar } from "@/components/FiltersBar";
import CarCardPremium from "@/components/CarCardPremium";
import Link from "next/link";

export const runtime = 'nodejs';

export const revalidate = 0;

// Допустимые значения класса в БД
const CLASS_MAP: Record<string, string> = {
  business: "business",
  suv: "suv",
  // на кнопке может быть "Minibuses", в БД — "minibus"
  minibuses: "minibus",
  minibus: "minibus",
  premium: "premium",
};

// безопасный парсинг числа
function toNumber(v: unknown): number | undefined {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export default async function Home({ searchParams }: { searchParams: any }) {
  const where: any = {};

  // --- Категория ---
  const classParamRaw = (searchParams?.class ?? "").toString().trim().toLowerCase();
  const normalizedClass =
    classParamRaw && classParamRaw !== "all" ? CLASS_MAP[classParamRaw] : null;
  if (normalizedClass) {
    where.carClass = normalizedClass;
  }

  // --- Поиск/фильтры (нечувствительные к регистру) ---
  const q = (searchParams?.q ?? "").toString().trim();
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { brand: { contains: q, mode: "insensitive" } },
      { model: { contains: q, mode: "insensitive" } },
    ];
  }

  const brand = (searchParams?.brand ?? "").toString().trim();
  if (brand) where.brand = { contains: brand, mode: "insensitive" };

  const fuel = (searchParams?.fuel ?? "").toString().trim();
  if (fuel) where.fuel = fuel;

  const transmission = (searchParams?.transmission ?? "").toString().trim();
  if (transmission) where.transmission = transmission;

  // --- Цена ---
  const min = toNumber(searchParams?.min);
  const max = toNumber(searchParams?.max);
  if (min !== undefined || max !== undefined) {
    where.pricePerDay = {
      ...(min !== undefined ? { gte: min } : {}),
      ...(max !== undefined ? { lte: max } : {}),
    };
  }

  // --- Сортировка ---
  let orderBy: any[] = [];
  const sort = (searchParams?.sort ?? "featured").toString();
  if (sort === "featured") orderBy = [{ isFeatured: "desc" }, { createdAt: "desc" }];
  else if (sort === "price_asc") orderBy = [{ pricePerDay: "asc" }];
  else if (sort === "price_desc") orderBy = [{ pricePerDay: "desc" }];
  else if (sort === "year_desc") orderBy = [{ year: "desc" }];
  if (orderBy.length === 0) orderBy = [{ createdAt: "desc" }];

  const cars = await prisma.car.findMany({
    where,
    orderBy,
    select: {
      id: true,
      slug: true,
      title: true,
      brand: true,
      model: true,
      year: true,
      pricePerDay: true,
      transmission: true,
      fuel: true,
      seats: true,
      coverImage: true,
      imagesCsv: true,
      engineVolume: true,
      consumption: true,
      price1d: true,
      price2_4: true,
      price5_15: true,
      price16_30: true,
      isFeatured: true,
      carClass: true,
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Автопарк"
        subtitle="Аренда без скрытых платежей. Доставка по Алматы."
      />

      <CategoryTabs />

      <div className="container-max">
        <FiltersBar />
      </div>

      <section className="container-max grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cars.length > 0 &&
          cars.map((c) => <CarCardPremium key={c.id} car={c as any} />)}

        {cars.length === 0 && (
          <div className="col-span-full text-center text-neutral-400">
            Пока нет объявлений по заданным фильтрам.{" "}
            <Link href="/admin/cars/new" className="underline">
              Добавьте первую машину
            </Link>
            .
          </div>
        )}
      </section>

      {/* Контакты внутри return */}
      <section id="contact" className="container-max mt-8">
        <div className="card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="section-title">Контакты</h2>
            <p className="subtle mt-1">Звоните или пишите в Instagram/WhatsApp</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={`tel:+${process.env.NEXT_PUBLIC_PHONE}`} className="btn">
              Позвонить
            </a>
            <a
              href={process.env.NEXT_PUBLIC_INSTAGRAM!}
              target="_blank"
              rel="noreferrer"
              className="btn"
            >
              Instagram
            </a>
            <a href={`/api/redirect-wa`} className="btn btn-primary">
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
