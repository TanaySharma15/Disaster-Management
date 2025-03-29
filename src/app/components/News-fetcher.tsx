import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function NewsFetcher() {
  const { data, error } = useSWR("/api/disaster/latest-news", fetcher, {
    refreshInterval: 300000,
  });

  return {
    news: data?.latestNews || [],
    loading: !data && !error,
    error,
  };
}
