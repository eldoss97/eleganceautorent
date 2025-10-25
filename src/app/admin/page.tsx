import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function AdminPage() {
  const cars = await prisma.car.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Админ-панель</h1>
        <Link href="/admin/cars/new" className="btn btn-primary">+ Добавить авто</Link>
      </div>

      <div className="card divide-y">
        <div className="p-4 grid grid-cols-12 text-sm font-semibold text-gray-600">
          <div className="col-span-5">Название</div>
          <div className="col-span-2">Цена/день</div>
          <div className="col-span-2">Год</div>
          <div className="col-span-3">Действия</div>
        </div>
        {cars.map((c) => (
          <div key={c.id} className="p-4 grid grid-cols-12 items-center">
            <div className="col-span-5">{c.title}</div>
            <div className="col-span-2">{c.pricePerDay} ₸</div>
            <div className="col-span-2">{c.year}</div>
            <div className="col-span-3 flex gap-2">
              <Link className="btn" href={`/admin/cars/${c.id}`}>Редактировать</Link>
              <Link className="btn" href={`/cars/${c.slug}`} target="_blank">Открыть</Link>
            </div>
          </div>
        ))}
        {cars.length === 0 && <div className="p-4 text-gray-600">Пока пусто. Добавьте первую машину.</div>}
      </div>
    </div>
  );
}
