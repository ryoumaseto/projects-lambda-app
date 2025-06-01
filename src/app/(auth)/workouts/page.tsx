"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Workout } from "@/types/workout";
import { Preset } from "@/types/preset";
import { formatDate } from "@/lib/utils";

const PERIOD_OPTIONS = [
  { value: "all", label: "全期間" },
  { value: "week", label: "1週間" },
  { value: "month", label: "1ヶ月" },
  { value: "3months", label: "3ヶ月" },
  { value: "6months", label: "6ヶ月" },
  { value: "year", label: "1年" },
] as const;

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [period, setPeriod] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workoutsRes, presetsRes] = await Promise.all([
          fetch(`/api/workouts?period=${period}`),
          fetch("/api/presets"),
        ]);

        if (!workoutsRes.ok || !presetsRes.ok) {
          throw new Error("データの取得に失敗しました");
        }

        const [workoutsData, presetsData] = await Promise.all([
          workoutsRes.json(),
          presetsRes.json(),
        ]);

        setWorkouts(workoutsData);
        setPresets(presetsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("データの取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [period]);

  const handleDelete = async (workoutId: string) => {
    if (!confirm("このトレーニング記録を削除してもよろしいですか？")) {
      return;
    }

    try {
      const response = await fetch("/api/workouts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workoutId }),
      });

      if (!response.ok) {
        throw new Error("削除に失敗しました");
      }

      setWorkouts(workouts.filter((workout) => workout.workoutId !== workoutId));
    } catch (error) {
      console.error("Error deleting workout:", error);
      alert("トレーニング記録の削除に失敗しました");
    }
  };

  const getPresetName = (presetId: string) => {
    const preset = presets.find((p) => p.presetId === presetId);
    return preset?.name || "不明なプリセット";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">トレーニング記録</h1>
        <Link
          href="/workouts/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          新規記録
        </Link>
      </div>

      <div className="mb-6">
        <label htmlFor="period" className="block text-sm font-medium text-gray-700">
          期間
        </label>
        <select
          id="period"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          {PERIOD_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">トレーニング記録がありません</p>
        </div>
      ) : (
        <div className="space-y-4">
          {workouts.map((workout) => (
            <div
              key={workout.workoutId}
              className="bg-white shadow rounded-lg p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">{formatDate(workout.date)}</h2>
                  <div className="mt-2 space-y-2">
                    {workout.exercises.map((exercise, index) => (
                      <div key={index} className="text-gray-600">
                        <span className="font-medium">
                          {exercise.presetId
                            ? getPresetName(exercise.presetId)
                            : exercise.name}
                        </span>
                        <span className="text-gray-400 ml-2">
                          {exercise.sets
                            .map(
                              (set) => `${set.weight}kg × ${set.reps}回`
                            )
                            .join(", ")}
                        </span>
                      </div>
                    ))}
                  </div>
                  {workout.memo && (
                    <p className="mt-2 text-gray-500">{workout.memo}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={`/workouts/${workout.workoutId}/edit`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    編集
                  </Link>
                  <button
                    onClick={() => handleDelete(workout.workoutId)}
                    className="text-red-600 hover:text-red-800"
                  >
                    削除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 