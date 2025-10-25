// src/app/login/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Вход в админку",
};

export default function LoginPage() {
  return (
    <div className="container-max max-w-md mx-auto">
      <h1 className="section-title mb-4">Вход в админ-панель</h1>

      {/* Простой HTML-формой уходим POST'ом в /api/login */}
      <form method="POST" action="/api/login" className="card p-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="password" className="subtle">Пароль</label>
          <input
            id="password"
            name="password"
            type="password"
            className="input"
            placeholder="Введите пароль"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">Войти</button>
      </form>
    </div>
  );
}
