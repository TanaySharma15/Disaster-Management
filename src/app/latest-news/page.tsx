"use client";

import useSWR from "swr";
import { Container, Typography } from "@mui/material";
import NewsList from "@/app/components/NewsList";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LatestNewsPage() {
  const { data, error } = useSWR("/api/disaster/latest-news", fetcher, {
    refreshInterval: 300000,
  });

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Web-Scraped News
      </Typography>
      <NewsList news={data.latestNews} />
    </Container>
  );
}
