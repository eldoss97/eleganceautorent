'use client';

export default function SocialLinks({ className = '' }: { className?: string }) {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP || '';
  const ig = process.env.NEXT_PUBLIC_INSTAGRAM || '';

  const waHref = wa ? `https://wa.me/${wa}` : '#';

  return (
    <div className={className + ' flex items-center gap-6'}>
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="text-zinc-300 hover:text-zinc-100 underline underline-offset-4"
      >
        WhatsApp
      </a>
      {ig && (
        <a
          href={ig}
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-300 hover:text-zinc-100 underline underline-offset-4"
        >
          Instagram
        </a>
      )}
    </div>
  );
}
