
"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

const boards = ["CBSE", "ICSE", "UP Board"];

function RegisterForm() {
  const params = useSearchParams();
  const router = useRouter();

  const role = params.get("role") === "tutor"
    ? "tutor"
    : "parent";

  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function update(name: string, value: string) {
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function field(
    label: string,
    name: string,
    type = "text",
    required = true
  ) {
    return (
      <label className="field">
        <span>{label}</span>
        <input
          type={type}
          value={form[name] || ""}
          onChange={e => update(name, e.target.value)}
          required={required}
        />
      </label>
    );
  }

  function boardField(label: string, name: string) {
    return (
      <label className="field">
        <span>{label}</span>
        <select
          value={form[name] || ""}
          required
          onChange={e => update(name, e.target.value)}
        >
          <option value="">Select Board</option>
          {boards.map(board => (
            <option key={board} value={board}>{board}</option>
          ))}
        </select>
      </label>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if ((form.password || "").length < 8) {
        throw new Error("Password must have at least 8 characters.");
      }

      if (role === "tutor") {
        const y10 = Number(form.tenth_year);
        const y12 = Number(form.twelfth_year);
        const current = new Date().getFullYear();

        if (
          y10 > y12 ||
          y10 < 1950 ||
          y12 > current ||
          Number(form.experience) < 0
        ) {
          throw new Error("Please check your passing years and experience.");
        }
      }

      const profile = { ...form };
      delete profile.password;

      const { data, error } = await supabase.auth.signUp({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        options: {
          data: {
            role,
            profile
          }
        }
      });

      if (error) throw error;

      if (data.session) {
        router.push("/dashboard");
      } else {
        setMessage(
          "Registration submitted. Please check your email for verification. If you already have an account, sign in."
        );
      }
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="authPage">
      <div className="authCard wide">
        <Link href="/" className="backLink">← Back to Home</Link>

        <h1>
          {role === "tutor"
            ? "Tutor Registration"
            : "Parents Registration"}
        </h1>

        <p className="muted">
          Join Tutor360 – An Initiative by Knowledge360
        </p>

        <div className="roleSwitch">
          <Link
            className={role === "tutor" ? "selected" : ""}
            href="/register?role=tutor"
          >
            Tutor
          </Link>
          <Link
            className={role === "parent" ? "selected" : ""}
            href="/register?role=parent"
          >
            Parent
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="formGrid">
            {role === "tutor" ? (
              <>
                {field("Full Name", "name")}
                {field("Date of Birth", "dob", "date")}
                {field("10th Passing Year", "tenth_year", "number")}
                {boardField("10th Board", "tenth_board")}
                {field("12th Passing Year", "twelfth_year", "number")}
                {boardField("12th Board", "twelfth_board")}
                {field("Highest Qualification", "qualification")}
                {field("Experience as Tutor (Years)", "experience", "number")}
                {field("Contact Number", "contact", "tel")}
                {field("WhatsApp Number", "whatsapp", "tel")}
                {field("Email ID", "email", "email")}
              </>
            ) : (
              <>
                {field("Student Name", "student_name")}
                <label className="field">
                  <span>Class</span>
                  <select
                    required
                    value={form.student_class || ""}
                    onChange={e => update("student_class", e.target.value)}
                  >
                    <option value="">Select Class</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1)
                      .map(n => (
                        <option key={n} value={String(n)}>
                          Class {n}
                        </option>
                      ))}
                  </select>
                </label>
                {boardField("Board", "board")}
                {field("School Name", "school")}
                {field("Contact Number", "contact", "tel")}
                {field("Parent Email ID", "email", "email")}
              </>
            )}

            {field("Create Password", "password", "password")}
          </div>

          <p className="privacyNote">
            By registering, you agree to provide accurate
            information for Tutor360 account management.
            Student information is accessible only to
            authorized account holders and administrators.
          </p>

          <button
            type="submit"
            className="btn primary full"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Create Account"}
          </button>

          {message && <p className="formMessage">{message}</p>}
        </form>

        <p className="authBottom">
          Already registered?{" "}
          <Link href={`/login?role=${role}`}>Login Here</Link>
        </p>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<p>Loading registration...</p>}>
      <RegisterForm />
    </Suspense>
  );
}
