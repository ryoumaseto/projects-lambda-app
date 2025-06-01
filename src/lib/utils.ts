import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function classNames(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // 今日の場合
  if (date.toDateString() === today.toDateString()) {
    return "今日";
  }
  // 昨日の場合
  if (date.toDateString() === yesterday.toDateString()) {
    return "昨日";
  }

  // 今年の場合は年を省略
  if (date.getFullYear() === today.getFullYear()) {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }

  // 違う年の場合は年も表示
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
} 