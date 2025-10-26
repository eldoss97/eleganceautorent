import Link from 'next/link';
import SocialLinks from '@/components/SocialLinks';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-900 bg-black text-zinc-300">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-10 md:grid-cols-3">
        {/* Колонка 1: Бренд и описание */}
        <div>
          <div className="text-xl font-semibold tracking-wide text-zinc-100">
            ELEGANCE AUTORENT
          </div>
          <p className="mt-3 text-zinc-400">
            Премиальная аренда авто в Алматы без скрытых платежей.
          </p>
        </div>

        {/* Колонка 2: Навигация */}
        <nav>
          <h3 className="mb-3 text-sm font-semibold text-zinc-400">НАВИГАЦИЯ</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/catalog"
                className="hover:text-zinc-100 transition-colors"
              >
                Каталог машин
              </Link>
            </li>
            <li>
              <Link href="/how" className="hover:text-zinc-100 transition-colors">
                Как это работает
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-zinc-100 transition-colors">
                Контакты
              </Link>
            </li>
          </ul>
        </nav>

        {/* Колонка 3: Связаться */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-zinc-400">СВЯЗАТЬСЯ</h3>
          <SocialLinks />
        </div>
      </div>

      <div className="border-t border-zinc-900 py-4 text-center text-zinc-500 text-sm">
        © {year} ELEGANCE AUTORENT. Все права защищены.
      </div>
    </footer>
  );
}
