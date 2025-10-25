const MAP: Record<string, string> = {
  ё: "yo", й: "y", ц: "ts", у: "u", к: "k", е: "e", н: "n", г: "g", ш: "sh",
  щ: "sch", з: "z", х: "h", ъ: "", ф: "f", ы: "y", в: "v", а: "a", п: "p",
  р: "r", о: "o", л: "l", д: "d", ж: "zh", э: "e", я: "ya", ч: "ch", с: "s",
  м: "m", и: "i", т: "t", ь: "", б: "b", ю: "yu",
};

export default function slugify(input: string): string {
  if (!input) return "";
  const lower = input.toString().toLowerCase().trim();

  const translit = lower.replace(/./g, (ch) => {
    if (MAP[ch] !== undefined) return MAP[ch];
    if (/[a-z0-9]/.test(ch)) return ch;
    return "-";
  });

  return translit.replace(/-+/g, "-").replace(/^-|-$/g, "");
}
