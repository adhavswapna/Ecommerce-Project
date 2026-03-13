import api from "./apiClient";

export async function getMe() {
  const { data } = await api.get("/auth/me"); // calls auth-service
  return data; // { id, name, email, role, ... }
}
