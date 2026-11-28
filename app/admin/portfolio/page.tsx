
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

type Project = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  media_url: string;
  media_type: string;
};

const categories = [
  { value: "reels-shorts", label: "Reels & Shorts Editing" },
  { value: "youtube", label: "YouTube Video Editing" },
  { value: "wedding-events", label: "Wedding & Events" },
  { value: "promotional", label: "Promotional Videos" },
  { value: "business-branding", label: "Business & Branding" },
  { value: "creative-editing", label: "Creative Editing" },
];

export default function PortfolioAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("reels-shorts");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const loadProjects = async () => {
    const { data, error } = await supabase
      .from("portfolio")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      setMessage("Projects load नहीं हुए: " + error.message);
      return;
    }

    setProjects((data || []) as Project[]);
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
      const { data } = await supabase.auth.getUser();

      if (!active) return;

      if (!data.user) {
        setMessage("पहले Admin Login करें।");
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role, approved")
        .eq("id", data.user.id)
        .maybeSingle();

      if (!active) return;

      if (
        error ||
        profile?.role !== "admin" ||
        profile?.approved !== true
      ) {
        setMessage("Access Denied! केवल Approved Admin प्रवेश कर सकता है।");
        setLoading(false);
        return;
      }

      setAuthorized(true);
      await loadProjects();

      if (active) setLoading(false);
    };

    checkAdmin();

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const uploadProject = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      setMessage("कृपया MP4 Video चुनें।");
      return;
    }

    const isMp4 =
      file.type === "video/mp4" ||
      file.name.toLowerCase().endsWith(".mp4");

    if (!isMp4) {
      setMessage("केवल MP4 वीडियो अपलोड कर सकते हैं।");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setMessage("Video का Size 50 MB से कम होना चाहिए।");
      return;
    }

    setUploading(true);
    setMessage("");

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `portfolio/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("shaurya-assets")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: "video/mp4",
      });

    if (uploadError) {
      setMessage("Upload Error: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: publicData } = supabase.storage
      .from("shaurya-assets")
      .getPublicUrl(filePath);

    const { error: insertError } = await supabase
      .from("portfolio")
      .insert({
        title: title.trim(),
        category,
        description: description.trim(),
        media_url: publicData.publicUrl,
        media_type: "video",
      });

    if (insertError) {
      await supabase.storage
        .from("shaurya-assets")
        .remove([filePath]);

      setMessage("Database Error: " + insertError.message);
      setUploading(false);
      return;
    }

    setTitle("");
    setCategory("reels-shorts");
    setDescription("");
    setFile(null);

    const fileInput = document.getElementById(
      "portfolio-file"
    ) as HTMLInputElement;

    if (fileInput) fileInput.value = "";

    setMessage("🎉 MP4 Video सफलतापूर्वक Upload हो गया!");

    await loadProjects();
    setUploading(false);
  };

  const deleteProject = async (project: Project) => {
    if (!confirm(`क्या "${project.title}" को Delete करना चाहते हैं?`)) {
      return;
    }

    const marker = "/storage/v1/object/public/shaurya-assets/";
    const filePath = project.media_url.split(marker)[1];

    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from("shaurya-assets")
        .remove([decodeURIComponent(filePath)]);

      if (storageError) {
        alert("Storage Delete Error: " + storageError.message);
        return;
      }
    }

    const { error } = await supabase
      .from("portfolio")
      .delete()
      .eq("id", project.id);

    if (error) {
      alert("Project Delete Error: " + error.message);
      return;
    }

    setProjects((previous) =>
      previous.filter((item) => item.id !== project.id)
    );
  };

  const inputStyle = {
    width: "100%",
    padding: "13px",
    borderRadius: "9px",
    border: "1px solid #443653",
    background: "#17151e",
    color: "white",
    boxSizing: "border-box" as const,
    marginTop: "7px",
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
        Loading Portfolio Dashboard...
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
        padding: 20,
        textAlign: "center",
      }}>
        <div>
          <h1>🔒 Access Denied</h1>
          <p>{message}</p>
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
      <div style={{ maxWidth: "1000px", margin: "auto" }}>
        <Link href="/admin" style={{
          color: "#c084fc",
          textDecoration: "none",
        }}>
          ← Back to Admin Dashboard
        </Link>

        <h1 style={{ fontSize: "32px", marginTop: "25px" }}>
          Portfolio Management
        </h1>

        <p style={{ color: "#aaa" }}>
          अपनी छह Services के लिए MP4 Videos Upload और Manage करें।
        </p>

        <form
          onSubmit={uploadProject}
          style={{
            background: "#12121a",
            border: "1px solid #39264d",
            borderRadius: "16px",
            padding: "22px",
            marginTop: "25px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Upload New Video</h2>

          <label>
            Video Title *
            <input
              style={inputStyle}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example: Cinematic Instagram Reel"
              required
              maxLength={120}
            />
          </label>

          <br /><br />

          <label>
            Service Category *
            <select
              style={inputStyle}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categories.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <br /><br />

          <label>
            Video Description
            <textarea
              style={{ ...inputStyle, minHeight: "90px" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write about this video..."
              maxLength={1000}
            />
          </label>

          <br /><br />

          <label>
            Select MP4 Video *
            <input
              id="portfolio-file"
              style={inputStyle}
              type="file"
              accept=".mp4,video/mp4"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </label>

          <p style={{ color: "#999", fontSize: "12px" }}>
            केवल MP4 Format | Maximum Size: 50 MB
          </p>

          <button
            type="submit"
            disabled={uploading}
            style={{
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "10px",
              background: "linear-gradient(90deg,#9333ea,#c026d3)",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: uploading ? "wait" : "pointer",
            }}
          >
            {uploading ? "Uploading..." : "UPLOAD MP4 VIDEO"}
          </button>

          {message && (
            <p style={{
              color: message.includes("Error") ? "#f87171" : "#d8b4fe",
              marginTop: "18px",
              overflowWrap: "anywhere",
            }}>
              {message}
            </p>
          )}
        </form>

        <h2 style={{ marginTop: "40px" }}>
          Uploaded Projects ({projects.length})
        </h2>

        {projects.length === 0 ? (
          <p style={{ color: "#aaa" }}>
            अभी कोई Video Upload नहीं हुआ है।
          </p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
            gap: "18px",
            marginTop: "20px",
          }}>
            {projects.map((project) => (
              <article
                key={project.id}
                style={{
                  background: "#15121d",
                  border: "1px solid #39264d",
                  borderRadius: "14px",
                  padding: "14px",
                  overflow: "hidden",
                }}
              >
                {project.media_type === "video" ? (
                  <video
                    src={project.media_url}
                    controls
                    playsInline
                    preload="metadata"
                    style={{
                      width: "100%",
                      maxHeight: "220px",
                      borderRadius: "9px",
                      background: "#000",
                    }}
                  />
                ) : (
                  <img
                    src={project.media_url}
                    alt={project.title}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "9px",
                    }}
                  />
                )}

                <h3>{project.title}</h3>

                <p style={{ color: "#c084fc" }}>
                  {categories.find(
                    (item) => item.value === project.category
                  )?.label || project.category}
                </p>

                <p style={{ color: "#aaa", fontSize: "14px" }}>
                  {project.description}
                </p>

                <button
                  onClick={() => deleteProject(project)}
                  style={{
                    ...inputStyle,
                    color: "#f87171",
                    cursor: "pointer",
                  }}
                >
                  Delete Project
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

