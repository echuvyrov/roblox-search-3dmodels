// src/routes/api/searchRoblox/+server.js
import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
    const { keyword } = await request.json();

    const results = [];
    console.log('KEYWORD:', keyword.trim());
    
    const response = await fetch(
        `https://search.roblox.com/catalog/json?Category=6&SortType=3&ResultsPerPage=25&Keyword='${keyword.trim()}'`
    );
    const data = await response.json();
    console.log('DATA:', data);
    results.push(...data);

    return json({ results });
};
