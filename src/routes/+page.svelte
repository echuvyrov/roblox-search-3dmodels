<script>
	import { onMount } from "svelte";
	let userInput = "";
	let results = [];

	const handleSearch = async () => {
		// Step 1: Generate keywords from the user input
		const keywordResponse = await fetch("/api/generateKeywords", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ userInput }),
		});

		console.log("keywordResponse", keywordResponse);
		// Step 2: Search Roblox API with the generated keywords
		//  one keyword at a time (one line)
		var keywordJSON = await keywordResponse.json();
		// convert to string and split by new line
		var keywordText = JSON.stringify(keywordJSON.keywords[0]);
		console.log("keywordText", keywordText);
		const setOfKeywords = keywordText.split("\\n");
		console.log("setOfKeywords", setOfKeywords);

		for (const [index, keyword] of setOfKeywords.entries()) {
			// Remove backslashes and trim any excess whitespace
			const cleanKeyword = keyword.replace(/\\/g, "").trim();
			console.log(`Iterating over Keyword ${index}: ${cleanKeyword}`);

			const searchResponse = await fetch("/api/searchRoblox", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ keyword: cleanKeyword }),
			});

			const { results: searchResults } = await searchResponse.json();
			console.log("searchResults ", searchResults);

			results = results.concat(searchResults);
		}
	};
</script>

<main>
	<h1>Search Roblox 3D Models</h1>

	<input
		type="text"
		bind:value={userInput}
		placeholder="Describe what you are looking for..."
	/>
	<button on:click={handleSearch}>Search</button>

	<section>
		{#if results.length > 0}
			<h2>Search Results:</h2>
			<ul>
				{#each results as result}
					<li>
						<img src={result.ThumbnailUrl} alt={result.Name} />
						<a href={result.AbsoluteUrl} target="_blank"
							>{result.Name}</a
						>
						<p>{result.Description}</p>
						<p>
							Creator: <a
								href={result.CreatorAbsoluteUrl}
								target="_blank">{result.Creator}</a
							>
						</p>
					</li>
				{/each}
			</ul>
		{/if}
	</section>
</main>

<style>
	main {
		padding: 20px;
	}

	input {
		width: 100%;
		padding: 10px;
		margin-bottom: 20px;
	}

	ul {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 20px;
	}

	li {
		list-style: none;
		padding: 10px;
		border: 1px solid #ddd;
	}

	img {
		max-width: 100%;
		height: auto;
	}
</style>
