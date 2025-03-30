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
          // Use the current time as the scraped time.
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

    // Filter articles that mention any disaster keyword
    const filteredArticles = articles.filter((article) =>
      disasterKeywords.some(
        (keyword) =>
          article.title.toLowerCase().includes(keyword) ||
          article.description.toLowerCase().includes(keyword)
      )
    );

    // (Optional) Filter out articles older than 24 hours.
    // Since scrapedAt is current for each scrape, this is more useful if you use an article date.
    const now = Date.now();
    const recentArticles = filteredArticles.filter((article) => {
      const scrapedTime = new Date(article.scrapedAt).getTime();
      // 24 hours = 86,400,000 milliseconds
      return now - scrapedTime < 86400000;
    });

    // Return the top 3 recent articles (if available)
    const latestNews = recentArticles.slice(0, 3);

    return NextResponse.json({ latestNews });
  } catch (error) {
    console.error("Error scraping news:", error);
    return NextResponse.json(
      { error: "Failed to scrape news" },
      { status: 500 }
    );
  }
}
