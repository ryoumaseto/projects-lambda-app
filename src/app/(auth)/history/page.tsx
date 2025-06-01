"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { WorkoutPeriod } from "@/types/workout";
import { Preset } from "@/types/preset";

interface HistoryData {
  date: string;
  presetId: string;
  presetName: string;
  sets: {
    setNumber: number;
    weight: number;
    reps: number;
  }[];
}

interface ChartData {
  date: string;
  maxWeight: number;
  avgWeight: number;
  totalReps: number;
}

export default function HistoryPage() {
  const [period, setPeriod] = useState<WorkoutPeriod>("month");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");
  const [presets, setPresets] = useState<Preset[]>([]);
  const [historyData, setHistoryData] = useState<HistoryData[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // プリセット一覧を取得
  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const response = await fetch("/api/presets");
        if (!response.ok) throw new Error("Failed to fetch presets");
        const data = await response.json();
        setPresets(data);
        if (data.length > 0 && !selectedPresetId) {
          setSelectedPresetId(data[0].presetId);
        }
      } catch (error) {
        console.error("Error fetching presets:", error);
      }
    };
    fetchPresets();
  }, []);

  // 履歴データを取得
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const params = new URLSearchParams({
          period,
          ...(selectedPresetId && { presetId: selectedPresetId }),
        });
        const response = await fetch(`/api/history?${params}`);
        if (!response.ok) throw new Error("Failed to fetch history");
        const data: HistoryData[] = await response.json();
        setHistoryData(data);

        // チャートデータを生成
        const chartData = data
          .filter(item => !selectedPresetId || item.presetId === selectedPresetId)
          .map(item => ({
            date: item.date,
            maxWeight: Math.max(...item.sets.map(set => set.weight)),
            avgWeight: item.sets.reduce((sum, set) => sum + set.weight, 0) / item.sets.length,
            totalReps: item.sets.reduce((sum, set) => sum + set.reps, 0),
          }));
        setChartData(chartData);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };
    fetchHistory();
  }, [period, selectedPresetId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">履歴・グラフ</h1>
        <div className="flex space-x-4">
          <select
            className="rounded-md border-gray-300 text-sm"
            value={period}
            onChange={(e) => setPeriod(e.target.value as WorkoutPeriod)}
          >
            <option value="week">過去1週間</option>
            <option value="month">過去1ヶ月</option>
            <option value="3months">過去3ヶ月</option>
            <option value="6months">過去6ヶ月</option>
            <option value="year">過去1年</option>
            <option value="all">全期間</option>
          </select>
          <select
            className="rounded-md border-gray-300 text-sm"
            value={selectedPresetId}
            onChange={(e) => setSelectedPresetId(e.target.value)}
          >
            {presets.map(preset => (
              <option key={preset.presetId} value={preset.presetId}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-medium text-gray-900">最大重量の推移</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="maxWeight"
                  name="最大重量"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="avgWeight"
                  name="平均重量"
                  stroke="#7c3aed"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-medium text-gray-900">総回数の推移</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalReps"
                  name="総回数"
                  stroke="#059669"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
} 