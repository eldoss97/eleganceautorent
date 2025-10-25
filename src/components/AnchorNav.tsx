"use client";

export function AnchorNav({
  items,
}: {
  items: { id: string; label: string }[];
}) {
  return (
    <aside className="card p-3 sticky top-20 space-y-2 text-sm">
      {items.map((i) => (
        <a
          key={i.id}
          href={`#${i.id}`}
          className="block px-3 py-2 rounded-lg hover:bg-white/10"
        >
          {i.label}
        </a>
      ))}
    </aside>
  );
}
