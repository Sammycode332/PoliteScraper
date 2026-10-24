
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { extractCatalogue } from "../src/catalogue.js";

const fixtureUrl = new URL("./fixtures/catalogue.html", import.meta.url);
const html = await readFile(fixtureUrl, "utf8");

test("extracts book links and the next catalogue page", () => {
    const pageUrl = "https://books.toscrape.com/catalogue/page-1.html";

    const result = extractCatalogue(html, pageUrl);

    assert.deepEqual(result.bookLinks, [
        "https://books.toscrape.com/catalogue/book-one_1/index.html",
        "https://books.toscrape.com/catalogue/book-two_2/index.html"
    ]);

    assert.equal(
        result.nextPageUrl,
        "https://books.toscrape.com/catalogue/page-2.html"
    );
});


test("returns null when there is no next catalogue page", () => {
    const htmlWithoutNext = `
        <article class="product_pod">
            <h3>
                <a href="book-one_1/index.html">Book One</a>
            </h3>
        </article>
    `;

    const result = extractCatalogue(
        htmlWithoutNext,
        "https://books.toscrape.com/catalogue/page-1.html"
    );

    assert.equal(result.nextPageUrl, null);
    assert.deepEqual(result.bookLinks, [
        "https://books.toscrape.com/catalogue/book-one_1/index.html"
    ]);
});
