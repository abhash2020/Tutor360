
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type Profile = {
  role: "tutor" | "parent";
  details: Record<string, string>;
};

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("role, details")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        router.replace("/");
        return;
      }

      setProfile(data as Profile);
      setLoading(false);
    }

    load();
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return <main className="loading">Loading dashboard...</main>;
  }

  if (!profile) return null;

  const name = profile.role === "tutor"
    ? profile.details.name
    : profile.details.student_name;

  return (
    <main className="dashboardPage">
      <header className="navbar">
        <Link href="/" className="logo">
          <span className="logoIcon">T</span>
          Tutor<span>360</span>
        </Link>
        <button className="btn outline" onClick={logout}>
          Logout
        </button>
      </header>

      <section className="dashboardContent">
        <div className="dashboardWelcome">
          <p className="eyebrow">My Account</p>
          <h1>Welcome, {name || "Member"}!</h1>
          <p>
            {profile.role === "tutor"
              ? "Tutor Dashboard"
              : "Parents Dashboard"}
          </p>
        </div>

        <div className="dashboardCard">
          <h2>Registration Details</h2>
          <p className="muted">
            Your submitted Tutor360 profile information.
          </p>

          <div className="detailsGrid">
            {Object.entries(profile.details)
              .filter(([key]) => key !== "password")
              .map(([key, value]) => (
                <div className="detailItem" key={key}>
                  <span>
                    {key.replace(/_/g, " ").replace(
                      /\b\w/g,
                      char => char.toUpperCase()
                    )}
                  </span>
                  <strong>{String(value)}</strong>
                </div>
              ))}
          </div>
        </div>

        <div className="dashboardCard">
          <h2>Need Assistance?</h2>
          <p>Contact the Tutor360 support team.</p>
          <a className="btn primary" href="tel:8004702020">
            Call 8004702020
          </a>
        </div>
      </section>
    </main>
  );
}
