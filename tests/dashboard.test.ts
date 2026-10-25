import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateDashboardStats } from "../src/dashboard.js";
import { renderDashboardHtml } from "../src/dashboard.js";
test("calculates the record count and price range", () => {
    const books = [
        { title: "Book A", price_gbp: 15 },
        { title: "Book B", price_gbp: 7 },
        { title: "Book C", price_gbp: 22 }
    ];

    const report = {
        started_at: "2026-10-24T14:39:37.254Z",
        valid_records: 3,
        invalid_records: 0,
        failed_pages: 0
    };

    const stats = calculateDashboardStats(books, report);

    assert.equal(stats.recordCount, 3);
    assert.equal(stats.lowestPrice, 7);
    assert.equal(stats.highestPrice, 22);
    assert.equal(stats.failures, 0);
});



test("renders dashboard stats as HTML", () => {
    const html = renderDashboardHtml({
        recordCount: 3,
        lowestPrice: 7,
        highestPrice: 22,
        failures: 0,
        lastFresh: "2026-10-24T14:39:37.254Z"
    });

    assert.ok(html.includes("Records collected: 3"));
    assert.ok(html.includes("£7.00 – £22.00"));
    assert.ok(html.includes("Failed pages: 0"));
});
