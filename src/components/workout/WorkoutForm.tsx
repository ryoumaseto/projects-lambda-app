"use client";

import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Workout, WorkoutFormData, WorkoutExercise } from "@/types/workout";
import { Preset } from "@/types/preset";
import { ExerciseEditor } from "./ExerciseEditor";

interface WorkoutFormProps {
  initialData?: Workout;
  presets: Preset[];
  onSubmit: (data: WorkoutFormData) => Promise<void>;
  onCancel: () => void;
}

export function WorkoutForm({
  initialData,
  presets,
  onSubmit,
  onCancel,
}: WorkoutFormProps) {
  const [formData, setFormData] = useState<WorkoutFormData>({
    date: initialData?.date || new Date().toISOString().split("T")[0],
    exercises: initialData?.exercises || [],
    memo: initialData?.memo || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.exercises.length === 0) {
      alert("少なくとも1つの種目を追加してください");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("トレーニング記録の保存に失敗しました:", error);
      alert("トレーニング記録の保存に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addExercise = () => {
    const newExercise: WorkoutExercise = {
      name: "",
      category: "other",
      sets: [
        {
          weight: 10,
          reps: 10,
          memo: "",
        },
      ],
    };
    setFormData({
      ...formData,
      exercises: [...formData.exercises, newExercise],
    });
  };

  const updateExercise = (index: number, exercise: WorkoutExercise) => {
    const newExercises = [...formData.exercises];
    newExercises[index] = exercise;
    setFormData({
      ...formData,
      exercises: newExercises,
    });
  };

  const removeExercise = (index: number) => {
    setFormData({
      ...formData,
      exercises: formData.exercises.filter((_, i) => i !== index),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          日付 *
        </label>
        <input
          type="date"
          id="date"
          required
          value={formData.date}
          onChange={(e) =>
            setFormData({
              ...formData,
              date: e.target.value,
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">種目</h3>
          <button
            type="button"
            onClick={addExercise}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            種目を追加
          </button>
        </div>

        {formData.exercises.map((exercise, index) => (
          <ExerciseEditor
            key={index}
            exercise={exercise}
            presets={presets}
            onUpdate={(updated) => updateExercise(index, updated)}
            onDelete={() => removeExercise(index)}
          />
        ))}

        {formData.exercises.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            種目を追加してください
          </p>
        )}
      </div>

      <div>
        <label htmlFor="memo" className="block text-sm font-medium text-gray-700">
          メモ
        </label>
        <textarea
          id="memo"
          rows={3}
          value={formData.memo}
          onChange={(e) =>
            setFormData({
              ...formData,
              memo: e.target.value,
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isSubmitting ? "保存中..." : "保存"}
        </button>
      </div>
    </form>
  );
} 