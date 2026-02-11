import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export interface User { userId: string; role: string; }

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie.includes("access_token");
    if (!token) router.replace("/login");
    else setUser({ userId: "123", role: "USER" }); 
    setLoading(false);
  }, [router]);

  return { user, loading };
}

