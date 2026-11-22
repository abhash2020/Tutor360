
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Profile = {
  id: string;
  role: string;
  details: Record<string, unknown> | null;
  created_at: string;
};

export default function FounderDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Profile[]>([]);
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [founderId, setFounderId] = useState("");

  async function loadUsers() {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, role, details, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      return;
    }

    setUsers(data || []);
  }

  useEffect(() => {
    let active = true;

    async function checkAccess() {
      try {
        const { data, error } =
          await supabase.auth.getUser();

        if (error || !data.user) {
          router.replace("/staff-login");
          return;
        }

        const { data: profile, error: profileError } =
          await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .single();

        if (profileError ||
            profile?.role !== "super_admin") {
          router.replace("/staff-login");
          return;
        }

        if (!active) return;

        setFounderId(data.user.id);
        await loadUsers();
      } catch {
        if (active) {
          setMessage("Unable to load dashboard.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    checkAccess();

    return () => {
      active = false;
    };
  }, [router]);

  async function makeManager(userId: string) {
    if (userId === founderId) return;

    const confirmed = window.confirm(
      "Grant Team Manager access to this user?"
    );

    if (!confirmed) return;

    setBusyId(userId);
    setMessage("");

    const { error } = await supabase.rpc(
      "tutor360_assign_role",
      {
        target_id: userId,
        new_role: "team_manager"
      }
    );

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Team Manager assigned successfully.");
      await loadUsers();
    }

    setBusyId(null);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/staff-login");
  }

  const tutors = users.filter(
    (u) => u.role === "tutor"
  ).length;

  const parents = users.filter(
    (u) => u.role === "parent"
  ).length;

  const managers = users.filter(
    (u) => u.role === "team_manager"
  ).length;

  const cardStyle: React.CSSProperties = {
    background: "#ffffff",
    borderRadius: 16,
    padding: 22,
    boxShadow: "0 5px 20px #0000000a"
  };

  if (loading) {
    return (
      <main style={{ padding: 40 }}>
        Verifying Founder access...
      </main>
    );
  }

  if (!founderId) {
    return (
      <main style={{ padding: 40 }}>
        Access denied.
      </main>
    );
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#f1f5fb",
      color: "#172b4d",
      fontFamily: "Arial, sans-serif"
    }}>

      <header style={{
        background: "#153c80",
        color: "#ffffff",
        padding: "20px 5%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 15
      }}>
        <div>
          <h1 style={{ margin: 0 }}>
            Tutor360
          </h1>
          <small>
            Knowledge360 | Founder Administration
          </small>
        </div>

        <button
          onClick={logout}
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: 8,
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </header>

      <div style={{
        maxWidth: 1200,
        margin: "auto",
        padding: 24
      }}>

        <h2>Founder Control Panel</h2>
        <p>
          Manage Tutor360 users and administrative access.
        </p>

        <section style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          marginTop: 24,
          marginBottom: 30
        }}>

          {[
            ["Total Users", users.length],
            ["Tutors", tutors],
            ["Parents", parents],
            ["Team Managers", managers]
          ].map(([label, count]) => (
            <div
              key={label}
              style={cardStyle}
            >
              <p>{label}</p>
              <h2 style={{
                fontSize: 32,
                color: "#153c80"
              }}>
                {count}
              </h2>
            </div>
          ))}

        </section>

        <section style={cardStyle}>
          <h2>Registered Users</h2>

          <p>
            Only the Founder can assign
            Team Manager privileges.
          </p>

          {message && (
            <p role="status" style={{
              padding: 12,
              background: "#eaf0fa",
              borderRadius: 8
            }}>
              {message}
            </p>
          )}

          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left"
            }}>
              <thead>
                <tr>
                  {[
                    "User",
                    "Role",
                    "Registered",
                    "Action"
                  ].map((heading) => (
                    <th key={heading} style={{
                      padding: 12,
                      borderBottom: "1px solid #ddd"
                    }}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {users.map((user) => {
                  const name =
                    typeof user.details?.name === "string"
                      ? user.details.name
                      : "Registered User";

                  return (
                    <tr key={user.id}>
                      <td style={{
                        padding: 12,
                        borderBottom: "1px solid #eee"
                      }}>
                        <strong>{name}</strong>
                        <div style={{
                          fontSize: 11,
                          color: "#64748b",
                          overflowWrap: "anywhere"
                        }}>
                          {user.id}
                        </div>
                      </td>

                      <td style={{
                        padding: 12,
                        borderBottom: "1px solid #eee"
                      }}>
                        {user.role}
                      </td>

                      <td style={{
                        padding: 12,
                        borderBottom: "1px solid #eee"
                      }}>
                        {new Date(
                          user.created_at
                        ).toLocaleDateString()}
                      </td>

                      <td style={{
                        padding: 12,
                        borderBottom: "1px solid #eee"
                      }}>
                        {["tutor", "parent"].includes(
                          user.role
                        ) && (
                          <button
                            disabled={busyId === user.id}
                            onClick={() =>
                              makeManager(user.id)
                            }
                            style={{
                              background: "#153c80",
                              color: "#fff",
                              border: "none",
                              padding: "10px 14px",
                              borderRadius: 7,
                              cursor: "pointer"
                            }}
                          >
                            {busyId === user.id
                              ? "Saving..."
                              : "Make Team Manager"}
                          </button>
                        )}

                        {user.role === "super_admin" &&
                          "Protected"}

                        {user.role === "team_manager" &&
                          "Manager Active"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {users.length === 0 && (
              <p>No user profiles found.</p>
            )}
          </div>

          <button
            onClick={loadUsers}
            style={{
              marginTop: 20,
              padding: "12px 20px",
              border: "1px solid #153c80",
              borderRadius: 8,
              background: "#fff",
              cursor: "pointer"
            }}
          >
            Refresh Users
          </button>
        </section>

        <footer style={{
          textAlign: "center",
          padding: 30,
          color: "#64748b"
        }}>
          Tutor360 — An Initiative by Knowledge360
        </footer>
      </div>
    </main>
  );
}
