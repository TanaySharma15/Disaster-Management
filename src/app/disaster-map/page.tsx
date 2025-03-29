import { Container, Typography } from "@mui/material";
import React from "react";
import NewsFetcher from "@/app/components/News-fetcher";

export default function Page() {
  return (
    <Container>
      <Typography variant="h4">Disaster Info</Typography>
      <NewsFetcher />
    </Container>
  );
}
