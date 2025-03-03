import { HashRouter as Router, Routes, Route } from "react-router-dom";
import OrdersPage from "../src/pages/OrdersPage";
import OrderDetailPage from "../src/pages/OrderDetailPage";
import "../src/index.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
      </Routes>
    </Router>
  );
}
