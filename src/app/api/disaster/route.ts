import axios from "axios";
import { NextResponse } from "next/server";

const disasterTypes = {
  Earthquake: ["earthquake", "seismic"],
  Flood: ["flood", "inundation"],
  Hurricane: ["hurricane", "cyclone", "typhoon"],
  Wildfire: ["wildfire", "forest fire"],
};
function getCategory(text: any) {
  for (const [category, keywords] of Object.entries(disasterTypes)) {
    if (keywords.some((keyword) => text.toLowerCase().includes(keyword))) {
      return category;
    }
  }
  return "Other";
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
      time: feature.properties.time,
      coordinates: feature.geometry.coordinates,
    }));
    //   console.log(earthquake);
    const newsResponse = await fetch(
      `https://newsapi.org/v2/everything?q=disaster OR earthquake OR flood&apiKey=${process.env.NEWS_API_KEY}&language=en&pageSize=10`
      //   { cache: "no-store" }
    );
    const newsData = await newsResponse.json();
    if (!newsData.articles || !Array.isArray(newsData.articles)) {
      console.error("News API returned an invalid response:", newsData);
      return NextResponse.json(
        { error: "Failed to fetch news" },
        { status: 500 }
      );
    }
    // console.log(newsData);
    const news = newsData.articles.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      publishedAt: article.publishedAt,
      category: getCategory(article.title + " " + article.description),
    }));

    return NextResponse.json({ earthquake, news });
  } catch (error) {
    console.log("Error fetching data", error);
    return NextResponse.json("Failed to fetch data", { status: 500 });
  }
}
