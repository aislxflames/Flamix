"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts"

export default function Dashboard() {
  const [cpuData, setCpuData] = useState([])
  const [ramData, setRamData] = useState([])

  // Fake live data generator (replace with API later)
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuData((prev) => {
        const newVal = Math.floor(Math.random() * 100)
        const updated = [...prev, { name: "", value: newVal }]
        return updated.slice(-20)
      })

      setRamData((prev) => {
        const newVal = Math.floor(Math.random() * 100)
        const updated = [...prev, { name: "", value: newVal }]
        return updated.slice(-20)
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">System Dashboard</h1>
      <Separator />

      {/* CPU + RAM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CPU */}
        <Card className="bg-background/70 backdrop-blur-xl border-border/40">
          <CardHeader>
            <CardTitle>CPU Usage</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cpuData}>
                <XAxis dataKey="name" hide />
                <YAxis domain={[0, 100]} hide />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--primary)"
                  fill="var(--primary)"
                  fillOpacity={0.4}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* RAM */}
        <Card className="bg-background/70 backdrop-blur-xl border-border/40">
          <CardHeader>
            <CardTitle>RAM Usage</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ramData}>
                <XAxis dataKey="name" hide />
                <YAxis domain={[0, 100]} hide />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

      {/* Disk Usage */}
      <Card className="bg-background/70 backdrop-blur-xl border-border/40">
        <CardHeader>
          <CardTitle>Disk Usage</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: "Disk A", used: 70 },
                { name: "Disk B", used: 45 },
                { name: "Disk C", used: 90 },
              ]}
            >
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="used" fill="var(--primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
