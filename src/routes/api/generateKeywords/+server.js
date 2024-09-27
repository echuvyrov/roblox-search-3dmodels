// src/routes/api/generateKeywords/+server.js
import { OPENAI_API_KEY } from '$env/static/private';
import OpenAI from "openai";
const openai = new OpenAI();

import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
    const { userInput } = await request.json();

    const data = await openai.chat.completions.create({
        messages: [{ "role": "system", "content": "You are a creative director with clean, contemporary taste. Use your skills to help properly formulate and guide user query towards finding the correct 3D models for their worlds." },
        { "role": "user", "content": `Generate a list of 5-10 relevant keywords for the following request below. The results should be only 1 or two words in length, one per line. 
            No dashes, no other leading characters on the line. Return only the keywords, no additional commentary before or after. Here' the request : ${userInput}` }],
            model: "gpt-4o-mini",
        });

    const keywords = data.choices[0].message.content.trim().split('\n').map((word) => word.trim());
    return json({ keywords });
};
