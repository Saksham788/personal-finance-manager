import React, { useEffect, useState } from 'react';
import API from '../services/api';
import AddTransaction from '../components/AddTransaction';
import TxList from '../components/TxList';
import SummaryChart from '../components/SummaryChart';
import jsPDF from 'jspdf';

export default function Dashboard() {
  const [tx, setTx] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  // ✅ Apply theme on mount or toggle
  useEffect(() => {
    document.body.classList.toggle("dark-mode", dark);
  }, [dark]);

  // ✅ Load Transactions
  async function load() {
    setLoading(true);
    try {
      const res = await API.get("/transactions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTx(res.data);
    } catch (err) {
      console.error("Load Error:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  // ✅ Export transactions to PDF
  function exportPDF() {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("💰 Monthly Finance Report", 14, 20);

    let y = 30;
    tx.forEach((t, i) => {
      doc.setFontSize(11);
      doc.text(
        `${i + 1}. ${t.type.toUpperCase()} - ₹${t.amount} - ${
          t.category
        } - ${new Date(t.date).toLocaleDateString()}`,
        14,
        y
      );
      y += 7;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("finance-report.pdf");
  }

  // ✅ Toggle Theme
  function toggleTheme() {
    const newTheme = !dark;
    setDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  }

  // ✅ Logout
  function logout() {
    localStorage.clear();
    window.location.href = "/login";
  }

  return (
    <div style={{ padding: 20 }}>
      {/* Top Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ color: dark ? "#fff" : "#111" }}>
          Welcome, {localStorage.getItem("userName") || "User"} 👋
        </h1>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={toggleTheme}>
            {dark ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
          <button onClick={exportPDF}>📄 Export PDF</button>
          <button onClick={logout}>🚪 Logout</button>
        </div>
      </div>

      {/* Add Transaction Form */}
      <AddTransaction onAdded={load} />

      {/* Chart + Transaction List */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: "20px",
          alignItems: "flex-start",
        }}
      >
        <SummaryChart transactions={tx} />
        <TxList transactions={tx} onChanged={load} />
      </div>

      {/* Loading indicator */}
      {loading && <p style={{ marginTop: "20px" }}>Loading transactions...</p>}
    </div>
  );
}
