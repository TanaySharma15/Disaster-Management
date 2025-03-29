"use client";

import { useEffect } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data, error } = useSWR("/api/disaster", fetcher);

  useEffect(() => {
    console.log("Fetched data:", data);
  }, [data]);

  if (error) return <p className="text-red-500">Failed to load data.</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Latest Disaster News</h1>

      {data.news?.map((item: any, index: number) => (
        <div key={index} className="mb-4 border-b pb-2">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800 font-medium text-xl"
          >
            {item.title}
          </a>
          <p className="text-sm text-green-700">{new URL(item.url).hostname}</p>
          <p className="text-gray-600">{item.description}</p>
        </div>
      ))}

      <h2 className="text-2xl font-bold mt-6">Recent Earthquakes</h2>
      {data.earthquake?.length > 0 ? (
        data.earthquake.map((quake: any) => (
          <div key={quake.id} className="mb-4 border-b pb-2">
            <p className="font-semibold">Magnitude: {quake.magnitude}</p>
            <p>Location: {quake.place}</p>
            <p>Time: {new Date(quake.time).toLocaleString()}</p>
            <a
              href={`https://earthquake.usgs.gov/earthquakes/eventpage/${quake.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              More Info
            </a>
          </div>
        ))
      ) : (
        <p>No recent earthquakes recorded.</p>
      )}
    </div>
  );
}
