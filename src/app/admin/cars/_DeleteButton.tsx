'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteButton({
  id,
  title,
  redirectTo = '/admin/cars',
}: {
  id: number;
  title?: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onDelete() {
    if (pending) return;
    const ok = window.confirm(`Удалить «${title ?? 'объявление'}»? Это действие необратимо.`);
    if (!ok) return;

    setPending(true);
    try {
      const res = await fetch(`/api/admin/cars/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `HTTP ${res.status}`);
      }
      router.push(redirectTo);
      router.refresh();
    } catch (e: any) {
      alert('Не удалось удалить: ' + (e?.message || 'unknown'));
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={onDelete}
      disabled={pending}
      className="rounded-lg border border-red-900/40 bg-red-900/20 px-4 py-2 text-sm text-red-200 hover:bg-red-900/30 disabled:opacity-60"
    >
      {pending ? 'Удаление…' : 'Удалить объявление'}
    </button>
  );
}
