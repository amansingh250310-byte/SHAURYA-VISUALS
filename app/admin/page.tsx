
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Order = {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  service_name: string;
  details: string;
  reference_url: string | null;
  budget: string | null;
  status: string | null;
};

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*");

    if (error) {
      setError("Orders load नहीं हुए: " + error.message);
      return;
    }

    setOrders((data || []) as Order[]);
  };

  
useEffect(() => {
  let active = true;

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_OUT" && active) {
      setAuthorized(false);
      window.location.replace("/login");
    }
  });

  const checkAdmin = async () => {
    setLoading(true);
    setError("");

    const { data: authData, error: authError } =
      await supabase.auth.getUser();

    if (!active) return;

    if (authError || !authData.user) {
      setError("पहले Admin Account से Login करें।");
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select("role, approved")
        .eq("id", authData.user.id)
        .maybeSingle();

    if (!active) return;

    if (
      profileError ||
      profile?.role !== "admin" ||
      profile?.approved !== true
    ) {
      setError("Access Denied! केवल Approved Admin प्रवेश कर सकता है।");
      setLoading(false);
      return;
    }

    setAuthorized(true);
    await loadOrders();

    if (active) setLoading(false);
  };

  checkAdmin();

  return () => {
    active = false;
    subscription.unsubscribe();
  };
}, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert("Status Update नहीं हुआ: " + error.message);
      return;
    }

    setOrders((previous) =>
      previous.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    );
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("क्या आप इस Order को Delete करना चाहते हैं?")) return;

    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Order Delete नहीं हुआ: " + error.message);
      return;
    }

    setOrders((previous) =>
      previous.filter((order) => order.id !== id)
    );
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const inputStyle = {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #444",
    background: "#171720",
    color: "white",
  };

  if (loading) {
    return (
      <main style={{
        minHeight: "100vh",
        background: "#08080d",
        color: "white",
        display: "grid",
        placeItems: "center",
      }}>
        Admin Dashboard Loading...
      </main>
    );
  }

  if (!authorized) {
    return (
      <main style={{
        minHeight: "100vh",
        background: "#08080d",
        color: "white",
        display: "grid",
        placeItems: "center",
        padding: "20px",
        textAlign: "center",
      }}>
        <div>
          <h1>🔒 Access Denied</h1>
          <p style={{ color: "#aaa" }}>{error}</p>
          <button
            onClick={() => window.location.href = "/"}
            style={inputStyle}
          >
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#08080d",
      color: "white",
      padding: "25px 16px",
    }}>
      <div style={{ maxWidth: "1100px", margin: "auto" }}>
        <header style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
        }}>
          <div>
            <h1 style={{ fontSize: "30px", marginBottom: "5px" }}>
              SHAURYA VISUALS
            </h1>
            <p style={{ color: "#c084fc", marginTop: 0 }}>
              Admin Dashboard
            </p>
          </div>

          <button onClick={logout} style={inputStyle}>
            Logout
          </button>
        </header>

        <section style={{
          marginTop: "25px",
          padding: "20px",
          borderRadius: "15px",
          background: "#15121d",
          border: "1px solid #38234c",
        }}>
          <h2 style={{ marginTop: 0 }}>Total Orders</h2>
          <strong style={{
            fontSize: "38px",
            color: "#c084fc",
          }}>
            {orders.length}
          </strong>
          <button
            onClick={loadOrders}
            style={{
              ...inputStyle,
              display: "block",
              marginTop: "12px",
            }}
          >
            ↻ Refresh Orders
          </button>
        </section>

        <h2 style={{ marginTop: "35px" }}>Customer Orders</h2>

        {error && <p style={{ color: "#f87171" }}>{error}</p>}

        {orders.length === 0 ? (
          <p style={{ color: "#aaa" }}>अभी कोई Order नहीं है।</p>
        ) : (
          <div style={{
            display: "grid",
            gap: "18px",
            marginTop: "18px",
          }}>
            {orders.map((order) => (
              <article
                key={order.id}
                style={{
                  background: "#12121a",
                  border: "1px solid #30283b",
                  borderRadius: "15px",
                  padding: "20px",
                  overflowWrap: "anywhere",
                }}
              >
                <h3 style={{
                  color: "#d8b4fe",
                  marginTop: 0,
                }}>
                  {order.customer_name}
                </h3>

                <p><b>Email:</b> {order.email}</p>
                <p><b>Mobile:</b> {order.phone}</p>
                <p><b>Service:</b> {order.service_name}</p>
                <p><b>Project Details:</b> {order.details}</p>
                <p><b>Budget:</b> {order.budget || "Not Provided"}</p>

                {order.reference_url && (
                  <p>
                    <b>Reference:</b>{" "}
                    <a
                      href={order.reference_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#c084fc" }}
                    >
                      Open Reference
                    </a>
                  </p>
                )}

                <p>
                  <b>Current Status:</b>{" "}
                  {order.status || "Pending"}
                </p>

                <label style={{
                  display: "grid",
                  gap: "8px",
                  maxWidth: "260px",
                  marginTop: "15px",
                }}>
                  Update Status
                  <select
                    value={order.status || "Pending"}
                    onChange={(e) =>
                      updateStatus(order.id, e.target.value)
                    }
                    style={inputStyle}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </label>

                <button
                  onClick={() => deleteOrder(order.id)}
                  style={{
                    ...inputStyle,
                    marginTop: "18px",
                    color: "#f87171",
                    borderColor: "#7f1d1d",
                  }}
                >
                  Delete Order
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
