"use client";

import { Container, Typography } from "@mui/material";
import NewsList from "../components/NewsList";
import NewsFetcher from "../components/News-fetcher";

export default function LatestNewsPage() {
  const { news, loading, error } = NewsFetcher();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Failed to load news</div>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Latest Disaster News
      </Typography>
      <NewsList news={news} />
    </Container>
  );
}
