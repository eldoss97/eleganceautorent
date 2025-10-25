-- CreateTable
CREATE TABLE "Car" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "carClass" TEXT NOT NULL DEFAULT '',
    "year" INTEGER NOT NULL,
    "pricePerDay" INTEGER NOT NULL,
    "fuel" TEXT NOT NULL,
    "transmission" TEXT NOT NULL,
    "seats" INTEGER NOT NULL,
    "engineVolume" TEXT NOT NULL DEFAULT '',
    "consumption" TEXT NOT NULL DEFAULT '',
    "price1d" INTEGER NOT NULL DEFAULT 0,
    "price2_4" INTEGER NOT NULL DEFAULT 0,
    "price5_15" INTEGER NOT NULL DEFAULT 0,
    "price16_30" INTEGER NOT NULL DEFAULT 0,
    "coverImage" TEXT,
    "imagesCsv" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Car_slug_key" ON "Car"("slug");
