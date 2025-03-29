import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DisasterFetcher() {
  const { data, error } = useSWR("/api/disasters", fetcher, {
    refreshInterval: 300000,
  });

  return {
    earthquakes: data?.earthquakes || [],
    news: data?.news || [],
    loading: !data && !error,
    error,
  };
}
