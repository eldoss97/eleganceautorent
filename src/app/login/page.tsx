// src/app/login/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Вход в админку",
};

export default function LoginPage() {
  return (
    <div className="container-max max-w-md mx-auto py-12">
      <h1 className="section-title mb-4">Вход в админ-панель</h1>

      {/* Простая HTML-форма → POST /api/login */}
      <form method="POST" action="/api/login" className="card p-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="password" className="subtle">Пароль</label>
          <input
            id="password"
            name="password"
            type="password"
            className="input w-full"
            placeholder="Введите пароль"
            required
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-neutral-300">
          <input type="checkbox" name="remember" />
          Запомнить меня (7 дней)
        </label>

        <button type="submit" className="btn btn-primary w-full">Войти</button>
      </form>
    </div>
  );
}
