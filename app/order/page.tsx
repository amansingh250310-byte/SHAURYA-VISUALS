
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function OrderPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [trackingDetails, setTrackingDetails] = useState<{
    id: string;
    token: string;
  } | null>(null);

  const [form, setForm] = useState({
    customer_name: "",
    email: "",
    phone: "",
    service_name: "",
    details: "",
    reference_url: "",
    budget: "",
  });

  function updateField(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setTrackingDetails(null);

    const orderId = crypto.randomUUID();
    const trackingToken = crypto.randomUUID();

    const { error } = await supabase.from("orders").insert([
      {
        id: orderId,
        tracking_token: trackingToken,
        customer_name: form.customer_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        service_name: form.service_name,
        details: form.details.trim(),
        reference_url: form.reference_url.trim() || null,
        budget: form.budget.trim() || null,
      },
    ]);

    setLoading(false);

    if (error) {
      setMessage("Order submit नहीं हुआ। कृपया दोबारा कोशिश करें।");
      console.error("Order Error:", error);
      return;
    }

    setTrackingDetails({
      id: orderId,
      token: trackingToken,
    });

    setMessage("🎉 आपका Order सफलतापूर्वक Submit हो गया!");

    setForm({
      customer_name: "",
      email: "",
      phone: "",
      service_name: "",
      details: "",
      reference_url: "",
      budget: "",
    });
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

  return (
    <main style={{
      minHeight: "100vh",
      background: "#08080d",
      color: "white",
      padding: "35px 16px",
    }}>
      <div style={{ maxWidth: "650px", margin: "auto" }}>
        <Link href="/" style={{
          color: "#c084fc",
          textDecoration: "none",
        }}>
          ← Back to Home
        </Link>

        <h1 style={{
          fontSize: "36px",
          marginTop: "30px",
          marginBottom: "8px",
        }}>
          Place Your Order
        </h1>

        <p style={{ color: "#aaa", marginBottom: "28px" }}>
          Tell us about your project. Let's create something amazing!
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "#111118",
            border: "1px solid #292333",
            borderRadius: "18px",
            padding: "24px",
          }}
        >
          <label>
            Full Name *
            <input
              style={inputStyle}
              name="customer_name"
              value={form.customer_name}
              onChange={updateField}
              placeholder="Enter your name"
              required
              maxLength={100}
            />
          </label>

          <br /><br />

          <label>
            Email Address *
            <input
              style={inputStyle}
              type="email"
              name="email"
              value={form.email}
              onChange={updateField}
              placeholder="Enter your email"
              required
            />
          </label>

          <br /><br />

          <label>
            WhatsApp / Mobile Number *
            <input
              style={inputStyle}
              type="tel"
              name="phone"
              value={form.phone}
              onChange={updateField}
              placeholder="Enter mobile number"
              required
              maxLength={20}
            />
          </label>

          <br /><br />

          <label>
            Select Service *
            <select
              style={inputStyle}
              name="service_name"
              value={form.service_name}
              onChange={updateField}
              required
            >
              <option value="">Choose a service</option>
              <option value="Instagram Reels Editing">Instagram Reels Editing</option>
              <option value="YouTube Video Editing">YouTube Video Editing</option>
              <option value="Wedding Video Editing">Wedding Video Editing</option>
              <option value="Promotional Video">Promotional Video</option>
              <option value="Business Video">Business Video</option>
              <option value="Other Creative Editing">Other Creative Editing</option>
            </select>
          </label>

          <br /><br />

          <label>
            Project Details *
            <textarea
              style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }}
              name="details"
              value={form.details}
              onChange={updateField}
              placeholder="Describe your video editing requirements..."
              required
              maxLength={3000}
            />
          </label>

          <br /><br />

          <label>
            Reference Video Link (Optional)
            <input
              style={inputStyle}
              type="url"
              name="reference_url"
              value={form.reference_url}
              onChange={updateField}
              placeholder="YouTube / Google Drive link"
            />
          </label>

          <br /><br />

          <label>
            Your Budget (Optional)
            <input
              style={inputStyle}
              name="budget"
              value={form.budget}
              onChange={updateField}
              placeholder="Enter your budget"
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
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading ? "Submitting..." : "SUBMIT YOUR ORDER"}
          </button>

          {message && (
            <p style={{
              marginTop: "18px",
              textAlign: "center",
              color: "#d8b4fe",
            }}>
              {message}
            </p>
          )}

          {trackingDetails && (
            <div style={{
              marginTop: "22px",
              padding: "18px",
              borderRadius: "12px",
              border: "1px solid #9333ea",
              background: "#1a1028",
            }}>
              <h2 style={{ color: "#d8b4fe", fontSize: "21px" }}>
                Your Tracking Details
              </h2>

              <p style={{ color: "#aaa", fontSize: "13px" }}>
                इन दोनों Codes को सुरक्षित रखें। इनके बिना Order Track नहीं होगा।
              </p>

              <p style={{ marginTop: "16px", fontSize: "13px", color: "#c084fc" }}>
                ORDER ID
              </p>
              <p style={{ overflowWrap: "anywhere", fontSize: "14px" }}>
                {trackingDetails.id}
              </p>

              <p style={{ marginTop: "16px", fontSize: "13px", color: "#c084fc" }}>
                PRIVATE TRACKING CODE
              </p>
              <p style={{ overflowWrap: "anywhere", fontSize: "14px" }}>
                {trackingDetails.token}
              </p>

              <button
                type="button"
                onClick={() => {
                  const details =
                    `Order ID: ${trackingDetails.id}\n` +
                    `Tracking Code: ${trackingDetails.token}`;
                  navigator.clipboard.writeText(details)
                    .then(() => setMessage("Tracking Details copied successfully!"))
                    .catch(() => setMessage("Copy नहीं हुआ। Codes manually save करें।"));
                }}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "18px",
                  border: "none",
                  borderRadius: "9px",
                  background: "#9333ea",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                COPY TRACKING DETAILS
              </button>
            </div>
          )}
        </form>

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
