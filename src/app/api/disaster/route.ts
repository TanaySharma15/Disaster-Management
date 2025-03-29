import axios from "axios";
import { NextResponse } from "next/server";

function format_time(s: any) {
  let newTime = new Date(1549312452 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  return newTime;
}

export async function GET() {
  try {
    const response = await axios.get(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
      // { cache: "no-store" }
    );
    const data = await response.data;
    const earthquake = data.features.map((feature: any) => ({
      id: feature.id,
      category: "Earthquake",
      // properties: feature.properties,
      magnitude: feature.properties.mag,
      place: feature.properties.place,
      time: format_time(feature.properties.time),
      coordinates: feature.geometry.coordinates,
    }));
    //   console.log(earthquake);
    return NextResponse.json({ earthquake });
  } catch (error) {
    console.log("Error fetching data", error);
    return NextResponse.json("Failed to fetch data", { status: 500 });
  }
}
