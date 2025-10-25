import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export const runtime = "nodejs"; // нужен доступ к fs

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "no file" }, { status: 400 });

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "only images allowed" }, { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const extFromName = path.extname(file.name || "").toLowerCase();
  const extFromType = "." + (file.type.split("/")[1] || "png");
  const ext = extFromName || extFromType;

  const fname = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const dest = path.join(uploadDir, fname);

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(dest, buffer);

  // URL, доступный из браузера
  return NextResponse.json({ url: `/uploads/${fname}` });
}
