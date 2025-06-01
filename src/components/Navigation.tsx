"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardDocumentListIcon,
  ChartBarIcon,
  AdjustmentsHorizontalIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  ChevronLeftIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useSidebarStore } from "@/store/sidebar";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "トレーニング記録",
    href: "/workouts",
    icon: ClipboardDocumentListIcon,
  },
  {
    name: "プリセット管理",
    href: "/presets",
    icon: AdjustmentsHorizontalIcon,
  },
  {
    name: "履歴・グラフ",
    href: "/history",
    icon: ChartBarIcon,
  },
];

export function Navigation() {
  const pathname = usePathname();
  const { isOpen, open, close } = useSidebarStore();

  return (
    <>
      {/* モバイルオーバーレイ */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden" 
          onClick={close}
        />
      )}

      {/* モバイルヘッダーメニューボタン */}
      <div className="fixed top-0 left-0 z-40 flex h-16 items-center lg:hidden">
        <button
          type="button"
          className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          onClick={open}
        >
          <span className="sr-only">メニューを開く</span>
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      <nav
        className={cn(
          "fixed top-0 left-0 z-40 h-screen bg-white shadow-sm border-r border-blue-100 transition-all duration-300",
          "lg:sticky lg:top-0",
          isOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full w-64 lg:translate-x-0 lg:w-16"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-blue-100 px-3">
            {isOpen ? (
              <>
                <div className="text-lg font-semibold text-blue-900">メニュー</div>
                <button
                  type="button"
                  className="lg:hidden"
                  onClick={close}
                >
                  <XMarkIcon className="h-6 w-6 text-gray-400" />
                </button>
              </>
            ) : (
              <div className="w-full text-center hidden lg:block">
                <button
                  type="button"
                  onClick={open}
                  className="hover:text-blue-600"
                >
                  <Bars3Icon className="mx-auto h-6 w-6 text-blue-900" />
                </button>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-blue-50/50 hover:text-blue-600"
                  )}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      close();
                    }
                  }}
                  title={item.name}
                >
                  <item.icon
                    className={cn(
                      "h-6 w-6 flex-shrink-0",
                      isOpen && "mr-3",
                      isActive
                        ? "text-blue-500"
                        : "text-gray-400 group-hover:text-blue-400"
                    )}
                    aria-hidden="true"
                  />
                  {isOpen && item.name}
                </Link>
              );
            })}
          </div>
          <div className="border-t border-blue-100 py-2">
            <button
              type="button"
              className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-blue-50/50 hover:text-blue-600"
              title="ログアウト"
            >
              <ArrowRightOnRectangleIcon
                className={cn(
                  "h-6 w-6 text-gray-400 group-hover:text-blue-400",
                  isOpen && "mr-3"
                )}
                aria-hidden="true"
              />
              {isOpen && "ログアウト"}
            </button>
          </div>
        </div>
      </nav>

      {/* PCでの開閉ボタン */}
      {isOpen && (
        <button
          type="button"
          onClick={close}
          className="fixed top-20 left-[15.5rem] z-50 hidden lg:flex h-6 w-6 items-center justify-center rounded-full bg-white text-gray-500 shadow-md hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
      )}
    </>
  );
} 