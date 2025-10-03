// util.ts
import fs from "fs";
import path from "path";

/**
 * Returns a map of card number -> image subpath.
 * Reads files from public/major_arcana folder.
 */
export function getCardMap(): Record<number, string> {
  const dir = path.join(process.cwd(), "public/major_arcana");

  // Read all .tif files
  const files = fs.readdirSync(dir).filter(file => file.endsWith(".tif"));

  // Build map
  const cardMap: Record<number, string> = {};
  files.forEach(file => {
    // Extract leading number from filename
    const number = parseInt(file.split(" ")[0], 10);
    if (!isNaN(number)) {
      cardMap[number] = `/major_arcana/${file}`;
    }
  });

  return cardMap;
}
