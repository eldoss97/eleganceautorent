'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

export default function DeleteButton({
  id,
  title,
}: {
  id: number;
  title?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    const confirmText = `Удалить объявление${title ? ` «${title}»` : ''}? Это действие необратимо.`;
    if (!confirm(confirmText)) return;

    try {
      setBusy(true);
      const res = await fetch(`/api/admin/cars/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(txt || `HTTP ${res.status}`);
      }
      startTransition(() => {
        router.push('/admin/cars');
        router.refresh();
      });
    } catch (e: any) {
      alert('Не удалось удалить: ' + (e?.message || 'unknown'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={busy || pending}
      className="w-full rounded-lg border border-red-900/50 bg-red-900/20 px-4 py-2 text-sm font-medium text-red-200 hover:bg-red-900/30 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {busy || pending ? 'Удаляем…' : 'Удалить объявление'}
    </button>
  );
}
