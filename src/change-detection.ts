
export type BookRecord = {
    product_url: string;
    [key: string]: unknown;
};

export type BookChange = {
    product_url: string;
    changes: {
        field: string;
        previous: unknown;
        current: unknown;
    }[];
};

export function detectChanges(
    previousBooks: BookRecord[],
    currentBooks: BookRecord[]
) {
    const previousByUrl = new Map(
        previousBooks.map((book) => [book.product_url, book])
    );

    const newBooks: BookRecord[] = [];
    const changedBooks: BookChange[] = [];
    let unchangedCount = 0;

    for (const currentBook of currentBooks) {
        const previousBook = previousByUrl.get(currentBook.product_url);

        if (!previousBook) {
            newBooks.push(currentBook);
            continue;
        }

        const changes: BookChange["changes"] = [];

        for (const field of Object.keys(currentBook)) {
            if (
                field === "fetched_at" ||
                field === "source_page" ||
                field === "product_url"
            ) {
                continue;
            }

            if (previousBook[field] !== currentBook[field]) {
                changes.push({
                    field,
                    previous: previousBook[field],
                    current: currentBook[field]
                });
            }
        }

        if (changes.length > 0) {
            changedBooks.push({
                product_url: currentBook.product_url,
                changes
            });
        } else {
            unchangedCount++;
        }
    }

    return {
        newBooks,
        changedBooks,
        unchangedCount
    };
}
