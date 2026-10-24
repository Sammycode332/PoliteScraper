
import { readFile, writeFile } from "node:fs/promises";
import { detectChanges, type BookRecord } from "./change-detection.js";

export async function createChangeReport(
    currentBooks: BookRecord[],
    snapshotPath = "output/books.json",
    reportPath = "output/change-report.json"
) {
    let previousBooks: BookRecord[] = [];
    let hasPreviousSnapshot = false;

    try {
        const previousJson = await readFile(snapshotPath, "utf-8");

        previousBooks = JSON.parse(previousJson) as BookRecord[];
        hasPreviousSnapshot = true;
    } catch (error) {
        if (
            !(error instanceof Error) ||
            !("code" in error) ||
            error.code !== "ENOENT"
        ) {
            throw error;
        }
    }

    const changes = hasPreviousSnapshot
        ? detectChanges(previousBooks, currentBooks)
        : {
            newBooks: [],
            changedBooks: [],
            unchangedCount: 0
        };

    const changeReport = {
        generated_at: new Date().toISOString(),
        baseline: !hasPreviousSnapshot,
        summary: {
            new_books: changes.newBooks.length,
            changed_books: changes.changedBooks.length,
            unchanged_books: changes.unchangedCount
        },
        new_books: changes.newBooks,
        changed_books: changes.changedBooks
    };

    await writeFile(
        reportPath,
        JSON.stringify(changeReport, null, 2),
        "utf-8"
    );

    return changeReport;
}
