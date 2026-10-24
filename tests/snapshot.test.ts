
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createChangeReport } from "../src/snapshot.js";

test("creates a baseline when no previous snapshot exists", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "politescraper-"));

    try {
        const snapshotPath = join(tempDir, "books.json");
        const reportPath = join(tempDir, "change-report.json");

        const report = await createChangeReport(
            [
                {
                    product_url: "/book-a",
                    title: "Book A",
                    price_gbp: 20
                }
            ],
            snapshotPath,
            reportPath
        );

        assert.equal(report.baseline, true);
        assert.deepEqual(report.summary, {
            new_books: 0,
            changed_books: 0,
            unchanged_books: 0
        });

        const savedReport = JSON.parse(
            await readFile(reportPath, "utf-8")
        );

        assert.equal(savedReport.baseline, true);
    } finally {
        await rm(tempDir, { recursive: true, force: true });
    }
});

test("rejects a malformed previous snapshot", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "politescraper-"));

    try {
        const snapshotPath = join(tempDir, "books.json");
        const reportPath = join(tempDir, "change-report.json");

        await writeFile(snapshotPath, "{ invalid json", "utf-8");

        await assert.rejects(
            createChangeReport([], snapshotPath, reportPath),
            SyntaxError
        );
    } finally {
        await rm(tempDir, { recursive: true, force: true });
    }
});
