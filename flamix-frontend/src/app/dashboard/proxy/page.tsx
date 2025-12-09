"use client"

import { useState } from "react"
import { installProxy, startProxy, stopProxy } from "@/utils/proxyFetch"
import { useLogs } from "@/utils/useLogs"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import LogViewer from "@/components/blocks/LogViewer"

const ProxyPage = () => {
  const logs = useLogs("proxy") // returns array of log lines
  const [loading, setLoading] = useState<string | null>(null)

  const run = async (action: "install" | "start" | "stop") => {
    setLoading(action)

    try {
      if (action === "install") await installProxy()
      if (action === "start") await startProxy()
      if (action === "stop") await stopProxy()
    } catch (e) {
      console.error(e)
    }

    setLoading(null)
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Proxy Manager</h1>
      <Separator />

      {/* Actions */}
      <Card className="bg-background/70 backdrop-blur-xl border-border/40">
        <CardHeader>
          <CardTitle>Controls</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4 flex-wrap">
          <Button
            onClick={() => run("install")}
            disabled={loading !== null}
            variant="default"
            className="bg-blue-400/90 hover:bg-blue-500/90"
          >
            {loading === "install" ? "Installing..." : "Install Proxy"}
          </Button>

          <Button
            onClick={() => run("start")}
            disabled={loading !== null}
            className="bg-green-500/90 hover:bg-green-600/90"
          >
            {loading === "start" ? "Starting..." : "Start Proxy"}
          </Button>

          <Button
            onClick={() => run("stop")}
            disabled={loading !== null}
            className="bg-red-600/90 hover:bg-red-700/90"
          >
            {loading === "stop" ? "Stopping..." : "Stop Proxy"}
          </Button>
        </CardContent>
      </Card>

      {/* Logs */}
      <Card className="bg-background/70 backdrop-blur-xl border-border/40">
        <CardHeader>
          <CardTitle>Proxy Logs</CardTitle>
        </CardHeader>

        <CardContent>
            <LogViewer channels={[`proxy`]} />

        </CardContent>
      </Card>
    </div>
  )
}

export default ProxyPage
