"use client";

import { List, ListItem, ListItemText } from "@mui/material";

export default function NewsList({ news }: any) {
  const truncateText = (text: string, length: number = 30) =>
    text.length > length ? text.substring(0, length) + "..." : text;

  return (
    <List>
      {news.map((article: any, index: number) => (
        <ListItem key={index}>
          <ListItemText
            primary={
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                Link to BBC - {truncateText(article.url, 40)}
              </a>
            }
            secondary={`${article.category} - ${article.description}`}
          />
        </ListItem>
      ))}
    </List>
  );
}
