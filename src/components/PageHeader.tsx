// src/components/PageHeader.tsx
import Link from 'next/link';
import { ReactNode } from 'react';

export type Crumb = { href?: string; label: string };

export function PageHeader({
  title,
  subtitle,
  crumbs = [],
  actions,
  centered = false,
  className = '',
}: {
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];
  /** Правый блок с кнопками/действиями */
  actions?: ReactNode;
  /** Выравнять заголовок и подзаголовок по центру */
  centered?: boolean;
  /** Дополнительные классы на <header> */
  className?: string;
}) {
  // Для JSON-LD лучше указывать абсолютные ссылки — берём из env если есть
  const site =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://eleganceautorent.kz';

  const jsonLd =
    crumbs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: crumbs.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.label,
            ...(c.href
              ? { item: c.href.startsWith('http') ? c.href : site + c.href }
              : {}),
          })),
        }
      : null;

  return (
    <header
      className={`border-b border-white/10 bg-neutral-950 ${className}`}
    >
      <div className="container-max py-6">
        <div
          className={`flex items-start gap-4 ${
            centered ? 'justify-center text-center' : 'justify-between'
          }`}
        >
          <div className="flex-1 space-y-3">
            {crumbs.length > 0 && (
              <nav
                aria-label="Хлебные крошки"
                className="flex flex-wrap items-center gap-2 text-xs text-neutral-400"
              >
                {crumbs.map((c, i) => {
                  const isLast = i === crumbs.length - 1;
                  return (
                    <span
                      key={`${c.label}-${i}`}
                      className="inline-flex items-center gap-2"
                    >
                      {isLast || !c.href ? (
                        <span aria-current="page" className="text-neutral-300">
                          {c.label}
                        </span>
                      ) : (
                        <Link href={c.href} className="hover:text-white">
                          {c.label}
                        </Link>
                      )}
                      {!isLast && <span aria-hidden>›</span>}
                    </span>
                  );
                })}
              </nav>
            )}

            <h1 className="hero-title">{title}</h1>
            {subtitle && <p className="text-neutral-400">{subtitle}</p>}
          </div>

          {actions && <div className="shrink-0">{actions}</div>}
        </div>

        {jsonLd && (
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
      </div>
    </header>
  );
}
