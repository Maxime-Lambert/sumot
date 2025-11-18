import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useEffect, useState } from "react";
import {
  getSumotStats,
  type GetSumotStatsResponse,
} from "@/api/sumots/getSumotStats/getSumotStats";

export interface SumotStatsMerged {
  date: string;
  mobileVisits: number;
  webVisits: number;
  mobileAttempts: number;
  webAttempts: number;
  mobileFinishes: number;
  webFinishes: number;
}

export default function StatsPage() {
  const [data, setData] = useState<GetSumotStatsResponse[]>([]);
  const [showMobile, setShowMobile] = useState(true);
  const [showWeb, setShowWeb] = useState(true);
  const [showVisits, setShowVisits] = useState(true);
  const [showAttempts, setShowAttempts] = useState(false);
  const [showFinishes, setShowFinishes] = useState(false);

  useEffect(() => {
    async function load() {
      const stats = await getSumotStats();
      setData(stats);
    }
    load();
  }, []);

  const mergedMap: Record<string, SumotStatsMerged> = data.reduce((acc, s) => {
    if (!acc[s.date]) {
      acc[s.date] = {
        date: s.date,
        mobileVisits: 0,
        webVisits: 0,
        mobileAttempts: 0,
        webAttempts: 0,
        mobileFinishes: 0,
        webFinishes: 0,
      };
    }

    if (s.isMobile) {
      acc[s.date].mobileVisits += s.visits;
      acc[s.date].mobileAttempts += s.attempts;
      acc[s.date].mobileFinishes += s.finishes;
    } else {
      acc[s.date].webVisits += s.visits;
      acc[s.date].webAttempts += s.attempts;
      acc[s.date].webFinishes += s.finishes;
    }

    return acc;
  }, {} as Record<string, SumotStatsMerged>);

  const merged = Object.values(mergedMap);

  return (
    <div className="p-4 w-full h-[400px]">
      <div className="flex mx:auto gap-4 mb-2 text-white">
        <label>
          <input
            type="checkbox"
            checked={showMobile}
            onChange={() => setShowMobile((v) => !v)}
          />{" "}
          Données mobiles
        </label>

        <label>
          <input
            type="checkbox"
            checked={showWeb}
            onChange={() => setShowWeb((v) => !v)}
          />{" "}
          Données web
        </label>

        <label>
          <input
            type="checkbox"
            checked={showVisits}
            onChange={() => setShowVisits((v) => !v)}
          />{" "}
          Données visiteurs
        </label>

        <label>
          <input
            type="checkbox"
            checked={showAttempts}
            onChange={() => setShowAttempts((v) => !v)}
          />{" "}
          Données mots commencés
        </label>

        <label>
          <input
            type="checkbox"
            checked={showFinishes}
            onChange={() => setShowFinishes((v) => !v)}
          />{" "}
          Données mots finis
        </label>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={merged}>
          <XAxis dataKey="date" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
          />
          <Legend
            wrapperStyle={{ color: "#fff" }}
            formatter={(value) => {
              switch (value) {
                case "mobileVisits":
                  return "Visiteurs Mobiles";
                case "webVisits":
                  return "Visiteurs Web";
                default:
                  return value;
              }
            }}
          />
          {showMobile && showVisits && (
            <Line
              type="monotone"
              dataKey="mobileVisits"
              stroke="#FF6B6B"
              name="Visiteurs Mobiles"
            />
          )}

          {showWeb && showVisits && (
            <Line
              type="monotone"
              dataKey="webVisits"
              stroke="#4ECDC4"
              name="Visiteurs Web"
            />
          )}

          {showWeb && showAttempts && (
            <Line
              type="monotone"
              dataKey="webAttempts"
              stroke="#FFD93D"
              name="Mots commencés Web"
            />
          )}

          {showWeb && showFinishes && (
            <Line
              type="monotone"
              dataKey="webFinishes"
              stroke="#1E90FF"
              name="Mots finis Web"
            />
          )}

          {showWeb && showAttempts && (
            <Line
              type="monotone"
              dataKey="mobileAttempts"
              stroke="#A29BFE"
              name="Mots commencés mobile"
            />
          )}

          {showWeb && showFinishes && (
            <Line
              type="monotone"
              dataKey="mobileFinishes"
              stroke="#00E676"
              name="Mots finis mobile"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
