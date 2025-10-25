export function CarSpecs({
  seats,
  transmission,
  fuel,
  engineVolume,
  consumption,
  year,
}: {
  seats: number;
  transmission: string;
  fuel: string;
  engineVolume?: string | null;
  consumption?: string | null;
  year?: number | null;
}) {
  const Item = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <div className="px-3 py-2 rounded-xl bg-white/5 text-sm flex items-center gap-2">
      <span className="opacity-70">{icon}</span>
      <span>{label}</span>
    </div>
  );

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <Item
        icon={<span>🧍</span>}
        label={`${seats} мест`}
      />
      <Item
        icon={<span>🚗</span>}
        label={`КПП: ${transmission}`}
      />
      <Item
        icon={<span>⛽</span>}
        label={`Топливо: ${fuel}`}
      />
      {consumption && <Item icon={<span>📈</span>} label={`Расход: ${consumption}`} />}
      {engineVolume && <Item icon={<span>⚙️</span>} label={`Объём: ${engineVolume}`} />}
      {year ? <Item icon={<span>📅</span>} label={`Год: ${year}`} /> : null}
    </div>
  );
}
