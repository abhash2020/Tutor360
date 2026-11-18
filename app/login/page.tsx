
"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();

  const role = params.get("role") === "tutor"
    ? "tutor"
    : "parent";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile || profile.role !== role) {
      await supabase.auth.signOut();
      setMessage(
        "This account does not belong to the selected portal."
      );
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="authPage">
      <div className="authCard">
        <Link href="/" className="backLink">← Back to Home</Link>

        <div className="loginIcon">
          {role === "tutor" ? "👨‍🏫" : "👨‍👩‍👧"}
        </div>

        <h1>{role === "tutor" ? "Tutor Login" : "Parents Login"}</h1>
        <p className="muted">Welcome back to Tutor360</p>

        <div className="roleSwitch">
          <Link
            href="/login?role=tutor"
            className={role === "tutor" ? "selected" : ""}
          >
            Tutor
          </Link>
          <Link
            href="/login?role=parent"
            className={role === "parent" ? "selected" : ""}
          >
            Parent
          </Link>
        </div>

        <form onSubmit={login}>
          <label className="field">
            <span>Email Address</span>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </label>

          <button
            className="btn primary full"
            disabled={loading}
            type="submit"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {message && <p className="formMessage">{message}</p>}

        <p className="authBottom">
          Don't have an account?{" "}
          <Link href={`/register?role=${role}`}>Register Now</Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <LoginForm />
    </Suspense>
  );
}
