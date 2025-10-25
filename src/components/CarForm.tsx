"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type CarDTO = {
  title: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  fuel: string;
  transmission: string;
  seats: number;

  carClass?: string;
  engineVolume?: string;
  consumption?: string;

  coverImage?: string;
  imagesCsv?: string;

  description?: string;
  isFeatured?: boolean;

  price1d?: number;
  price2_4?: number;
  price5_15?: number;
  price16_30?: number;
};

type Props = {
  initial?: Partial<CarDTO> & { id?: number };
  redirectTo?: string;
};

/* ===================== helpers ===================== */
const FUEL = ["Бензин", "Дизель", "Гибрид", "Электро"] as const;
const GEAR = ["AT", "MT", "CVT", "DCT"] as const;
const CATS = ["", "business", "suv", "minibus", "premium"] as const;

async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error("Не удалось загрузить файл");
  const data = (await res.json()) as { url: string };
  return data.url;
}

/* ===================== component ===================== */
export default function CarForm({ initial, redirectTo = "/admin" }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // базовые поля
  const [title, setTitle] = useState(initial?.title ?? "");
  const [brand, setBrand] = useState(initial?.brand ?? "");
  const [model, setModel] = useState(initial?.model ?? "");
  const [year, setYear] = useState<number>(initial?.year ?? 0);

  // цена — 0 в стейте, но в инпуте будет пустая строка
  const [pricePerDay, setPricePerDay] = useState<number>(initial?.pricePerDay ?? 0);

  const [fuel, setFuel] = useState(initial?.fuel ?? FUEL[0]);
  const [transmission, setTransmission] = useState(initial?.transmission ?? GEAR[0]);
  const [seats, setSeats] = useState<number>(initial?.seats ?? 5);

  // доп
  const [carClass, setCarClass] = useState(initial?.carClass ?? "");
  const [engineVolume, setEngineVolume] = useState(initial?.engineVolume ?? "");
  const [consumption, setConsumption] = useState(initial?.consumption ?? "");

  // медиа
  const [coverImage, setCoverImage] = useState<string>(initial?.coverImage ?? "");
  const [images, setImages] = useState<string[]>(
    initial?.imagesCsv ? initial.imagesCsv.split(",").map((s) => s.trim()).filter(Boolean) : []
  );

  // описание/флаги
  const [description, setDescription] = useState(initial?.description ?? "");
  const [isFeatured, setIsFeatured] = useState<boolean>(Boolean(initial?.isFeatured));

  // тарифы
  const [p1, setP1] = useState<number>(initial?.price1d ?? 0);
  const [p24, setP24] = useState<number>(initial?.price2_4 ?? 0);
  const [p515, setP515] = useState<number>(initial?.price5_15 ?? 0);
  const [p1630, setP1630] = useState<number>(initial?.price16_30 ?? 0);

  const [error, setError] = useState<string>("");

  /* =============== handlers =============== */
  const onUploadCover = async (f?: File) => {
    if (!f) return;
    try {
      const url = await uploadFile(f);
      setCoverImage(url);
    } catch (e: any) {
      setError(e?.message ?? "Ошибка загрузки обложки");
    }
  };

  const onUploadGallery = async (files: FileList | null) => {
    if (!files || !files.length) return;
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        uploaded.push(await uploadFile(file));
      }
      setImages((prev) => [...prev, ...uploaded]);
    } catch (e: any) {
      setError(e?.message ?? "Ошибка загрузки галереи");
    }
  };

  const removeImage = (url: string) => setImages((prev) => prev.filter((u) => u !== url));

  const canSubmit =
    title.trim().length > 1 &&
    brand.trim().length > 0 &&
    model.trim().length > 0 &&
    year > 0 &&
    pricePerDay > 0;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!canSubmit) {
      setError("Пожалуйста, заполните обязательные поля и введите цену > 0.");
      return;
    }

    // Собираем payload БЕЗ null. Пустые — просто не отправляем.
    const payload: Partial<CarDTO> = {
      title: title.trim(),
      brand: brand.trim(),
      model: model.trim(),
      year: Number(year),
      pricePerDay: Number(pricePerDay),
      fuel,
      transmission,
      seats: Number(seats),
      isFeatured,
    };

    if (carClass.trim()) payload.carClass = carClass.trim();
    if (engineVolume.trim()) payload.engineVolume = engineVolume.trim();
    if (consumption.trim()) payload.consumption = consumption.trim();
    if (coverImage.trim()) payload.coverImage = coverImage.trim();
    if (images.length) payload.imagesCsv = images.join(", ");
    if (description.trim()) payload.description = description.trim();

    if (p1 > 0) payload.price1d = Number(p1);
    if (p24 > 0) payload.price2_4 = Number(p24);
    if (p515 > 0) payload.price5_15 = Number(p515);
    if (p1630 > 0) payload.price16_30 = Number(p1630);

    try {
      const url = initial?.id ? `/api/cars/${initial.id}` : "/api/cars";
      const method = initial?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Не удалось сохранить");
      }

      startTransition(() => {
        router.push(redirectTo);
        router.refresh();
      });
    } catch (e: any) {
      setError(e?.message ?? "Ошибка сохранения");
    }
  };

  /* =============== UI =============== */
  return (
    <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-2">
      {/* левая колонка */}
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Название (на карточке)</label>
          <input
            type="text"
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="BMW X5 M"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Бренд</label>
            <input className="input" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="BMW" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Модель</label>
            <input className="input" value={model} onChange={(e) => setModel(e.target.value)} placeholder="X5 M" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Год</label>
            <input
              type="number"
              className="input no-spinner"
              value={!year || year === 0 ? "" : year}
              onChange={(e) => setYear(e.target.value === "" ? 0 : e.target.valueAsNumber)}
              placeholder="2019"
              min={1950}
              max={2100}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Цена за день (₸)</label>
            <input
              type="number"
              className="input no-spinner"
              min={0}
              step={1}
              placeholder="Напр. 70000"
              value={!pricePerDay || pricePerDay === 0 ? "" : pricePerDay}
              onChange={(e) => setPricePerDay(e.target.value === "" ? 0 : e.target.valueAsNumber)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Топливо</label>
            <select className="input" value={fuel} onChange={(e) => setFuel(e.target.value)}>
              {FUEL.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Трансмиссия</label>
            <select className="input" value={transmission} onChange={(e) => setTransmission(e.target.value)}>
              {GEAR.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Мест</label>
            <input
              type="number"
              className="input no-spinner"
              value={!seats || seats === 0 ? "" : seats}
              onChange={(e) => setSeats(e.target.value === "" ? 0 : e.target.valueAsNumber)}
              min={1}
              max={9}
              placeholder="5"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Категория</label>
          <select className="input" value={carClass} onChange={(e) => setCarClass(e.target.value)}>
            {CATS.map((c) => (
              <option key={c} value={c}>
                {c === "" ? "—" : c}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Двигатель (объём)</label>
            <input className="input" value={engineVolume} onChange={(e) => setEngineVolume(e.target.value)} placeholder="4.4L" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Расход</label>
            <input className="input" value={consumption} onChange={(e) => setConsumption(e.target.value)} placeholder="12.5 L/100 km" />
          </div>
        </div>
      </div>

      {/* правая колонка */}
      <div className="space-y-5">
        {/* обложка */}
        <div className="card p-4 space-y-3">
          <div className="text-sm font-medium">Обложка</div>
          {coverImage ? (
            <div className="rounded-xl overflow-hidden bg-neutral-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverImage} alt="cover" className="w-full h-48 object-cover" />
            </div>
          ) : null}
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onUploadCover(e.target.files?.[0])}
              className="block w-full text-sm file:mr-3 file:rounded-lg file:border file:border-white/10 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:text-neutral-100 hover:file:bg-white/15"
            />
            <span className="subtle text-xs">или вставьте URL ↓</span>
          </div>
          <input
            type="text"
            className="input"
            placeholder="https://..."
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />
        </div>

        {/* галерея */}
        <div className="card p-4 space-y-3">
          <div className="text-sm font-medium">Галерея</div>
          {images.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {images.map((u) => (
                <div key={u} className="relative rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={u} alt="" className="w-full h-24 object-cover bg-neutral-800" />
                  <button
                    type="button"
                    onClick={() => removeImage(u)}
                    className="absolute top-1 right-1 btn btn-ghost px-2 py-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="subtle text-sm">Фотографии не добавлены</div>
          )}

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => onUploadGallery(e.target.files)}
            className="block w-full text-sm file:mr-3 file:rounded-lg file:border file:border-white/10 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:text-neutral-100 hover:file:bg-white/15"
          />

          <div className="subtle text-xs">Можно выбрать сразу несколько изображений</div>
        </div>

        {/* тарифы */}
        <div className="card p-4 space-y-3">
          <div className="text-sm font-medium">Тарифы (₸/сутки; 0 = авто от цены за день)</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="subtle text-xs mb-1">1 день</div>
              <input
                type="number"
                className="input no-spinner"
                value={!p1 || p1 === 0 ? "" : p1}
                onChange={(e) => setP1(e.target.value === "" ? 0 : e.target.valueAsNumber)}
                min={0}
              />
            </div>
            <div>
              <div className="subtle text-xs mb-1">2–4 дня</div>
              <input
                type="number"
                className="input no-spinner"
                value={!p24 || p24 === 0 ? "" : p24}
                onChange={(e) => setP24(e.target.value === "" ? 0 : e.target.valueAsNumber)}
                min={0}
              />
            </div>
            <div>
              <div className="subtle text-xs mb-1">5–15 дней</div>
              <input
                type="number"
                className="input no-spinner"
                value={!p515 || p515 === 0 ? "" : p515}
                onChange={(e) => setP515(e.target.value === "" ? 0 : e.target.valueAsNumber)}
                min={0}
              />
            </div>
            <div>
              <div className="subtle text-xs mb-1">16–30 дней</div>
              <input
                type="number"
                className="input no-spinner"
                value={!p1630 || p1630 === 0 ? "" : p1630}
                onChange={(e) => setP1630(e.target.value === "" ? 0 : e.target.valueAsNumber)}
                min={0}
              />
            </div>
          </div>
        </div>

        {/* описание + флаг */}
        <div className="card p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Описание</label>
            <textarea
              rows={5}
              className="input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Краткое описание авто…"
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="rounded border-white/20 bg-neutral-900"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
            Выводить в топе
          </label>

          {error ? <div className="text-red-400 text-sm">{error}</div> : null}

          <button type="submit" className="btn btn-primary w-full h-11" disabled={isPending || !canSubmit}>
            {initial?.id ? "Сохранить" : "Создать"}
          </button>
        </div>
      </div>
    </form>
  );
}
