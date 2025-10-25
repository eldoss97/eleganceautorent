"use client";
import { useSearchParams, usePathname } from "next/navigation";

const CATS = [
  { key: "", label: "All" },
  { key: "business", label: "Business" },
  { key: "suv", label: "SUV" },
  { key: "minibus", label: "Minibuses" },
  { key: "premium", label: "Premium" },
];

export function CategoryTabs() {
  const sp = useSearchParams();
  const pathname = usePathname();
  const current = sp.get("class") ?? "";

  const link = (key: string) => {
    const params = new URLSearchParams(sp.toString());
    if (key) params.set("class", key); else params.delete("class");
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="container-max">
      <div className="card p-2 flex flex-wrap gap-2">
        {CATS.map(c => (
          <a
            key={c.key}
            href={link(c.key)}
            className={
              "px-4 py-2 rounded-xl " +
              (current === c.key ? "bg-white text-black" : "bg-white/10 text-neutral-200 hover:bg-white/15")
            }
          >
            {c.label}
          </a>
        ))}
      </div>
    </div>
  );
}
