import Dashboard from "./pages/Dashboard";
import CreateAdmin from "./pages/CreateAdmin";
import BanUser from "./pages/BanUser";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <Dashboard />
      <hr />
      <CreateAdmin />
      <hr />
      <BanUser />
    </div>
  );
}

export default App;
