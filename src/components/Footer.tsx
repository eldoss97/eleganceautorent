// Серверный компонент (без "use client"), чтобы спокойно читать env
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  const phone = process.env.NEXT_PUBLIC_PHONE || "";
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM || "";

  return (
    <footer className="mt-12 border-t border-white/10">
      <div className="container-max py-8 grid gap-6 md:grid-cols-3">
        <div>
          <div className="font-display text-xl text-white">ELEGANCE AUTORENT</div>
          <p className="text-sm text-neutral-400 mt-2">
            Премиальная аренда авто в Алматы без скрытых платежей.
          </p>
          <p className="text-xs text-neutral-500 mt-3">
            © {year} ELEGANCE AUTORENT. Все права защищены.
          </p>
        </div>

        <div>
          <div className="text-sm uppercase tracking-wide text-neutral-400">Навигация</div>
          <div className="mt-3 flex flex-col gap-2 text-neutral-300">
            <Link href="/#catalog" className="hover:text-white">Каталог машин</Link>
            <Link href="/#how" className="hover:text-white">Как это работает</Link>
            <Link href="/#contact" className="hover:text-white">Контакты</Link>
          </div>
        </div>

        <div>
          <div className="text-sm uppercase tracking-wide text-neutral-400">Связаться</div>
          <div className="mt-3 flex flex-col gap-2 text-neutral-300">
            {phone && (
              <a href={`tel:+${phone.replace(/\D/g, "")}`} className="hover:text-white">
                Телефон: +{phone}
              </a>
            )}
            {instagram && (
              <a href={instagram} target="_blank" rel="noreferrer" className="hover:text-white">
                Instagram
              </a>
            )}
            <a href="/api/redirect-wa" className="hover:text-white">WhatsApp</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
