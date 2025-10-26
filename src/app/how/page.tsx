// src/app/how/page.tsx
import { PageHeader } from '@/components/PageHeader';

export const metadata = {
  title: 'Как это работает — ELEGANCE AUTORENT',
  description:
    'Процесс аренды: выбор авто, документы, выдача, депозит и возврат.',
};

export default function HowPage() {
  // Ссылка на WhatsApp из .env (например, 77712345678)
  const wa = process.env.NEXT_PUBLIC_WHATSAPP;
  const waHref = wa ? `https://wa.me/${wa}` : '#';

  return (
    <>
      <PageHeader
        title="Как это работает"
        subtitle="Пошагово: выбор авто, документы, выдача и возврат."
        crumbs={[
          { href: '/', label: 'Главная' },
          { href: '/how', label: 'Как это работает' },
        ]}
      />

      <main className="container-max py-10 space-y-10">
        <section className="prose prose-invert max-w-none">
          <ol className="list-decimal space-y-6 pl-5">
            <li>
              <strong>Выбор авто.</strong> Откройте{' '}
              <a href="/cars">каталог</a>, выберите машину и сроки.
            </li>
            <li>
              <strong>Быстрая бронь.</strong> Напишите нам в WhatsApp — мы подтверждаем
              доступность и фиксируем тариф.
            </li>
            <li>
              <strong>Документы.</strong> Паспорт/удостоверение, водительское удостоверение.
            </li>
            <li>
              <strong>Выдача авто.</strong> Осмотр, фотофиксация, договор, депозит (если требуется).
            </li>
            <li>
              <strong>Поездка.</strong> Наслаждайтесь авто — мы всегда на связи.
            </li>
            <li>
              <strong>Возврат.</strong> Осмотр, закрытие договора, возврат депозита.
            </li>
          </ol>
        </section>

        <div>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm hover:bg-zinc-800"
          >
            Написать в WhatsApp
          </a>
        </div>
      </main>
    </>
  );
}
