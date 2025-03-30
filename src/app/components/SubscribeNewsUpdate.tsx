"use client";

import { useState, useEffect, useRef } from "react";
import { Button, TextField, Typography } from "@mui/material";

interface SubscribeNewsUpdatesProps {
  latestNews: any[];
}

export default function SubscribeNewsUpdates({
  latestNews,
}: SubscribeNewsUpdatesProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [welcomeStatus, setWelcomeStatus] = useState("");
  const prevNewsRef = useRef(latestNews);

  useEffect(() => {
    const storedEmail = localStorage.getItem("subscribedEmail");
    if (storedEmail) {
      setEmail(storedEmail);
      setSubscribed(true);
    }
  }, []);

  const handleSubscribe = () => {
    localStorage.setItem("subscribedEmail", email);
    setSubscribed(true);
    fetch("/api/send-welcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => {
        setWelcomeStatus(data.message || "Welcome email sent!");
      })
      .catch((err) => {
        console.error("Error sending welcome email:", err);
        setWelcomeStatus("Failed to send welcome email.");
      });
  };

  useEffect(() => {
    if (!subscribed) return;

    const prevNews = prevNewsRef.current;
    if (
      latestNews.length > 0 &&
      (prevNews.length === 0 || latestNews[0].id !== prevNews[0].id)
    ) {
      fetch("/api/send-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: [email] }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("News update email sent:", data);
        })
        .catch((err) => {
          console.error("Error sending news update email:", err);
        });
    }
    prevNewsRef.current = latestNews;
  }, [latestNews, subscribed, email]);

  if (!subscribed) {
    return (
      <div style={{ marginTop: "20px" }}>
        <Typography variant="h1">Subscribe for News Updates</Typography>
        <TextField
          type="email"
          label="Enter your email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginRight: "10px", marginTop: "10px" }}
        />
        <Button variant="contained" color="primary" onClick={handleSubscribe}>
          Subscribe
        </Button>
        {welcomeStatus && (
          <Typography variant="body1" style={{ marginTop: "10px" }}>
            {welcomeStatus}
          </Typography>
        )}
      </div>
    );
  }

  return (
    <div className="mt-10 border-2 p-2">
      <h3 className="text-xl font-bold">Subscribed for updates on: {email}</h3>
    </div>
  );
}
