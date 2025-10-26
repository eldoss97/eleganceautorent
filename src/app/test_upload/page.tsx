"use client";
import { useState } from "react";

type UploadResp = { secure_url: string };

export default function TestUploadPage() {
  const [url, setUrl] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!; // cars_unsigned

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", preset);
    // form.append("folder", "cars"); // можно добавить папку явно

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      alert("Upload failed");
      return;
    }
    const data = (await res.json()) as UploadResp;
    setUrl(data.secure_url);
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Cloudinary test upload</h1>
      <input type="file" accept="image/*" onChange={handleFile} />
      {url && (
        <>
          <p>URL:</p>
          <a href={url} target="_blank" rel="noreferrer">{url}</a>
          <div style={{ marginTop: 16 }}>
            {/* можно и через <img>, и через next/image */}
            <img src={url} alt="uploaded" style={{ maxWidth: 400, borderRadius: 8 }} />
          </div>
        </>
      )}
    </main>
  );
}
