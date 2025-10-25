import { prisma } from "@/lib/prisma";
import slugify from "@/lib/slugify";
import { CarGalleryPro } from "@/components/CarGalleryPro";
import { CarSpecs } from "@/components/CarSpecs";
import { TariffTabs } from "@/components/TariffTabs";

type PageProps = { params: { slug: string } };

export const dynamic = "force-dynamic"; // чтобы страница не кэшировалась во время разработки

export default async function CarPage({ params }: PageProps) {
  // 1) Декодируем slug из URL (/cars/%D0%BC%D0%B5%D1%80...)
  const decoded = decodeURIComponent(params.slug ?? "");

  // 2) Ищем машину по точному slug
  let car = await prisma.car.findUnique({ where: { slug: decoded } });

  // 3) Фоллбек: если в URL была кириллица, пробуем ASCII-версии
  if (!car && /[А-Яа-яЁё]/.test(decoded)) {
    const ascii = slugify(decoded); // например, "mercedes-cls-banan"
    if (ascii) {
      car = await prisma.car.findUnique({ where: { slug: ascii } });
    }
  }

  // 4) Ничего не нашли — показываем сообщение
  if (!car) {
    return (
      <div className="container-max py-10 text-neutral-400">
        Машина не найдена
      </div>
    );
  }

  // 5) Собираем фото
  const images =
    car.imagesCsv
      ? car.imagesCsv.split(",").map(s => s.trim()).filter(Boolean)
      : [];

  // 6) Тарифы с автоподстановками
  const p1    = car.price1d    && car.price1d    > 0 ? car.price1d    : car.pricePerDay;
  const p24   = car.price2_4   && car.price2_4   > 0 ? car.price2_4   : Math.round(car.pricePerDay * 0.95);
  const p515  = car.price5_15  && car.price5_15  > 0 ? car.price5_15  : Math.round(car.pricePerDay * 0.90);
  const p1630 = car.price16_30 && car.price16_30 > 0 ? car.price16_30 : Math.round(car.pricePerDay * 0.85);

  // 7) Разметка как в премиум-карточке
  return (
    <div className="container-max">
      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        {/* Слева — большая галерея с превью */}
        <CarGalleryPro
          images={images}
          cover={car.coverImage ?? undefined}
          alt={car.title}
        />

        {/* Справа — «шторка» с инфо и тарифами */}
        <aside className="space-y-4 lg:sticky lg:top-20 h-fit">
          <h1 className="font-display text-3xl md:text-4xl font-semibold">
            {car.title}
          </h1>

          {car.description ? (
            <p className="text-neutral-400 text-sm">{car.description}</p>
          ) : null}

          <CarSpecs
            seats={car.seats}
            transmission={car.transmission}
            fuel={car.fuel}
            engineVolume={car.engineVolume}
            consumption={car.consumption}
            year={car.year}
          />

          <TariffTabs
            title={car.title}
            prices={{ p1, p24, p515, p1630 }}
          />
        </aside>
      </div>
    </div>
  );
}
