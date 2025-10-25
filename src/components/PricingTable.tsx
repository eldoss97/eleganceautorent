export function PricingTable({
  p1,
  p24,
  p515,
  p1630,
}: {
  p1: number;
  p24: number;
  p515: number;
  p1630: number;
}) {
  return (
    <table className="w-full text-left card">
      <tbody className="divide-y divide-white/10">
        <tr>
          <th className="p-3 font-medium">1 день</th>
          <td className="p-3">{p1.toLocaleString()} ₸ / день</td>
        </tr>
        <tr>
          <th className="p-3 font-medium">2–4 дня</th>
          <td className="p-3">{p24.toLocaleString()} ₸ / день</td>
        </tr>
        <tr>
          <th className="p-3 font-medium">5–15 дней</th>
          <td className="p-3">{p515.toLocaleString()} ₸ / день</td>
        </tr>
        <tr>
          <th className="p-3 font-medium">16–30 дней</th>
          <td className="p-3">{p1630.toLocaleString()} ₸ / день</td>
        </tr>
      </tbody>
    </table>
  );
}
