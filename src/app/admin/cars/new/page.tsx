'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';

type CarForm = {
  slug: string;
  title: string;
  brand: string;
  model: string;
  carClass: string;
  year: number | '';
  pricePerDay: number | '';
  fuel: string;
  transmission: string;
  seats: number | '';
  engineVolume: string;
  consumption: string;
  price1d: number | '';
  price2_4: number | '';
  price5_15: number | '';
  price16_30: number | '';
  coverImage: string;
  gallery: string[]; // URL-ы изображений (в БД отправляем как imagesCsv)
  description: string;
  isFeatured: boolean;
};

const fieldBase =
  'w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-zinc-700';
const labelBase = 'text-xs font-medium tracking-wider text-zinc-400';

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '');

// ПУБЛИЧНЫЕ ENV (должны быть заданы в Vercel → Project → Settings → Environment Variables)
const CLOUD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;

// ---------- прямой аплоад через fetch (альтернатива виджету) ----------
async function uploadToCloudinary(file: File): Promise<string> {
  if (!CLOUD_NAME || !CLOUD_PRESET) {
    throw new Error('Не заданы NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME или NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET');
  }
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: fd,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || 'Upload failed');
  return data.secure_url as string; // публичная ссылка
}
// ---------------------------------------------------------------------

