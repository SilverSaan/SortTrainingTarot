import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const dir = path.join(process.cwd(), "public/major_arcana");
  const files = fs.readdirSync(dir).filter(file => file.endsWith(".jpg"));

  const cardMap: Record<number, string> = {};
  files.forEach(file => {
    const number = parseInt(file.split(" ")[0], 10);
    if (!isNaN(number)) {
      cardMap[number] = `/major_arcana/${encodeURIComponent(file)}`;
    }
  });

  return NextResponse.json(cardMap);
}