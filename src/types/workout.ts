export type WorkoutPeriod = "all" | "week" | "month" | "3months" | "6months" | "year";

export interface WorkoutSet {
  weight: number;
  reps: number;
  memo: string;
}

export interface WorkoutExercise {
  presetId?: string;  // プリセットから作成した場合
  name: string;
  category: string;
  sets: WorkoutSet[];
  memo?: string;
}

export interface WorkoutFormData {
  date: string;
  exercises: WorkoutExercise[];
  memo?: string;
}

export interface Workout extends WorkoutFormData {
  userId: string;
  workoutId: string;
  createdAt: string;
  updatedAt: string;
}

export const WORKOUT_PERIODS: { value: WorkoutPeriod; label: string }[] = [
  { value: "all", label: "全期間" },
  { value: "week", label: "1週間" },
  { value: "month", label: "1ヶ月" },
  { value: "3months", label: "3ヶ月" },
  { value: "6months", label: "6ヶ月" },
  { value: "year", label: "1年" },
]; 