export async function fetcher(url: string) {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch " + url);
  return res.json();
}

