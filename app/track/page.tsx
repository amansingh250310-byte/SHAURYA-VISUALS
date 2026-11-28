
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type OrderResult = {
  status: string;
  service_name: string;
  created_at: string;
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<OrderResult | null>(null);

  async function handleTrack(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    const { data, error: rpcError } = await supabase.rpc("track_order", {
      p_order_id: orderId.trim(),
      p_tracking_token: trackingCode.trim(),
    });

    setLoading(false);

    if (rpcError) {
      console.error("Tracking error:", rpcError);
      setError("Tracking अभी उपलब्ध नहीं है। कृपया बाद में कोशिश करें।");
      return;
    }

    if (!data || data.length === 0) {
      setError("Order नहीं मिला। Order ID और Tracking Code जाँचें।");
      return;
    }

    setOrder(data[0] as OrderResult);
  }

  const status = order?.status?.toLowerCase();

  const statusInfo: Record<string, { label: string; color: string }> = {
    pending: { label: "Pending", color: "#fbbf24" },
    accepted: { label: "Accepted", color: "#60a5fa" },
    processing: { label: "In Progress", color: "#a78bfa" },
    "in progress": { label: "In Progress", color: "#a78bfa" },
    completed: { label: "Completed", color: "#4ade80" },
    rejected: { label: "Rejected", color: "#f87171" },
    cancelled: { label: "Cancelled", color: "#f87171" },
  };

  const currentStatus = status
    ? statusInfo[status] || { label: order?.status || "Unknown", color: "#d8b4fe" }
    : null;

  return (
    <main style={{
      minHeight: "100vh",
      background: "#08080d",
      color: "white",
      padding: "35px 16px",
    }}>
      <div style={{ maxWidth: "600px", margin: "auto" }}>
        <Link href="/" style={{
          color: "#c084fc",
          textDecoration: "none",
        }}>
          ← Back to Home
        </Link>

        <div style={{
          marginTop: "45px",
          padding: "25px",
          background: "#111118",
          border: "1px solid #292333",
          borderRadius: "18px",
        }}>
          <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
            Track Your <span style={{ color: "#c084fc" }}>Order</span>
          </h1>

          <p style={{ color: "#aaa", marginBottom: "25px" }}>
            Enter your Order ID and Private Tracking Code to check your order status.
          </p>

          <form onSubmit={handleTrack}>
            <label>
              Order ID
              <input
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
                placeholder="Enter your Order ID"
                style={inputStyle}
              />
            </label>

            <br /><br />

            <label>
              Private Tracking Code
              <input
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                required
                placeholder="Enter your Tracking Code"
                style={inputStyle}
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "15px",
                marginTop: "25px",
                border: "none",
                borderRadius: "10px",
                background: "linear-gradient(90deg,#9333ea,#c026d3)",
                color: "white",
                fontWeight: "bold",
                cursor: loading ? "wait" : "pointer",
              }}
            >
              {loading ? "Checking..." : "TRACK MY ORDER"}
            </button>
          </form>

          {error && (
            <p style={{
              marginTop: "20px",
              color: "#f87171",
              textAlign: "center",
            }}>
              {error}
            </p>
          )}

          {order && currentStatus && (
            <div style={{
              marginTop: "25px",
              padding: "20px",
              border: "1px solid #9333ea",
              borderRadius: "12px",
              background: "#1a1028",
            }}>
              <h2 style={{ fontSize: "22px", marginBottom: "18px" }}>
                Order Details
              </h2>

              <p style={{ color: "#aaa", fontSize: "13px" }}>
                SERVICE
              </p>
              <p style={{ marginBottom: "18px" }}>
                {order.service_name}
              </p>

              <p style={{ color: "#aaa", fontSize: "13px" }}>
                ORDER STATUS
              </p>
              <p style={{
                color: currentStatus.color,
                fontSize: "22px",
                fontWeight: "bold",
                marginTop: "5px",
              }}>
                {currentStatus.label}
              </p>

              <p style={{ color: "#aaa", fontSize: "13px", marginTop: "18px" }}>
                ORDER DATE
              </p>
              <p>
                {new Date(order.created_at).toLocaleDateString("en-IN")}
              </p>
            </div>
          )}
        </div>

        <p style={{
          textAlign: "center",
          color: "#777",
          marginTop: "25px",
        }}>
          SHAURYA VISUALS © {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "13px",
  borderRadius: "10px",
  border: "1px solid #444",
  background: "#151515",
  color: "white",
  fontSize: "15px",
  marginTop: "7px",
  boxSizing: "border-box" as const,
};
