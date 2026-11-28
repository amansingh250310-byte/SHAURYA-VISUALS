
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

type ServicePrice = {
  service_key: string;
  service_name: string;
  one_video: string;
  seven_days: string;
  monthly: string;
  yearly: string;
  ten_video_package: string;
};

const priceFields = [
  { key: "one_video", label: "One Video" },
  { key: "seven_days", label: "7 Days" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
  { key: "ten_video_package", label: "10 Video Package" },
] as const;

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [prices, setPrices] = useState<ServicePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [savingKey, setSavingKey] = useState("");
  const [priceMessage, setPriceMessage] = useState("");

  const loadOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError("Orders load नहीं हुए: " + error.message);
      return;
    }

    setOrders((data || []) as Order[]);
  };

  const loadPrices = async () => {
    const { data, error } = await supabase
      .from("service_prices")
      .select(
        "service_key, service_name, one_video, seven_days, monthly, yearly, ten_video_package"
      )
      .order("service_key");

    if (error) {
      setPriceMessage("Price load Error: " + error.message);
      return;
    }

    setPrices((data || []) as ServicePrice[]);
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

      await Promise.all([loadOrders(), loadPrices()]);

      if (active) setLoading(false);
    };

    checkAdmin();

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const savePrice = async (price: ServicePrice) => {
    setSavingKey(price.service_key);
    setPriceMessage("");

    const { error } = await supabase
      .from("service_prices")
      .update({
        one_video: price.one_video,
        seven_days: price.seven_days,
        monthly: price.monthly,
        yearly: price.yearly,
        ten_video_package: price.ten_video_package,
        updated_at: new Date().toISOString(),
      })
      .eq("service_key", price.service_key);

    if (error) {
      setPriceMessage("Price Update Error: " + error.message);
    } else {
      setPriceMessage(
        "✓ " + price.service_name + " की कीमतें सफलतापूर्वक सेव हो गईं।"
      );
    }

    setSavingKey("");
  };

  const changePrice = (
    serviceKey: string,
    field: keyof ServicePrice,
    value: string
  ) => {
    setPrices((previous) =>
      previous.map((item) =>
        item.service_key === serviceKey
          ? { ...item, [field]: value }
          : item
      )
    );
  };

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
    width: "100%",
    padding: "11px",
    borderRadius: "8px",
    border: "1px solid #443653",
    background: "#171720",
    color: "white",
    boxSizing: "border-box" as const,
  };

  const buttonStyle = {
    padding: "12px 17px",
    border: "none",
    borderRadius: "9px",
    background: "linear-gradient(90deg,#9333ea,#c026d3)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
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
          <Link href="/login" style={{ color: "#c084fc" }}>
            Admin Login
          </Link>
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

        {/* MANAGEMENT LINKS */}
        <h2 style={{ marginTop: "30px" }}>Website Management</h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "15px",
        }}>
          <Link href="/admin/portfolio" style={{
            background: "#21152e",
            border: "1px solid #63358a",
            borderRadius: "13px",
            padding: "20px",
            color: "white",
            textDecoration: "none",
          }}>
            <h3>🎬 Manage Videos</h3>
            <p style={{ color: "#c4b5fd" }}>
              Upload and delete service videos
            </p>
          </Link>

          <a href="#prices" style={{
            background: "#21152e",
            border: "1px solid #63358a",
            borderRadius: "13px",
            padding: "20px",
            color: "white",
            textDecoration: "none",
          }}>
            <h3>💰 Manage Prices</h3>
            <p style={{ color: "#c4b5fd" }}>
              Edit all six service price lists
            </p>
          </a>

          <a href="/" style={{
            background: "#21152e",
            border: "1px solid #63358a",
            borderRadius: "13px",
            padding: "20px",
            color: "white",
            textDecoration: "none",
          }}>
            <h3>🌐 View Website</h3>
            <p style={{ color: "#c4b5fd" }}>
              Open public website
            </p>
          </a>
        </div>

        {/* PRICE MANAGEMENT */}
        <section id="prices" style={{ marginTop: "40px" }}>
          <h2>💰 Service Price Management</h2>
          <p style={{ color: "#aaa" }}>
            छहों Services की कीमतें यहाँ से बदल सकते हैं।
          </p>

          {prices.length === 0 ? (
            <p style={{ color: "#fbbf24" }}>
              कोई Price Record नहीं मिला। Database जाँचें।
            </p>
          ) : (
            <div style={{
              display: "grid",
              gap: "18px",
              marginTop: "20px",
            }}>
              {prices.map((price) => (
                <article key={price.service_key} style={{
                  background: "#15121d",
                  border: "1px solid #49305e",
                  borderRadius: "15px",
                  padding: "20px",
                }}>
                  <h3 style={{ color: "#d8b4fe", marginTop: 0 }}>
                    {price.service_name}
                  </h3>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(135px,1fr))",
                    gap: "13px",
                  }}>
                    {priceFields.map((field) => (
                      <label key={field.key} style={{
                        display: "grid",
                        gap: "7px",
                        fontSize: "13px",
                        color: "#c4b5fd",
                      }}>
                        {field.label}
                        <input
                          style={inputStyle}
                          value={price[field.key]}
                          onChange={(e) =>
                            changePrice(
                              price.service_key,
                              field.key,
                              e.target.value
                            )
                          }
                          maxLength={40}
                        />
                      </label>
                    ))}
                  </div>

                  <button
                    onClick={() => savePrice(price)}
                    disabled={savingKey === price.service_key}
                    style={{
                      ...buttonStyle,
                      width: "100%",
                      marginTop: "17px",
                      opacity: savingKey === price.service_key ? 0.6 : 1,
                    }}
                  >
                    {savingKey === price.service_key
                      ? "Saving..."
                      : "SAVE " + price.service_name.toUpperCase()}
                  </button>
                </article>
              ))}
            </div>
          )}

          {priceMessage && (
            <p style={{
              color: priceMessage.includes("Error") ? "#f87171" : "#86efac",
              overflowWrap: "anywhere",
            }}>
              {priceMessage}
            </p>
          )}
        </section>

        {/* ORDERS */}
        <section style={{ marginTop: "45px" }}>
          <h2>Customer Orders</h2>

          <div style={{
            padding: "20px",
            borderRadius: "15px",
            background: "#15121d",
            border: "1px solid #38234c",
          }}>
            <h3 style={{ marginTop: 0 }}>Total Orders</h3>
            <strong style={{
              fontSize: "38px",
              color: "#c084fc",
            }}>
              {orders.length}
            </strong>

            <button
              onClick={loadOrders}
              style={{ ...inputStyle, display: "block", marginTop: "12px" }}
            >
              ↻ Refresh Orders
            </button>
          </div>

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
                <article key={order.id} style={{
                  background: "#12121a",
                  border: "1px solid #30283b",
                  borderRadius: "15px",
                  padding: "20px",
                  overflowWrap: "anywhere",
                }}>
                  <h3 style={{ color: "#d8b4fe", marginTop: 0 }}>
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
                      <a href={order.reference_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "#c084fc" }}>
                        Open Reference
                      </a>
                    </p>
                  )}

                  <p>
                    <b>Current Status:</b> {order.status || "Pending"}
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
        </section>
      </div>
    </main>
  );
}
