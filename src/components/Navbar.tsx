// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

// из .env
const WA = process.env.NEXT_PUBLIC_WHATSAPP;      // 77712345678 без "+"
const IG = process.env.NEXT_PUBLIC_INSTAGRAM;     // https://instagram.com/...

type Item = { href: string; label: string };

// ВАЖНО: якоря ведут на секции на главной странице с id="catalog" и id="contact"
const NAV_ITEMS: Item[] = [
  { href: '/#catalog', label: 'Каталог машин' },
  { href: '/how',      label: 'Как это работает' },
  { href: '/#contact', label: 'Контакты' },
];

export default function Navbar() {
  const pathname = usePathname(); // '/', '/how', и т.п.
  const [open, setOpen] = useState(false);

  // Активным считаем:
  // - для ссылок с якорём -> если мы на главной ('/')
  // - для обычных путей -> если текущий путь совпадает или начинается с href
  const isActive = (href: string) => {
    const hasHash = href.includes('#');
    const base = href.split('#')[0] || '/';
    if (hasHash) return pathname === '/'; // якоря активны только на главной
    if (base === '/') return pathname === '/';
    return pathname === base || pathname.startsWith(base + '/');
  };

  const waHref = WA ? `https://wa.me/${WA}` : '';
  const igHref = IG || '';

  const itemClasses = (active: boolean) =>
    [
      'rounded-md px-3 py-2 text-sm transition-colors',
      active
        ? 'bg-zinc-900 text-white'
        : 'text-neutral-300 hover:bg-zinc-900 hover:text-white',
    ].join(' ');

  return (
    <header className="border-b border-white/10 bg-neutral-950">
      <div className="container-max flex items-center justify-between py-4">
        {/* Логотип */}
        <Link href="/" className="text-xl font-serif tracking-wide text-white hover:opacity-90">
          ELEGANCE AUTORENT
        </Link>

        {/* Десктоп-меню */}
        <nav className="hidden items-center gap-2 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}          // для якорей это безопаснее
              className={itemClasses(isActive(item.href))}
            >
              {item.label}
            </Link>
          ))}

          {/* Соцсети (опционально) */}
          {waHref && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-3 py-2 text-sm text-neutral-300 hover:bg-zinc-900 hover:text-white"
              title="WhatsApp"
            >
              WhatsApp
            </a>
          )}
          {igHref && (
            <a
              href={igHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-3 py-2 text-sm text-neutral-300 hover:bg-zinc-900 hover:text-white"
              title="Instagram"
            >
              Instagram
            </a>
          )}
        </nav>

        {/* Кнопка мобильного меню */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm text-neutral-300 hover:bg-zinc-900 md:hidden"
          aria-label="Меню"
        >
          Меню
          <span className="text-neutral-500">{open ? '▲' : '▼'}</span>
        </button>
      </div>

      {/* Мобильное меню */}
      {open && (
        <div className="border-t border-white/10 bg-neutral-950 md:hidden">
          <nav className="container-max flex flex-col gap-1 py-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                onClick={() => setOpen(false)}
                className={itemClasses(isActive(item.href))}
              >
                {item.label}
              </Link>
            ))}
            {waHref && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md px-3 py-2 text-sm text-neutral-300 hover:bg-zinc-900 hover:text-white"
                onClick={() => setOpen(false)}
              >
                WhatsApp
              </a>
            )}
            {igHref && (
              <a
                href={igHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md px-3 py-2 text-sm text-neutral-300 hover:bg-zinc-900 hover:text-white"
                onClick={() => setOpen(false)}
              >
                Instagram
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
