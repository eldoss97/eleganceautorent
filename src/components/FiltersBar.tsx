"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function FiltersBar() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // локальное состояние (инициализируем из URL)
  const [brand, setBrand] = useState(sp.get("brand") || "");
  const [fuel, setFuel] = useState(sp.get("fuel") || "");
  const [transmission, setTransmission] = useState(sp.get("transmission") || "");
  const [min, setMin] = useState(sp.get("min") || "");
  const [max, setMax] = useState(sp.get("max") || "");
  const [sort, setSort] = useState(sp.get("sort") || "featured");

  // при изменении URL — синхронизируем состояние
  useEffect(() => {
    setBrand(sp.get("brand") || "");
    setFuel(sp.get("fuel") || "");
    setTransmission(sp.get("transmission") || "");
    setMin(sp.get("min") || "");
    setMax(sp.get("max") || "");
    setSort(sp.get("sort") || "featured");
  }, [sp]);

  // текущая выбранная категория из табов (если есть)
  const currentClass = useMemo(() => {
    const c = (sp.get("class") || "").trim();
    return c && c.toLowerCase() !== "all" ? c : "";
  }, [sp]);

  // только цифры в мин/макс
  const onMinChange = (v: string) => setMin(v.replace(/[^\d]/g, ""));
  const onMaxChange = (v: string) => setMax(v.replace(/[^\d]/g, ""));

  // собрать чистые query без пустых значений
  const buildQuery = () => {
    const params = new URLSearchParams();

    if (currentClass) params.set("class", currentClass);
    if (brand.trim()) params.set("brand", brand.trim());
    if (fuel) params.set("fuel", fuel);
    if (transmission) params.set("transmission", transmission);
    if (min && Number(min) > 0) params.set("min", String(Number(min)));
    if (max && Number(max) > 0) params.set("max", String(Number(max)));
    if (sort && sort !== "featured") params.set("sort", sort);

    return params;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = buildQuery();
    const url = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(url, { scroll: true });
  };

  // ссылка сброса: сохраняем только выбранную категорию (если она не All)
  const resetHref = useMemo(() => {
    const p = new URLSearchParams();
    if (currentClass) p.set("class", currentClass);
    return p.toString() ? `${pathname}?${p.toString()}` : pathname;
  }, [currentClass, pathname]);

  return (
    <form onSubmit={handleSubmit} className="card p-4 grid grid-cols-2 md:grid-cols-6 gap-3">
      <input
        name="brand"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        className="input"
        placeholder="Бренд: Mercedes..."
        aria-label="Бренд"
      />

      <select
        name="fuel"
        value={fuel}
        onChange={(e) => setFuel(e.target.value)}
        className="select"
        aria-label="Топливо"
      >
        <option value="">Топливо</option>
        <option>Бензин</option>
        <option>Дизель</option>
        <option>Гибрид</option>
        <option>Электро</option>
      </select>

      <select
        name="transmission"
        value={transmission}
        onChange={(e) => setTransmission(e.target.value)}
        className="select"
        aria-label="КПП"
      >
        <option value="">КПП</option>
        <option>AT</option>
        <option>MT</option>
        <option>CVT</option>
      </select>

      <input
        name="min"
        value={min}
        onChange={(e) => onMinChange(e.target.value)}
        className="input"
        placeholder="Мин ₸/день"
        inputMode="numeric"
        aria-label="Минимальная цена"
      />

      <input
        name="max"
        value={max}
        onChange={(e) => onMaxChange(e.target.value)}
        className="input"
        placeholder="Макс ₸/день"
        inputMode="numeric"
        aria-label="Максимальная цена"
      />

      <select
        name="sort"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="select"
        aria-label="Сортировка"
      >
        <option value="featured">Сначала топовые</option>
        <option value="price_asc">Цена ↑</option>
        <option value="price_desc">Цена ↓</option>
        <option value="year_desc">Год ↓</option>
      </select>

      <div className="col-span-2 md:col-span-6 flex gap-2 justify-end">
        <button type="submit" className="btn">
          Показать
        </button>
        <a href={resetHref} className="btn">
          Сброс
        </a>
      </div>
    </form>
  );
}
