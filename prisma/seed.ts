import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.car.count();
  if (count > 0) {
    console.log("Already seeded.");
    return;
  }
  await prisma.car.createMany({
    data: [
      {
        slug: "mercedes-e200-w212",
        title: "Mercedes-Benz E200 W212",
        brand: "Mercedes-Benz",
        model: "E200",
        year: 2014,
        pricePerDay: 65000,
        fuel: "Бензин",
        transmission: "AT",
        seats: 5,
        coverImage: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
        imagesCsv: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
        description: "Комфортный бизнес-седан. Идеален для деловых поездок по Алматы.",
        isFeatured: true
      },
      {
        slug: "toyota-camry-70",
        title: "Toyota Camry 70",
        brand: "Toyota",
        model: "Camry",
        year: 2019,
        pricePerDay: 55000,
        fuel: "Бензин",
        transmission: "AT",
        seats: 5,
        coverImage: "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg",
        imagesCsv: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
        description: "Надёжность и комфорт. Отличный выбор на каждый день.",
        isFeatured: true
      }
    ]
  });
  console.log("Seed done.");
}

main().finally(() => prisma.$disconnect());
