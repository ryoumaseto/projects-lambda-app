"use client";

import { UserCircleIcon } from "@heroicons/react/24/outline";

export function Header() {
  return (
    <header className="bg-white border-b border-blue-100 shadow-sm">
      <div className="flex h-16 items-center justify-between px-3 lg:px-6">
        <div className="flex items-center">
          <div className="w-12 lg:w-auto" /> {/* モバイルメニューボタン用のスペース */}
          <h1 className="text-lg lg:text-xl font-semibold text-blue-900">
            Workout Tracker
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <UserCircleIcon className="h-8 w-8 text-blue-500" />
            <div className="hidden lg:block text-sm">
              <p className="font-medium text-gray-700">開発ユーザー</p>
              <p className="text-gray-500">dev@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 