import { useState } from "react";
import { API } from "../services/api";

export default function BanUser() {
  const [userId, setUserId] = useState("");

  const banUser = async () => {
    try {
      await API.post("/admin/user/ban", { userId });
      alert("User Banned 🚫");
    } catch (err) {
      console.error(err);
      alert("Error banning user");
    }
  };

  return (
    <div>
      <h2>Ban User</h2>

      <input
        placeholder="User ID"
        onChange={(e) => setUserId(e.target.value)}
      />

      <button onClick={banUser}>Ban</button>
    </div>
  );
}
