"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Loader2, TrendingUp, Users, Target, Activity } from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    fetch(`${apiUrl}/api/v1/analytics/dashboard`)
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "success") {
          setData(json.data);
        }
      })
      .catch((err) => console.error("Error fetching analytics:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Failed to load analytics data.</p>
      </div>
    );
  }

  const sentimentData = [
    { name: "Positive", value: data.sentiment.positive, color: "#10b981" },
    { name: "Neutral", value: data.sentiment.neutral, color: "#9ca3af" },
    { name: "Negative", value: data.sentiment.negative, color: "#ef4444" },
  ];

  const funnelData = [
    { name: "Hot", count: data.lead_funnel.hot, fill: "#ef4444" },
    { name: "Warm", count: data.lead_funnel.warm, fill: "#f59e0b" },
    { name: "Cold", count: data.lead_funnel.cold, fill: "#3b82f6" },
  ];

  const objData = data.top_objections.map((o: any) => ({
    name: o.objection,
    count: o.count,
  }));

  const langData = data.language_distribution.map((l: any) => ({
    name: l.language,
    count: l.count,
  }));

  return (
    <div className="p-8 pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Business Intelligence
        </h1>
        <p className="text-muted-foreground mt-1">
          AI-driven insights into your calling campaigns.
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2 space-y-0">
            <h3 className="tracking-tight text-sm font-medium">Total Calls</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{data.total_calls}</div>
          <p className="text-xs text-muted-foreground mt-1">
            +12% from last week
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2 space-y-0">
            <h3 className="tracking-tight text-sm font-medium">
              Average Lead Score
            </h3>
            <Target className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{data.average_lead_score}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Out of 100
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2 space-y-0">
            <h3 className="tracking-tight text-sm font-medium">
              Hot Leads
            </h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{data.lead_funnel.hot}</div>
          <p className="text-xs text-muted-foreground mt-1">
            High intent identified
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2 space-y-0">
            <h3 className="tracking-tight text-sm font-medium">
              Conversion Rate
            </h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">14.2%</div>
          <p className="text-xs text-muted-foreground mt-1">
            Estimated based on score
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Lead Funnel */}
        <div className="rounded-xl border bg-card shadow-sm col-span-4 p-6">
          <div className="mb-4">
            <h3 className="font-semibold leading-none tracking-tight">
              Lead Funnel
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Distribution of lead temperature.
            </p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "var(--muted)" }}
                  contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--background)" }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="rounded-xl border bg-card shadow-sm col-span-3 p-6">
          <div className="mb-4">
            <h3 className="font-semibold leading-none tracking-tight">
              Customer Sentiment
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Overall tone detected during calls.
            </p>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--background)" }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Objections */}
        <div className="rounded-xl border bg-card shadow-sm p-6">
          <div className="mb-4">
            <h3 className="font-semibold leading-none tracking-tight">
              Top Customer Objections
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Most frequent reasons for pushback.
            </p>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={objData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={100} />
                <Tooltip
                  cursor={{ fill: "var(--muted)" }}
                  contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--background)" }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Language Distribution */}
        <div className="rounded-xl border bg-card shadow-sm p-6">
          <div className="mb-4">
            <h3 className="font-semibold leading-none tracking-tight">
              Language Distribution
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Calls by primary language spoken.
            </p>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={langData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "var(--muted)" }}
                  contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--background)" }}
                />
                <Bar dataKey="count" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