export default function AdminNewCarPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notice, setNotice] = useState<string>('');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const [form, setForm] = useState<CarForm>({
    slug: '',
    title: '',
    brand: '',
    model: '',
    carClass: '',
    year: '',
    pricePerDay: '',
    fuel: '',
    transmission: '',
    seats: '',
    engineVolume: '',
    consumption: '',
    price1d: '',
    price2_4: '',
    price5_15: '',
    price16_30: '',
    coverImage: '',
    gallery: [],
    description: '',
    isFeatured: false,
  });

  const set = <K extends keyof CarForm>(key: K, value: CarForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onChange =
    (key: keyof CarForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const raw = e.target.value;
      const isNumericKey =
        key === 'year' ||
        key === 'pricePerDay' ||
        key === 'seats' ||
        key === 'price1d' ||
        key === 'price2_4' ||
        key === 'price5_15' ||
        key === 'price16_30';

      const value = isNumericKey ? ((raw === '' ? '' : Number(raw)) as any) : (raw as any);

      if (key === 'title') {
        const nextSlug = slugify(raw);
        if (!form.slug || form.slug === slugify(form.title)) {
          set('slug', nextSlug);
        }
      }
      set(key as any, value);
    };

  const removeFromGallery = (url: string) => {
    set('gallery', form.gallery.filter((x) => x !== url));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNotice('');

    if (!form.title.trim()) {
      setNotice('Заполните название.');
      return;
    }
    if (!form.coverImage) {
      setNotice('Загрузите/укажите обложку.');
      return;
    }

    const imagesCsv = form.gallery.join(',');

    const toNum = (val: number | '' | undefined) =>
      typeof val === 'number' && !Number.isNaN(val) ? val : 0;

    const payload = {
      slug: form.slug || slugify(form.title),
      title: form.title,
      brand: form.brand,
      model: form.model,
      carClass: form.carClass || '',
      year: toNum(form.year),
      pricePerDay: toNum(form.pricePerDay),
      fuel: form.fuel,
      transmission: form.transmission,
      seats: toNum(form.seats),
      engineVolume: form.engineVolume || '',
      consumption: form.consumption || '',
      price1d: toNum(form.price1d),
      price2_4: toNum(form.price2_4),
      price5_15: toNum(form.price5_15),
      price16_30: toNum(form.price16_30),
      coverImage: form.coverImage,
      imagesCsv,
      description: form.description || '',
      isFeatured: !!form.isFeatured,
    };

    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/cars', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          throw new Error(txt || `HTTP ${res.status}`);
        }

        router.push('/admin/cars');
        router.refresh();
      } catch (err: any) {
        setNotice('Ошибка сохранения: ' + (err?.message || 'unknown'));
      }
    });
  }

  const imagesCsvPreview = form.gallery.join(',');

  return (
    <main className="min-h-screen bg-black text-zinc-100">
      <header className="border-b border-zinc-900 bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <h1 className="text-lg font-semibold">Добавить автомобиль</h1>
          <button
            onClick={() => router.back()}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm hover:bg-zinc-800"
          >
            ← Назад
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 rounded-2xl border border-zinc-900 bg-zinc-950 p-6 lg:grid-cols-3"
        >
          {/* Левая колонка — поля */}
          <section className="col-span-2 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <label className={labelBase}>Название *</label>
              <input
                className={fieldBase}
                placeholder="Toyota Camry 70"
                value={form.title}
                onChange={onChange('title')}
                required
              />
            </div>

            <div>
              <label className={labelBase}>Slug (URL)</label>
              <input
                className={fieldBase}
                placeholder="toyota-camry-70"
                value={form.slug}
                onChange={onChange('slug')}
              />
            </div>

            <div>
              <label className={labelBase}>Бренд</label>
              <input
                className={fieldBase}
                placeholder="Toyota"
                value={form.brand}
                onChange={onChange('brand')}
              />
            </div>

            <div>
              <label className={labelBase}>Модель</label>
              <input
                className={fieldBase}
                placeholder="Camry"
                value={form.model}
                onChange={onChange('model')}
              />
            </div>

            <div>
              <label className={labelBase}>Класс</label>
              <input
                className={fieldBase}
                placeholder="business / suv / premium …"
                value={form.carClass}
                onChange={onChange('carClass')}
              />
            </div>

            <div>
              <label className={labelBase}>Год</label>
              <input
                type="number"
                className={fieldBase}
                placeholder="2022"
                value={form.year}
                onChange={onChange('year')}
              />
            </div>

            <div>
              <label className={labelBase}>Топливо</label>
              <input
                className={fieldBase}
                placeholder="Бензин"
                value={form.fuel}
                onChange={onChange('fuel')}
              />
            </div>

            <div>
              <label className={labelBase}>Трансмиссия</label>
              <input
                className={fieldBase}
                placeholder="Автомат"
                value={form.transmission}
                onChange={onChange('transmission')}
              />
            </div>

            <div>
              <label className={labelBase}>Мест</label>
              <input
                type="number"
                className={fieldBase}
                placeholder="5"
                value={form.seats}
                onChange={onChange('seats')}
              />
            </div>

            <div>
              <label className={labelBase}>Объём двигателя</label>
              <input
                className={fieldBase}
                placeholder="2.5L"
                value={form.engineVolume}
                onChange={onChange('engineVolume')}
              />
            </div>

            <div>
              <label className={labelBase}>Расход</label>
              <input
                className={fieldBase}
                placeholder="7.4 L/100 km"
                value={form.consumption}
                onChange={onChange('consumption')}
              />
            </div>

            <div className="lg:col-span-2">
              <label className={labelBase}>Описание</label>
              <textarea
                rows={4}
                className={fieldBase}
                placeholder="Короткое описание автомобиля…"
                value={form.description}
                onChange={onChange('description')}
              />
            </div>

            <div>
              <label className={labelBase}>Цена/день (общая)</label>
              <input
                type="number"
                className={fieldBase}
                placeholder="50000"
                value={form.pricePerDay}
                onChange={onChange('pricePerDay')}
              />
            </div>

            <div>
              <label className={labelBase}>Цена 1 день</label>
              <input
                type="number"
                className={fieldBase}
                placeholder="60000"
                value={form.price1d}
                onChange={onChange('price1d')}
              />
            </div>

            <div>
              <label className={labelBase}>Цена 2–4 дня</label>
              <input
                type="number"
                className={fieldBase}
                placeholder="55000"
                value={form.price2_4}
                onChange={onChange('price2_4')}
              />
            </div>

            <div>
              <label className={labelBase}>Цена 5–15 дней</label>
              <input
                type="number"
                className={fieldBase}
                placeholder="52000"
                value={form.price5_15}
                onChange={onChange('price5_15')}
              />
            </div>

            <div>
              <label className={labelBase}>Цена 16–30 дней</label>
              <input
                type="number"
                className={fieldBase}
                placeholder="50000"
                value={form.price16_30}
                onChange={onChange('price16_30')}
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <input
                id="isFeatured"
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => set('isFeatured', e.target.checked)}
                className="h-4 w-4 cursor-pointer rounded border-zinc-700 bg-zinc-900 text-zinc-100 accent-zinc-700"
              />
              <label htmlFor="isFeatured" className="text-sm text-zinc-300">
                Показать в «избранных»
              </label>
            </div>
          </section>

          {/* Правая колонка — медиа и сохранение */}
          <aside className="space-y-6">
            {/* Обложка */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-4">
              <div className="mb-3 text-sm font-medium text-zinc-300">Обложка</div>

              {form.coverImage ? (
                <div className="mb-3 overflow-hidden rounded-lg border border-zinc-900">
                  <img src={form.coverImage} alt="cover" className="h-48 w-full object-cover" />
                </div>
              ) : (
                <div className="mb-3 h-48 w-full rounded-lg border border-dashed border-zinc-800 bg-zinc-900/40" />
              )}

              <div className="flex items-center gap-2">
                <input
                  className={fieldBase + ' flex-1'}
                  placeholder="https://… (URL обложки)"
                  value={form.coverImage}
                  onChange={onChange('coverImage')}
                />

                {/* Вариант 1: Виджет Cloudinary */}
                <CldUploadWidget
                  uploadPreset={CLOUD_PRESET}
                  options={{
                    cloudName: CLOUD_NAME,
                    multiple: false,
                    sources: ['local', 'camera', 'url'],
                  }}
                  onError={(err) => {
                    console.error('Cloudinary error (cover):', err);
                    alert('Ошибка загрузки в Cloudinary (обложка). Проверьте preset и домены.');
                  }}
                  onUpload={(result: any) => {
                    const url = result?.info?.secure_url as string | undefined;
                    if (url) set('coverImage', url);
                  }}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open?.()}
                      className="whitespace-nowrap rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-800"
                    >
                      Загрузить
                    </button>
                  )}
                </CldUploadWidget>

                {/* Вариант 2: Прямой аплоад */}
                <label className="cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-800">
                  {uploadingCover ? 'Загружаем…' : 'Файл…'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      try {
                        setUploadingCover(true);
                        const url = await uploadToCloudinary(f);
                        set('coverImage', url);
                      } catch (err: any) {
                        console.error(err);
                        alert('Upload error: ' + (err?.message || err));
                      } finally {
                        setUploadingCover(false);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Галерея */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-4">
              <div className="mb-3 text-sm font-medium text-zinc-300">Галерея</div>

              {form.gallery.length > 0 ? (
                <div className="mb-3 grid grid-cols-3 gap-2">
                  {form.gallery.map((url) => (
                    <div key={url} className="group relative overflow-hidden rounded-lg border border-zinc-900">
                      <img src={url} alt="" className="h-24 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeFromGallery(url)}
                        className="absolute right-1 top-1 hidden rounded-md bg-black/70 px-2 py-1 text-xs text-zinc-200 backdrop-blur group-hover:block"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mb-3 h-24 w-full rounded-lg border border-dashed border-zinc-800 bg-zinc-900/40" />
              )}

              <div className="flex items-center gap-2">
                <input
                  className={fieldBase + ' flex-1'}
                  placeholder="Вставьте URL и нажмите «+»"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      const url = input.value.trim();
                      if (url) {
                        set('gallery', [...form.gallery, url]);
                        input.value = '';
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = (e.currentTarget.previousSibling as HTMLInputElement)!;
                    const url = input.value.trim();
                    if (url) {
                      set('gallery', [...form.gallery, url]);
                      input.value = '';
                    }
                  }}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-800"
                >
                  +
                </button>

                {/* Виджет Cloudinary (множественный) */}
                <CldUploadWidget
                  uploadPreset={CLOUD_PRESET}
                  options={{ cloudName: CLOUD_NAME, multiple: true, sources: ['local', 'camera', 'url'] }}
                  onError={(err) => {
                    console.error('Cloudinary error (gallery):', err);
                    alert('Ошибка загрузки (галерея).');
                  }}
                  onUpload={(result: any) => {
                    const url = result?.info?.secure_url as string | undefined;
                    if (url) set('gallery', [...form.gallery, url]);
                  }}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open?.()}
                      className="whitespace-nowrap rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-800"
                    >
                      Загрузить
                    </button>
                  )}
                </CldUploadWidget>

                {/* Прямой аплоад (множественный) */}
                <label className="cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-800">
                  {uploadingGallery ? 'Загружаем…' : 'Файлы…'}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length === 0) return;
                      try {
                        setUploadingGallery(true);
                        const uploaded: string[] = [];
                        for (const f of files) {
                          const url = await uploadToCloudinary(f);
                          uploaded.push(url);
                        }
                        set('gallery', [...form.gallery, ...uploaded]);
                      } catch (err: any) {
                        console.error(err);
                        alert('Upload error: ' + (err?.message || err));
                      } finally {
                        setUploadingGallery(false);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Сохранение */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-4">
              {!!notice && (
                <div className="mb-3 rounded-lg border border-red-900/50 bg-red-900/10 px-3 py-2 text-sm text-red-300">
                  {notice}
                </div>
              )}

              <p className="text-xs text-zinc-500 break-all">
                <span className="text-zinc-400">imagesCsv:</span> {imagesCsvPreview}
              </p>

              <button
                type="submit"
                disabled={isPending}
                className="mt-3 w-full rounded-lg border border-zinc-800 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? 'Сохраняем…' : 'Сохранить'}
              </button>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}
