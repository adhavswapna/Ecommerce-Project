import { authApi, userApi } from "./apiClient";

/* =====================================================
   👤 GET CURRENT USER (AUTH SERVICE)
===================================================== */
export async function getMe() {
  try {
    const { data } = await authApi.get("/auth/me");
    return data;
  } catch (error: any) {
    console.error("❌ getMe error:");

    if (error?.response) {
      // Backend responded (401, 404, etc.)
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else if (error?.request) {
      // Request sent but no response → NETWORK ERROR
      console.error("🚨 No response from auth-service");
      console.error("Check if auth-service is running on port 3001");
    } else {
      console.error(error.message);
    }

    return null;
  }
}

/* =====================================================
   👤 GET USER PROFILE BY ID (USER SERVICE)
===================================================== */
export async function getUserProfile(userId: string) {
  try {
    const { data } = await userApi.get(`/users/${userId}`);
    return data;
  } catch (error) {
    console.error("❌ getUserProfile error:", error);
    return null;
  }
}

/* =====================================================
   ✏️ UPDATE USER PROFILE
===================================================== */
export async function updateUserProfile(
  userId: string,
  payload: {
    name?: string;
    phone?: string;
    address?: string;
  }
) {
  try {
    const { data } = await userApi.put(`/users/${userId}`, payload);
    return data;
  } catch (error) {
    console.error("❌ updateUserProfile error:", error);
    return null;
  }
}

/* =====================================================
   📋 GET ALL USERS (ADMIN)
===================================================== */
export async function getAllUsers() {
  try {
    const { data } = await userApi.get("/users");
    return data;
  } catch (error) {
    console.error("❌ getAllUsers error:", error);
    return [];
  }
}

/* =====================================================
   ❌ DELETE USER
===================================================== */
export async function deleteUser(userId: string) {
  try {
    const { data } = await userApi.delete(`/users/${userId}`);
    return data;
  } catch (error) {
    console.error("❌ deleteUser error:", error);
    return null;
  }
}
