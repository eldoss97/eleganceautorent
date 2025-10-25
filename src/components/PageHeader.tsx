export function PageHeader({
  title,
  subtitle,
  crumbs = [],
}: {
  title: string;
  subtitle?: string;
  crumbs?: { href: string; label: string }[];
}) {
  return (
    <header className="border-b border-white/10 bg-neutral-950">
      <div className="container-max py-6 space-y-3">
        {crumbs.length > 0 && (
          <nav className="text-sm text-neutral-400 flex gap-2 flex-wrap">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-2">
                <a href={c.href} className="hover:text-white">{c.label}</a>
                {i < crumbs.length - 1 && <span>›</span>}
              </span>
            ))}
          </nav>
        )}
        <h1 className="hero-title">{title}</h1>
        {subtitle && <p className="text-neutral-400">{subtitle}</p>}
      </div>
    </header>
  );
}
