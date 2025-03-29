"use client";

import { List, ListItem, ListItemText } from "@mui/material";

export default function NewsList({ news }: any) {
  return (
    <List>
      {news.map((article: any, index: number) => (
        <ListItem key={index}>
          <ListItemText
            primary={
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                {article.title}
              </a>
            }
            secondary={`${article.category} - ${article.description}`}
          />
        </ListItem>
      ))}
    </List>
  );
}
