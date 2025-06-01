"use client";

import { redirect } from "next/navigation";

export default function Home() {
  // 開発環境では自動的にワークアウトページにリダイレクト
  if (process.env.AUTH_MODE === "development") {
    redirect("/workout");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Workout Tracker
          </h2>
        </div>
        <button
          type="button"
          className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => redirect("/workout")}
        >
          開発用ログイン
        </button>
      </div>
    </div>
  );
}
