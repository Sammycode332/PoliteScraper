import { readFile, writeFile } from "node:fs/promises";
import {
    calculateDashboardStats,
    renderDashboardHtml
} from "./dashboard.js";

const booksJson = await readFile("output/books.json", "utf-8");
const reportJson = await readFile("output/run-report.json", "utf-8");

const books = JSON.parse(booksJson);
const report = JSON.parse(reportJson);

const stats = calculateDashboardStats(books, report);
const html = renderDashboardHtml(stats);

await writeFile("output/dashboard.html", html, "utf-8");

console.log("Dashboard generated: output/dashboard.html");