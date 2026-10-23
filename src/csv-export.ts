
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

type Book = {
  title: string;
  product_url: string;
  price_text: string;
  price_gbp: number;
  availability_text: string;
  rating_text: string;
  description: string | null;
  source_page: string;
  fetched_at: string;
};

function escapeCsv(value: unknown): string {
  const text = value == null ? "" : String(value);

  // CSV fields containing commas, quotes, or newlines
  // must be quoted. Internal quotes become doubled.
  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

async function exportBooksToCsv(): Promise<void> {
  const inputPath = resolve("output/books.json");
  const outputPath = resolve("output/books.csv");

  const json = await readFile(inputPath, "utf8");
  const books: Book[] = JSON.parse(json);

  const columns: (keyof Book)[] = [
    "title",
    "product_url",
    "price_text",
    "price_gbp",
    "availability_text",
    "rating_text",
    "description",
    "source_page",
    "fetched_at",
  ];

  const header = columns.join(",");

  const rows = books.map((book) =>
    columns.map((column) => escapeCsv(book[column])).join(",")
  );

  const csv = [header, ...rows].join("\r\n") + "\r\n";

  await writeFile(outputPath, "\uFEFF" + csv, "utf8");

  console.log(`Exported ${books.length} books to ${outputPath}`);
}

exportBooksToCsv().catch((error: unknown) => {
  console.error("CSV export failed:", error);
  process.exitCode = 1;
});
