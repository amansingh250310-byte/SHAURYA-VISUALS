
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error || !data.user) {
      setMessage("गलत Email या Password। दोबारा कोशिश करें।");
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, approved")
      .eq("id", data.user.id)
      .single();

    if (
      profileError ||
      profile?.role !== "admin" ||
      profile?.approved !== true
    ) {
      await supabase.auth.signOut();
      setMessage("Access Denied! केवल Approved Admin Login कर सकता है।");
      setLoading(false);
      return;
    }

    router.replace("/admin");
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#08080d",
      color: "white",
      display: "grid",
      placeItems: "center",
      padding: "20px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "420px",
        background: "#12121a",
        border: "1px solid #39264d",
        borderRadius: "20px",
        padding: "30px",
        boxSizing: "border-box",
      }}>
        <Link href="/" style={{
          color: "#c084fc",
          textDecoration: "none",
        }}>
          ← Back to Home
        </Link>

        <h1 style={{
          textAlign: "center",
          marginTop: "35px",
          fontSize: "30px",
        }}>
          SHAURYA <span style={{ color: "#c084fc" }}>VISUALS</span>
        </h1>

        <h2 style={{ textAlign: "center" }}>
          Admin Login
        </h2>

        <p style={{
          textAlign: "center",
          color: "#999",
          fontSize: "14px",
        }}>
          Login to access your Admin Dashboard
        </p>

        <form onSubmit={handleLogin}>
          <label>Email Address</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin Email"
            required
            style={{
              width: "100%",
              padding: "14px",
              marginTop: "8px",
              marginBottom: "20px",
              background: "#1b1b25",
              color: "white",
              border: "1px solid #444",
              borderRadius: "10px",
              boxSizing: "border-box",
            }}
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin Password"
            required
            style={{
              width: "100%",
              padding: "14px",
              marginTop: "8px",
              marginBottom: "20px",
              background: "#1b1b25",
              color: "white",
              border: "1px solid #444",
              borderRadius: "10px",
              boxSizing: "border-box",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              background: "linear-gradient(90deg,#9333ea,#c026d3)",
              border: "none",
              borderRadius: "10px",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            {loading ? "Logging In..." : "LOGIN TO DASHBOARD"}
          </button>
        </form>

        {message && (
          <p style={{
            color: "#f87171",
            textAlign: "center",
            marginTop: "20px",
          }}>
            {message}
          </p>
        )}

        <p style={{
          textAlign: "center",
          color: "#777",
          fontSize: "12px",
          marginTop: "25px",
        }}>
          Authorized Admin Access Only
        </p>
      </div>
    </main>
  );
}
