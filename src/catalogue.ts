import * as cheerio from "cheerio";

export function extractCatalogue(html: string, pageUrl: string) {
    const $ = cheerio.load(html);
    const bookLinks: string[] = [];

    $("article.product_pod h3 a").each((index, element) => {
        const href = $(element).attr("href");

        if (href) {
            const absoluteUrl = new URL(href, pageUrl).href;
            bookLinks.push(absoluteUrl);
        }
    });

    const nextHref = $("li.next a").attr("href");

    const nextPageUrl = nextHref
        ? new URL(nextHref, pageUrl).href
        : null;

    return { bookLinks, nextPageUrl };
}
