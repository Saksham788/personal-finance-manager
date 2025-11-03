import React, { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", { name, email, password });
      if (res.data.success) {
        alert("Registration successful! Please login.");
        nav("/login");
      } else {
        alert(res.data.msg || "Registration failed!");
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Error during registration");
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account 🚀</h2>
        <p style={styles.subtitle}>Join our platform and get started today!</p>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Sign Up
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    background:
      "linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Poppins', sans-serif",
  },
  card: {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(12px)",
    padding: "45px 55px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    width: "360px",
    textAlign: "center",
    color: "#fff",
  },
  title: {
    fontSize: "26px",
    fontWeight: "600",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.8)",
    marginBottom: "25px",
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    margin: "10px 0",
    borderRadius: "12px",
    border: "none",
    outline: "none",
    fontSize: "15px",
    color: "#333",
  },
  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "12px",
    background: "#fff",
    color: "#0078ff",
    fontWeight: "600",
    fontSize: "16px",
    marginTop: "15px",
    cursor: "pointer",
    transition: "0.3s",
  },
  footerText: {
    marginTop: "20px",
    fontSize: "13px",
    color: "rgba(255,255,255,0.9)",
  },
  link: {
    color: "#fff",
    fontWeight: "600",
    textDecoration: "underline",
  },
};
