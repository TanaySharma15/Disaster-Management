import { Container, Typography } from "@mui/material";
import React from "react";
import NewsFetcher from "./components/News-fetcher"; // Import Client Component

export default function Page() {
  return (
    <Container>
      <Typography variant="h4">Disaster Information</Typography>
      <NewsFetcher />
    </Container>
  );
}
