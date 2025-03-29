import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET() {
  try {
    const response = await fetch("https://www.bbc.com/news", {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch BBC News");
    const html = await response.text();
    const $ = cheerio.load(html);

    const articles: any[] = [];
    $("article").each((i, element) => {
      const title =
        $(element).find("h2").text().trim() ||
        $(element).find('[data-testid="card-headline"]').text().trim();
      const link = $(element).find("a").attr("href");
      const description = $(element).find("p").text().trim();

      if (title && link) {
        const fullLink = link.startsWith("http")
          ? link
          : `https://www.bbc.com${link}`;
        articles.push({
          title,
          description: description || "No description available",
          url: fullLink,
          scrapedAt: new Date().toISOString(),
        });
      }
    });

    const disasterKeywords = [
      "earthquake",
      "flood",
      "hurricane",
      "wildfire",
      "disaster",
      "storm",
    ];
    const filteredArticles = articles
      .filter((article) =>
        disasterKeywords.some(
          (keyword) =>
            article.title.toLowerCase().includes(keyword) ||
            article.description.toLowerCase().includes(keyword)
        )
      )
      .slice(0, 10);

    return NextResponse.json({ latestNews: filteredArticles });
  } catch (error) {
    console.error("Error scraping news:", error);
    return NextResponse.json(
      { error: "Failed to scrape news" },
      { status: 500 }
    );
  }
}
