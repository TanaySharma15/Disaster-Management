"use client";

import { useState } from "react";
import useSWR from "swr";
import { Container, Typography } from "@mui/material";
import NewsList from "@/app/components/NewsList";
import SubscribeNewsUpdates from "@/app/components/SubscribeNewsUpdate";
import LanguageSelector from "@/app/components/LanguageSelector";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function NewsPage() {
  const [language, setLanguage] = useState("en");

  const { data, error } = useSWR(`/api/disaster?lang=${language}`, fetcher, {
    refreshInterval: 300000,
  });

  if (error) return <div>Failed to load news</div>;
  if (!data) return <div>Loading news...</div>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Latest News
      </Typography>
      <LanguageSelector onLanguageChange={(lang) => setLanguage(lang)} />
      <NewsList news={data.news} />
      <SubscribeNewsUpdates latestNews={data.news} />
    </Container>
  );
}
