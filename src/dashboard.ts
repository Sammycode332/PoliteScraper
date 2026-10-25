
type BookRecord = {
    title: string;
    price_gbp: number;
};

type RunReport = {
    started_at: string;
    valid_records: number;
    invalid_records: number;
    failed_pages: number;
};

export function calculateDashboardStats(
    books: BookRecord[],
    report: RunReport
) {
    const prices = books.map((book) => book.price_gbp);

    return {
        recordCount: books.length,
        lowestPrice: prices.length > 0 ? Math.min(...prices) : null,
        highestPrice: prices.length > 0 ? Math.max(...prices) : null,
        failures: report.failed_pages,
        lastFresh: report.started_at
    };
}

export function renderDashboardHtml(
    stats: ReturnType<typeof calculateDashboardStats>
): string {
    const priceRange =
        stats.lowestPrice === null || stats.highestPrice === null
            ? "No prices available"
            : `£${stats.lowestPrice.toFixed(2)} – £${stats.highestPrice.toFixed(2)}`;

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>PoliteScraper Dashboard</title>
        </head>
        <body>
            <h1>PoliteScraper Dashboard</h1>
            <p>Records collected: ${stats.recordCount}</p>
            <p>Price range: ${priceRange}</p>
            <p>Failed pages: ${stats.failures}</p>
            <p>Last run started: ${stats.lastFresh}</p>
        </body>
        </html>
    `;
}
