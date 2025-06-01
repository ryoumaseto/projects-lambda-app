"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WorkoutForm } from "@/components/workout/WorkoutForm";
import { Preset } from "@/types/preset";
import { WorkoutFormData } from "@/types/workout";

export default function NewWorkoutPage() {
  const router = useRouter();
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const response = await fetch("/api/presets");
        if (!response.ok) {
          throw new Error("プリセットの取得に失敗しました");
        }
        const data = await response.json();
        setPresets(data);
      } catch (error) {
        console.error("Error fetching presets:", error);
        alert("プリセットの取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPresets();
  }, []);

  const handleSubmit = async (data: WorkoutFormData) => {
    try {
      const response = await fetch("/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("トレーニング記録の保存に失敗しました");
      }

      router.push("/workouts");
    } catch (error) {
      console.error("Error saving workout:", error);
      alert("トレーニング記録の保存に失敗しました");
    }
  };

  const handleCancel = () => {
    router.push("/workouts");
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
      <h1 className="text-2xl font-bold mb-6">新規トレーニング記録</h1>
      <WorkoutForm
        presets={presets}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
} 