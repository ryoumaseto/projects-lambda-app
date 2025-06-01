"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WorkoutForm } from "@/components/workout/WorkoutForm";
import { Preset } from "@/types/preset";
import { Workout, WorkoutFormData } from "@/types/workout";

interface EditWorkoutPageProps {
  params: {
    id: string;
  };
}

export default function EditWorkoutPage({ params }: EditWorkoutPageProps) {
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workoutRes, presetsRes] = await Promise.all([
          fetch(`/api/workouts/${params.id}`),
          fetch("/api/presets"),
        ]);

        if (!workoutRes.ok || !presetsRes.ok) {
          throw new Error("データの取得に失敗しました");
        }

        const [workoutData, presetsData] = await Promise.all([
          workoutRes.json(),
          presetsRes.json(),
        ]);

        setWorkout(workoutData);
        setPresets(presetsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("データの取得に失敗しました");
        router.push("/workouts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id, router]);

  const handleSubmit = async (data: WorkoutFormData) => {
    try {
      const response = await fetch(`/api/workouts`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workoutId: params.id,
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error("トレーニング記録の更新に失敗しました");
      }

      router.push("/workouts");
    } catch (error) {
      console.error("Error updating workout:", error);
      alert("トレーニング記録の更新に失敗しました");
    }
  };

  const handleCancel = () => {
    router.push("/workouts");
  };

  if (isLoading || !workout) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const initialData: WorkoutFormData = {
    date: workout.date,
    exercises: workout.exercises,
    memo: workout.memo || "",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">トレーニング記録の編集</h1>
      <WorkoutForm
        initialData={workout}
        presets={presets}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
} 