"use client";

import useSWR from "swr";
import { Container, Typography } from "@mui/material";
import NewsList from "@/app/components/NewsList";
import MapComponent from "./components/MapComponents";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DisasterMapPage() {
  const { data, error } = useSWR("/api/disaster", fetcher, {
    refreshInterval: 300000,
  });

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Disaster Map
      </Typography>
      <MapComponent earthquakes={data.earthquake} />
      <Link href={"api/disaster/latest-news"}>
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Latest News
        </Typography>
      </Link>
      <NewsList news={data.news} />
    </Container>
  );
}
