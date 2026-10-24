
import { test } from "node:test";
import assert from "node:assert/strict";
import { detectChanges } from "../src/change-detection.js";

test("detects a new book", () => {
    const previousBooks = [
        {
            product_url: "/book-a",
            title: "Book A",
            price_gbp: 20
        }
    ];

    const currentBooks = [
        {
            product_url: "/book-a",
            title: "Book A",
            price_gbp: 20
        },
        {
            product_url: "/book-b",
            title: "Book B",
            price_gbp: 12.5
        }
    ];

    const result = detectChanges(previousBooks, currentBooks);

    assert.equal(result.newBooks.length, 1);
    assert.equal(result.newBooks[0].product_url, "/book-b");
    assert.equal(result.changedBooks.length, 0);
    assert.equal(result.unchangedCount, 1);
});

test("detects a changed price", () => {
    const previousBooks = [
        {
            product_url: "/book-a",
            title: "Book A",
            price_gbp: 20
        }
    ];

    const currentBooks = [
        {
            product_url: "/book-a",
            title: "Book A",
            price_gbp: 18.5
        }
    ];

    const result = detectChanges(previousBooks, currentBooks);

    assert.equal(result.changedBooks.length, 1);
    assert.equal(result.changedBooks[0].product_url, "/book-a");

    assert.deepEqual(result.changedBooks[0].changes, [
        {
            field: "price_gbp",
            previous: 20,
            current: 18.5
        }
    ]);

    assert.equal(result.newBooks.length, 0);
    assert.equal(result.unchangedCount, 0);
});

test("counts an unchanged book", () => {
    const previousBooks = [
        {
            product_url: "/book-a",
            title: "Book A",
            price_gbp: 20
        }
    ];

    const currentBooks = [
        {
            product_url: "/book-a",
            title: "Book A",
            price_gbp: 20
        }
    ];

    const result = detectChanges(previousBooks, currentBooks);

    assert.equal(result.newBooks.length, 0);
    assert.equal(result.changedBooks.length, 0);
    assert.equal(result.unchangedCount, 1);
});

test("ignores metadata-only changes", () => {
    const previousBooks = [
        {
            product_url: "/book-a",
            title: "Book A",
            price_gbp: 20,
            fetched_at: "2026-10-23T10:00:00Z",
            source_page: "/catalogue/page-1"
        }
    ];

    const currentBooks = [
        {
            product_url: "/book-a",
            title: "Book A",
            price_gbp: 20,
            fetched_at: "2026-10-24T10:00:00Z",
            source_page: "/catalogue/page-2"
        }
    ];

    const result = detectChanges(previousBooks, currentBooks);

    assert.equal(result.changedBooks.length, 0);
    assert.equal(result.unchangedCount, 1);
});

test("detects multiple changed fields on one book", () => {
    const previousBooks = [
        {
            product_url: "/book-a",
            title: "Book A",
            price_gbp: 20,
            rating_text: "Three"
        }
    ];

    const currentBooks = [
        {
            product_url: "/book-a",
            title: "Book A",
            price_gbp: 18.5,
            rating_text: "Four"
        }
    ];

    const result = detectChanges(previousBooks, currentBooks);

    assert.equal(result.changedBooks.length, 1);
    assert.equal(result.changedBooks[0].changes.length, 2);

    assert.deepEqual(result.changedBooks[0].changes, [
        {
            field: "price_gbp",
            previous: 20,
            current: 18.5
        },
        {
            field: "rating_text",
            previous: "Three",
            current: "Four"
        }
    ]);
});
