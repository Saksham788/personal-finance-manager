import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    loadUser();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Profile</h1>

      {!user ? (
        <p>Loading...</p>
      ) : (
        <div style={{
          background: "var(--card-color)",
          padding: 20,
          borderRadius: 10,
          width: 350
        }}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}
    </div>
  );
}
