
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
