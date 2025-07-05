"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Moon, Sun, Download, Play, Square, ExternalLink, Target, Heart, Star } from "lucide-react"
import { useTheme } from "next-themes"

interface Config {
  names: number
  length: number
  method:
    | "random"
    | "pronounceable"
    | "letters_only"
    | "letters_underline"
    | "numbers_underline"
    | "letters_numbers_underline"
    | "numbers_letters"
  delay: number
  birthday: string
}

interface UsernameResult {
  username: string
  status: "valid" | "taken" | "error"
  timestamp: Date
}

export default function RbxNameSniper() {
  const { theme, setTheme } = useTheme()
  const [config, setConfig] = useState<Config>({
    names: 10,
    length: 5,
    method: "random",
    delay: 0.5,
    birthday: "1999-04-20",
  })

  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<UsernameResult[]>([])
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const abortControllerRef = useRef<AbortController | null>(null)

  const addLog = useCallback((message: string, type: "info" | "success" | "error" = "info") => {
    const timestamp = new Date().toLocaleTimeString()
    const prefix = type === "success" ? "✓" : type === "error" ? "✗" : "•"
    setLogs((prev) => [...prev, `[${timestamp}] ${prefix} ${message}`])
  }, [])

  const makeUsername = (config: Config): string => {
    const { length, method } = config

    if (method === "pronounceable") {
      const vowels = "aeiou"
      const consonants = "bcdfghjklmnpqrstvwxyz"
      let username = ""
      for (let i = 0; i < length; i++) {
        if (i % 2 === 0) {
          username += consonants[Math.floor(Math.random() * consonants.length)]
        } else {
          username += vowels[Math.floor(Math.random() * vowels.length)]
        }
      }
      return username
    } else if (method === "letters_only") {
      const letters = "abcdefghijklmnopqrstuvwxyz"
      return Array.from({ length }, () => letters[Math.floor(Math.random() * letters.length)]).join("")
    } else if (method === "letters_underline") {
      if (length < 3) {
        const letters = "abcdefghijklmnopqrstuvwxyz"
        return Array.from({ length }, () => letters[Math.floor(Math.random() * letters.length)]).join("")
      }
      const letters = "abcdefghijklmnopqrstuvwxyz"
      let username = ""
      for (let i = 0; i < length; i++) {
        username += letters[Math.floor(Math.random() * letters.length)]
      }
      const underscorePosition = Math.floor(Math.random() * (length - 2)) + 1
      username = username.slice(0, underscorePosition) + "_" + username.slice(underscorePosition)
      return username
    } else if (method === "numbers_underline") {
      if (length < 3) {
        const numbers = "0123456789"
        return Array.from({ length }, () => numbers[Math.floor(Math.random() * numbers.length)]).join("")
      }
      const numbers = "0123456789"
      let username = ""
      for (let i = 0; i < length; i++) {
        username += numbers[Math.floor(Math.random() * numbers.length)]
      }
      const underscorePosition = Math.floor(Math.random() * (length - 2)) + 1
      username = username.slice(0, underscorePosition) + "_" + username.slice(underscorePosition)
      return username
    } else if (method === "letters_numbers_underline") {
      if (length < 3) {
        const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
        return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
      }
      const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
      let username = ""
      for (let i = 0; i < length; i++) {
        username += chars[Math.floor(Math.random() * chars.length)]
      }
      const underscorePosition = Math.floor(Math.random() * (length - 2)) + 1
      username = username.slice(0, underscorePosition) + "_" + username.slice(underscorePosition)
      return username
    } else if (method === "numbers_letters") {
      const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
      return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
    } else {
      const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
      return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
    }
  }

  const checkUsername = async (username: string, config: Config, signal: AbortSignal): Promise<number | null> => {
    try {
      const url = `/api/validate?username=${encodeURIComponent(
        username,
      )}&birthday=${encodeURIComponent(config.birthday)}`
      const response = await fetch(url, { signal })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json()
      return data.code
    } catch (error: any) {
      if (error.name === "AbortError") throw error
      console.error("Error checking username:", error)
      return null
    }
  }

  const startGeneration = async () => {
    setIsRunning(true)
    setResults([])
    setLogs([])
    setProgress(0)

    const controller = new AbortController()
    abortControllerRef.current = controller

    addLog(`Starting generation with ${config.names} target usernames`, "info")
    addLog(`Username length: ${config.length}, Method: ${config.method}`, "info")

    let found = 0
    let attempts = 0

    try {
      while (found < config.names && !controller.signal.aborted) {
        const username = makeUsername(config)
        attempts++

        try {
          const code = await checkUsername(username, config, controller.signal)

          if (code === 0) {
            found++
            const result: UsernameResult = {
              username,
              status: "valid",
              timestamp: new Date(),
            }
            setResults((prev) => [...prev, result])
            addLog(`[${found}/${config.names}] ✓ Found: ${username}`, "success")
          } else if (code !== null) {
            const result: UsernameResult = {
              username,
              status: "taken",
              timestamp: new Date(),
            }
            setResults((prev) => [...prev, result])
            addLog(`✗ ${username} is taken`, "error")
          } else {
            addLog(`⚠ Error checking ${username}`, "error")
          }

          setProgress((found / config.names) * 100)

          await new Promise((resolve) => setTimeout(resolve, config.delay * 1000))
        } catch (error: any) {
          if (error.name === "AbortError") {
            break
          }
          addLog(`Error with ${username}: ${error.message}`, "error")
        }
      }
    } catch (error) {
      addLog("Generation stopped", "info")
    }

    setIsRunning(false)
    addLog(`Generation complete! Found ${found} valid usernames out of ${attempts} attempts`, "success")
  }

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setIsRunning(false)
    addLog("Generation stopped by user", "info")
  }

  const downloadResults = () => {
    const validUsernames = results.filter((r) => r.status === "valid").map((r) => r.username)
    const content = validUsernames.join("\n")
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "valid_usernames.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const validCount = results.filter((r) => r.status === "valid").length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">rbx name sniper</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
              <Moon className="h-4 w-4" />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Configuration Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Set up your username generation parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="names">Target Usernames</Label>
                  <Input
                    id="names"
                    type="number"
                    min="1"
                    max="1000"
                    value={config.names}
                    onChange={(e) => setConfig((prev) => ({ ...prev, names: Number.parseInt(e.target.value) || 10 }))}
                    disabled={isRunning}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="length">Username Length</Label>
                  <Input
                    id="length"
                    type="number"
                    min="3"
                    max="20"
                    value={config.length}
                    onChange={(e) => setConfig((prev) => ({ ...prev, length: Number.parseInt(e.target.value) || 5 }))}
                    disabled={isRunning}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="method">Generation Method</Label>
                <Select
                  value={config.method}
                  onValueChange={(value: any) => setConfig((prev) => ({ ...prev, method: value }))}
                  disabled={isRunning}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="random">Random (letters + numbers)</SelectItem>
                    <SelectItem value="pronounceable">Pronounceable names</SelectItem>
                    <SelectItem value="letters_only">Letters only</SelectItem>
                    <SelectItem value="letters_underline">Letters + underline</SelectItem>
                    <SelectItem value="numbers_underline">Numbers + underline</SelectItem>
                    <SelectItem value="letters_numbers_underline">Letters + numbers + underline</SelectItem>
                    <SelectItem value="numbers_letters">Numbers + letters</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="delay">Request Delay (seconds)</Label>
                <Input
                  id="delay"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={config.delay}
                  onChange={(e) => setConfig((prev) => ({ ...prev, delay: Number.parseFloat(e.target.value) || 0.5 }))}
                  disabled={isRunning}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthday">Birthday (YYYY-MM-DD)</Label>
                <Input
                  id="birthday"
                  type="date"
                  value={config.birthday}
                  onChange={(e) => setConfig((prev) => ({ ...prev, birthday: e.target.value }))}
                  disabled={isRunning}
                />
              </div>

              <div className="flex gap-2">
                {!isRunning ? (
                  <Button onClick={startGeneration} className="flex-1">
                    <Play className="h-4 w-4 mr-2" />
                    Start Generation
                  </Button>
                ) : (
                  <Button onClick={stopGeneration} variant="destructive" className="flex-1">
                    <Square className="h-4 w-4 mr-2" />
                    Stop Generation
                  </Button>
                )}

                {validCount > 0 && !isRunning && (
                  <Button onClick={downloadResults} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download ({validCount})
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Results
                <div className="flex gap-2">
                  <Badge variant="secondary">{validCount} Valid</Badge>
                  <Badge variant="outline">{results.length - validCount} Taken</Badge>
                </div>
              </CardTitle>
              <CardDescription>
                {isRunning ? "Generation in progress..." : "Username generation results"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isRunning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              <div className="space-y-2">
                <Label>Activity Log</Label>
                <div className="h-64 overflow-y-auto border rounded-md p-3 bg-muted/50">
                  {logs.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No activity yet...</p>
                  ) : (
                    <div className="space-y-1">
                      {logs.map((log, index) => (
                        <div key={index} className="text-xs font-mono">
                          {log}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {results.length > 0 && (
                <div className="space-y-2">
                  <Label>Valid Usernames Found</Label>
                  <div className="h-32 overflow-y-auto border rounded-md p-3">
                    {results.filter((r) => r.status === "valid").length === 0 ? (
                      <p className="text-muted-foreground text-sm">No valid usernames found yet...</p>
                    ) : (
                      <div className="space-y-1">
                        {results
                          .filter((r) => r.status === "valid")
                          .map((result, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span className="font-mono">{result.username}</span>
                              <Badge variant="secondary" className="text-xs">
                                Valid
                              </Badge>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Support Section */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-semibold">Support the Developer</h3>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                If this tool helped you find great usernames, consider supporting the development! Your support helps
                keep this project free and continuously improved.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild variant="default">
                  <a
                    href="https://github.com/4b1ss4l/rbxusersniper"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Star on GitHub
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a
                    href="https://www.roblox.com/catalog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Roblox Store
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
