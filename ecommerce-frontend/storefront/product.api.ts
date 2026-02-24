// Example: auth.api.ts
export async function login(email: string, password: string) {
  return fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  }).then(res => res.json());
}

