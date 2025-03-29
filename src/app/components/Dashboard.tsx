"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import useSWR from "swr";
import {
  AlertCircle,
  BarChart3,
  Bell,
  Calendar,
  Filter,
  Home,
  MapPin,
  Menu,
  MessageSquare,
  Search,
  Settings,
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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  // Always call SWR hook unconditionally
  const { data, error } = useSWR("/api/disaster", fetcher);

  // Use default empty arrays if data isn't loaded yet
  const earthquakeData = data?.earthquake || [];
  const newsData = data?.news || [];

  // Compute dynamic stats
  const activeIncidents = earthquakeData.length;
  const affectedAreas = new Set(earthquakeData.map((eq: any) => eq.place)).size;
  const socialReports = 0; // Update if you have social data
  const newsSources = new Set(
    newsData.map((n: any) => {
      try {
        return new URL(n.url).hostname;
      } catch {
        return "";
      }
    })
  ).size;

  // Combine earthquake and news incidents into one array
  const incidents = useMemo(() => {
    const eqIncidents = earthquakeData.map((eq: any) => ({
      type: "earthquake",
      id: eq.id,
      title: `Magnitude ${eq.magnitude} - ${eq.place}`,
      time: eq.time,
      link: `https://earthquake.usgs.gov/earthquakes/eventpage/${eq.id}`,
      description: `Occurred at ${new Date(eq.time).toLocaleString()}`,
    }));

    const newsIncidents = newsData.map((news: any) => ({
      type: "news",
      id: news.url,
      title: news.title,
      time: new Date(news.publishedAt).getTime(),
      link: news.url,
      description: news.description,
      source: (() => {
        try {
          return new URL(news.url).hostname;
        } catch {
          return "";
        }
      })(),
    }));

    return [...eqIncidents, ...newsIncidents].sort((a, b) => b.time - a.time);
  }, [earthquakeData, newsData]);

  useEffect(() => {
    console.log("Fetched dashboard data:", data);
  }, [data]);

  // Render loading UI if data is not available
  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Failed to load data.</p>
      </div>
    );

  if (!data)
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );

  // Filter incidents for tabs
  const allIncidents = incidents;
  const newsIncidents = incidents.filter((i) => i.type === "news");
  const earthquakeIncidents = incidents.filter((i) => i.type === "earthquake");

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header with responsive sidebar trigger */}
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
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-red-600"
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link href="#" className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>Map View</span>
              </Link>
              <Link href="#" className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <span>Alerts</span>
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
                placeholder="Search incidents..."
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

      {/* Main layout with sidebar and content */}
      <div className="grid flex-1 md:grid-cols-[220px_1fr]">
        {/* Sidebar for desktop */}
        <aside className="hidden border-r bg-background md:block">
          <nav className="grid gap-2 p-4 text-sm font-medium">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-red-600 dark:bg-gray-800"
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-red-600 dark:text-gray-400 dark:hover:text-red-600"
            >
              <MapPin className="h-5 w-5" />
              <span>Map View</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-red-600 dark:text-gray-400 dark:hover:text-red-600"
            >
              <Bell className="h-5 w-5" />
              <span>Alerts</span>
              <Badge className="ml-auto bg-red-600 hover:bg-red-700">5</Badge>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-red-600 dark:text-gray-400 dark:hover:text-red-600"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Messages</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-red-600 dark:text-gray-400 dark:hover:text-red-600"
            >
              <Calendar className="h-5 w-5" />
              <span>Calendar</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-red-600 dark:text-gray-400 dark:hover:text-red-600"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center gap-4">
            <h1 className="flex-1 text-lg font-semibold md:text-2xl">
              Dashboard
            </h1>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select disaster type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Disasters</SelectItem>
                  <SelectItem value="flood">Floods</SelectItem>
                  <SelectItem value="fire">Wildfires</SelectItem>
                  <SelectItem value="earthquake">Earthquakes</SelectItem>
                  <SelectItem value="hurricane">Hurricanes</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" className="gap-1">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Incidents
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeIncidents}</div>
                <p className="text-xs text-muted-foreground">
                  {activeIncidents > 0
                    ? `+${activeIncidents} from last hour`
                    : ""}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Affected Areas
                </CardTitle>
                <MapPin className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{affectedAreas}</div>
                <p className="text-xs text-muted-foreground">
                  {affectedAreas > 0 ? `+${affectedAreas} new` : ""}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Social Media Reports
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{socialReports}</div>
                <p className="text-xs text-muted-foreground">
                  {socialReports > 0 ? `+${socialReports} from last hour` : ""}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  News Sources
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{newsSources}</div>
                <p className="text-xs text-muted-foreground">
                  {newsSources > 0 ? `+${newsSources} updated` : ""}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Combined Map and Recent Incidents */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Disaster Map Overview */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Disaster Map Overview</CardTitle>
                <CardDescription>
                  Real-time visualization of active incidents.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] rounded-md border bg-gray-100 dark:bg-gray-800 relative">
                  {/* Replace the placeholder with your map component if available */}
                  <img
                    src="/placeholder.svg?height=400&width=800"
                    alt="Map visualization"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white dark:bg-gray-950 p-2 rounded-md shadow-md">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="h-3 w-3 rounded-full bg-red-500"></span>
                      <span>Severe</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="h-3 w-3 rounded-full bg-orange-500"></span>
                      <span>Moderate</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                      <span>Minor</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Incidents Feed */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Incidents</CardTitle>
                <CardDescription>Latest reported disasters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {incidents.slice(0, 5).map((incident) => (
                    <div
                      key={incident.id}
                      className="flex items-start gap-4 rounded-md border p-4"
                    >
                      <div className="rounded-md bg-red-100 p-2 dark:bg-red-900">
                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {incident.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {incident.type === "news"
                            ? `${incident.source} - ${new Date(
                                incident.time
                              ).toLocaleString()}`
                            : incident.description}
                        </p>
                        <Badge className="bg-red-600 hover:bg-red-700">
                          {incident.type === "news" ? "News" : "Incident"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Incidents
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Tabs for Incident Feeds */}
          <div>
            <Tabs defaultValue="all" className="w-full">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">All Sources</TabsTrigger>
                  <TabsTrigger value="news">News</TabsTrigger>
                  <TabsTrigger value="earthquake">Earthquakes</TabsTrigger>
                </TabsList>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
              <TabsContent value="all" className="border-none p-0 pt-4">
                {allIncidents.length > 0 ? (
                  allIncidents.map((incident) => (
                    <div
                      key={incident.id}
                      className="flex items-start gap-4 rounded-md border p-4 mb-2"
                    >
                      <div className="rounded-md bg-red-100 p-2 dark:bg-red-900">
                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <Link
                          href={incident.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg text-blue-600 hover:underline"
                        >
                          {incident.title}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {incident.type === "news"
                            ? `${incident.source} - ${new Date(
                                incident.time
                              ).toLocaleString()}`
                            : incident.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-center">No incidents available.</p>
                )}
              </TabsContent>
              <TabsContent value="news" className="border-none p-0 pt-4">
                {newsIncidents.length > 0 ? (
                  newsIncidents.map((incident) => (
                    <div
                      key={incident.id}
                      className="flex items-start gap-4 rounded-md border p-4 mb-2"
                    >
                      <div className="rounded-md bg-red-100 p-2 dark:bg-red-900">
                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <Link
                          href={incident.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg text-blue-600 hover:underline"
                        >
                          {incident.title}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {incident.source} -{" "}
                          {new Date(incident.time).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-center">
                    No news incidents available.
                  </p>
                )}
              </TabsContent>
              <TabsContent value="earthquake" className="border-none p-0 pt-4">
                {earthquakeIncidents.length > 0 ? (
                  earthquakeIncidents.map((incident) => (
                    <div
                      key={incident.id}
                      className="flex items-start gap-4 rounded-md border p-4 mb-2"
                    >
                      <div className="rounded-md bg-red-100 p-2 dark:bg-red-900">
                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <Link
                          href={incident.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg text-blue-600 hover:underline"
                        >
                          {incident.title}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {incident.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-center">
                    No earthquake incidents available.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
