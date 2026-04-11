import { useState } from "react";
import { API } from "../services/api";

export default function CreateAdmin() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    userId: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await API.post("/admin", form);
      alert("Admin Created ✅");
    } catch (err) {
      console.error(err);
      alert("Error creating admin");
    }
  };

  return (
    <div>
      <h2>Create Admin</h2>

      <form onSubmit={submit}>
        <input placeholder="Name" onChange={(e)=>setForm({...form,name:e.target.value})}/>
        <input placeholder="Email" onChange={(e)=>setForm({...form,email:e.target.value})}/>
        <input placeholder="Password" onChange={(e)=>setForm({...form,password:e.target.value})}/>
        <input placeholder="UserId" onChange={(e)=>setForm({...form,userId:e.target.value})}/>

        <button type="submit">Create Admin</button>
      </form>
    </div>
  );
}
