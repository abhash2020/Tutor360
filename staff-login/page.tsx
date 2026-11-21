
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function StaffLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error || !data.user) {
        setMessage(error?.message || "Login failed.");
        return;
      }

      const { data: profile, error: roleError } =
        await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

      if (roleError || !profile) {
        await supabase.auth.signOut();
        setMessage("Staff profile not found.");
        return;
      }

      if (profile.role === "super_admin") {
        router.replace("/admin");
      } else if (profile.role === "team_manager") {
        router.replace("/manager");
      } else {
        await supabase.auth.signOut();
        setMessage("Staff access is not permitted.");
      }
    } catch {
      setMessage("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#eef3ff",
      padding: "20px"
    }}>
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "35px",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 10px 35px #00000015"
      }}>
        <Link href="/">← Back to Home</Link>

        <h1 style={{
          color: "#153f82",
          marginTop: "25px"
        }}>
          Tutor360 Staff Login
        </h1>

        <p>Knowledge360 Administration Portal</p>

        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email Address</label>

          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              margin: "8px 0 20px",
              border: "1px solid #bbb",
              borderRadius: "8px"
            }}
          />

          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              margin: "8px 0 20px",
              border: "1px solid #bbb",
              borderRadius: "8px"
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: "#153f82",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            {loading ? "Signing in..." : "Staff Login"}
          </button>
        </form>

        {message && (
          <p role="alert" style={{ color: "crimson" }}>
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
