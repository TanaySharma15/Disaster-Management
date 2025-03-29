"use client";

import useSWR from "swr";
import { Container, Typography } from "@mui/material";
import MapComponent from "./MapComponent";
import NewsList from "./NewsList";

const fetcher = (url: any) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  const { data, error } = useSWR("/api/disasters", fetcher, {
    refreshInterval: 300000,
  });

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const earthquakes = data?.earthquakes || [];
  const news = data?.news || [];
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Disaster Dashboard
      </Typography>
      <MapComponent earthquakes={earthquakes} />
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Recent News
      </Typography>
      <NewsList news={news} />
    </Container>
  );
}
