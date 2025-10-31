import { prisma } from "@/lib/prisma";
import CarForm from "@/components/CarForm";
import DeleteButton from '../_DeleteButton';


export default async function EditCarPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const car = await prisma.car.findUnique({ where: { id } });
  if (!car) return <div className="container-max py-8">Авто не найдено</div>;

  return (
    <div className="container-max py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Редактировать авто</h1>
      <CarForm
        initial={{
          id: car.id,
          title: car.title,
          brand: car.brand,
          model: car.model,
          year: car.year,
          pricePerDay: car.pricePerDay,
          fuel: car.fuel,
          transmission: car.transmission,
          seats: car.seats ?? 5,
          carClass: car.carClass ?? "",
          engineVolume: car.engineVolume ?? "",
          consumption: car.consumption ?? "",
          coverImage: car.coverImage ?? "",
          imagesCsv: car.imagesCsv ?? "",
          description: car.description ?? "",
          isFeatured: car.isFeatured,
          price1d: car.price1d ?? 0,
          price2_4: car.price2_4 ?? 0,
          price5_15: car.price5_15 ?? 0,
          price16_30: car.price16_30 ?? 0,
        }}
        redirectTo="/admin"
      />
    </div>
  );
}
