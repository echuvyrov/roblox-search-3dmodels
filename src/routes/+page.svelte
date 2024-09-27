<!-- src/routes/+page.svelte -->
<script>
	let userInput = '';
	let groupedResults = [];
  
	const handleSearch = async () => {
	  // Step 1: Generate keywords from the user input
	  const keywordResponse = await fetch('/api/generateKeywords', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ userInput }),
	  });
	  const { keywords } = await keywordResponse.json();
	  console.log("keywords", keywords);
  
	  // Step 2: Search Roblox API with the generated keywords
	  const searchResponse = await fetch('/api/searchRoblox', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ keywords }),
	  });

	  const { groupedResults: searchResults } = await searchResponse.json();
	  groupedResults = searchResults;

	  console.log("groupedResults", groupedResults);
	};
  </script>
  
  <main>
	<h1>Search Roblox 3D Models</h1>
  
	<input type="text" bind:value={userInput} placeholder="Describe what you are looking for..." />
	<button on:click={handleSearch}>Search</button>
  
	<section>
	  {#if groupedResults.length > 0}
		{#each groupedResults as group}
		  <!-- Display the keyword in a larger font -->
		  <h2 style="font-size: 1.5em; margin-top: 30px;">Results for keyword: "{group.keyword}"</h2>
  
		  <!-- Display the results for each keyword -->
		  <ul>
			{#each group.results as result}
			  <li>
				<img src={result.ThumbnailUrl} alt={result.Name} />
				<a href={result.AbsoluteUrl} target="_blank">{result.Name}</a>
				<p>{result.Description}</p>
				<p>Creator: <a href={result.CreatorAbsoluteUrl} target="_blank">{result.Creator}</a></p>
			  </li>
			{/each}
		  </ul>
		{/each}
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
  
	h2 {
	  font-size: 1.5em;
	  color: #333;
	}
  </style>
  