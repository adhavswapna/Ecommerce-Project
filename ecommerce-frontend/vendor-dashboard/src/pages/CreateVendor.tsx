import { useState } from "react";
import { API } from "../services/api";

export default function CreateVendor() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    userId: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await API.post("/vendors/create", form);
      alert("Vendor Created ✅");
    } catch (err) {
      console.error(err);
      alert("Error creating vendor");
    }
  };

  return (
    <div>
      <h2>Create Vendor</h2>

      <form onSubmit={submit}>
        <input placeholder="Name" onChange={(e)=>setForm({...form,name:e.target.value})} />
        <input placeholder="Email" onChange={(e)=>setForm({...form,email:e.target.value})} />
        <input placeholder="Phone" onChange={(e)=>setForm({...form,phone:e.target.value})} />
        <input placeholder="Address" onChange={(e)=>setForm({...form,address:e.target.value})} />
        <input placeholder="UserId" onChange={(e)=>setForm({...form,userId:e.target.value})} />

        <button type="submit">Create Vendor</button>
      </form>
    </div>
  );
}
