
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function StaffLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error || !data.user) {
        setErrorMessage(error?.message || "Login failed");
        return;
      }

      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        setErrorMessage("Profile not found");
        return;
      }

      if (profile.role === "super_admin") {
        router.replace("/admin");
      } else if (profile.role === "team_manager") {
        router.replace("/manager");
      } else {
        await supabase.auth.signOut();
        setErrorMessage("Staff access denied");
      }
    } catch {
      setErrorMessage("An unexpected error occurred");
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
      padding: 20
    }}>
      <div style={{
        background: "#ffffff",
        padding: 30,
        borderRadius: 15,
        width: "100%",
        maxWidth: 400
      }}>
        <h1 style={{ color: "#173f85" }}>
          Tutor360 Staff Login
        </h1>

        <p>Knowledge360 Administration</p>

        <form onSubmit={login}>
          <input
            type="email"
            placeholder="Email Address"
            aria-label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 15
            }}
          />

          <input
            type="password"
            placeholder="Password"
            aria-label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 15
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 12,
              background: "#173f85",
              color: "white",
              border: "none",
              borderRadius: 8
            }}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          {errorMessage && (
            <p role="alert" style={{ color: "red" }}>
              {errorMessage}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
