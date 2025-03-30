"use client";

import useSWR from "swr";
import Link from "next/link";
import {
  AlertCircle,
  Home,
  MapPin,
  Bell,
  Menu,
  MessageSquare,
  Search,
  Settings,
  Filter,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Simple fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Helper function to truncate text to a given number of words
function truncateWords(text: string, wordLimit: number = 30): string {
  const words = text.split(" ");
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "...";
}

export default function AlertsDashboard() {
  // Fetch the latest alerts from the web scraper endpoint with auto-refresh every 30 seconds.
  const { data, error } = useSWR("/api/disaster/latest-news", fetcher, {
    refreshInterval: 30000,
  });

  const latestAlerts = data?.latestNews || [];
  const totalAlerts = latestAlerts.length;

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Failed to load alerts.</p>
      </div>
    );

  if (!data)
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading alerts...</p>
      </div>
    );

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-16 sm:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="sm:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:hidden">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <AlertCircle className="h-6 w-6 text-red-600" />
                <span>DisasterWatch</span>
              </Link>
              <Link href="/" className="flex items-center gap-2 text-red-600">
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link href="/alerts" className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <span>Alerts</span>
                <Badge className="ml-auto bg-red-600 hover:bg-red-700">
                  {totalAlerts}
                </Badge>
              </Link>
              <Link href="#" className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>Map View</span>
              </Link>
              <Link href="#" className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <span>Messages</span>
              </Link>
              <Link href="#" className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <span className="hidden md:inline">DisasterWatch</span>
          </Link>
        </div>
        <div className="flex-1">
          <form>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search alerts..."
                className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
              />
            </div>
          </form>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt="Avatar" />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Layout */}
      <div className="grid flex-1 md:grid-cols-[220px_1fr]">
        <aside className="hidden border-r bg-background md:block">
          <nav className="grid gap-2 p-4 text-sm font-medium">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-red-600 dark:bg-gray-800"
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/alerts"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-red-600 transition-all"
            >
              <Bell className="h-5 w-5" />
              <span>Alerts</span>
              <Badge className="ml-auto bg-red-600 hover:bg-red-700">
                {totalAlerts}
              </Badge>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-red-600"
            >
              <MapPin className="h-5 w-5" />
              <span>Map View</span>
            </Link>

            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-red-600"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </nav>
        </aside>

        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl">
              Alerts Dashboard
            </h1>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter alerts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Alerts</SelectItem>
                  <SelectItem value="news">News Alerts</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" className="gap-1">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Alerts
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAlerts}</div>
                <p className="text-xs text-muted-foreground">Updated live</p>
              </CardContent>
            </Card>
          </div>

          {/* Alerts Feed */}
          <Card>
            <CardHeader>
              <CardTitle>Latest Alerts</CardTitle>
              <CardDescription>
                Real-time updates from web scraping
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {latestAlerts.length > 0 ? (
                latestAlerts.map((alert: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 rounded-md border p-4"
                  >
                    <div className="rounded-md bg-red-100 p-2 dark:bg-red-900">
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Link
                        href={alert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg text-blue-600 hover:underline truncate"
                      >
                        {alert.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {truncateWords(alert.description, 30)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(alert.scrapedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-4 text-center">No alerts available.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Alerts
              </Button>
            </CardFooter>
          </Card>

          {/* Optional Tabs for different alert types */}
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
              </TabsList>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
            <TabsContent value="all" className="border-none p-0 pt-4">
              {latestAlerts.length > 0 ? (
                latestAlerts.map((alert: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 rounded-md border p-4 mb-2"
                  >
                    <div className="rounded-md bg-red-100 p-2 dark:bg-red-900">
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Link
                        href={alert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg text-blue-600 hover:underline truncate"
                      >
                        {alert.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {new Date(alert.scrapedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-4 text-center">No alerts available.</p>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
