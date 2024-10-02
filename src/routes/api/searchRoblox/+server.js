// src/routes/api/searchRoblox/+server.js
import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
  const { keywords, resultsPerKeyword } = await request.json();

  console.log("Keywords, results per keyword...", keywords, resultsPerKeyword);

  const results = keywords.map(async (keyword) => {
    const response = await fetch(
      `https://search.roblox.com/catalog/json?Category=6&SortType=3&ResultsPerPage=${resultsPerKeyword}&Keyword=${keyword}`
    );
    const data = await response.json();
    return {
      keyword,
      results: data
    };
  });

  // Await all search requests
  const groupedResults = await Promise.all(results);

  return json({ groupedResults });
};
