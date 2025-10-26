'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

type Props = {
  href: string;
  children: React.ReactNode;
};

export default function NavLink({ href, children }: Props) {
  const pathname = usePathname();
  const clean = href.trim(); // на всякий случай

  const isActive =
    pathname === clean ||
    (clean !== '/' && pathname.startsWith(clean + '/'));

  return (
    <Link
      href={clean}
      prefetch
      className={cn(
        'rounded-md px-3 py-2 text-sm text-zinc-300 hover:text-white transition-colors',
        isActive && 'bg-zinc-800 text-white'
      )}
    >
      {children}
    </Link>
  );
}
