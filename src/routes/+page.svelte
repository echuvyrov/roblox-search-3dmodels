<!-- src/routes/+page.svelte -->
<script>
	let userInput = "";
	let groupedResults = [];
	let showModal = false; // Controls the display of the modal
	let customPrompt = `Generate a list of 5-10 relevant keywords for the following request below. The results should be only 1 or two words in length, one per line. No dashes, no other leading characters on the line. Return only the keywords, no additional commentary before or after. Here' the request :`;
	let keywordCount = 8;
	let resultsPerKeyword = 25;

	// Function to open the settings modal
	const openSettings = () => {
		showModal = true;
	};

	// Function to submit the search with user input and custom parameters
	const handleSearch = async () => {
		const keywordResponse = await fetch("/api/generateKeywords", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				userInput,
				customPrompt,
				keywordCount,
			}),
		});
		const { keywords } = await keywordResponse.json();

		const searchResponse = await fetch("/api/searchRoblox", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ keywords, resultsPerKeyword }),
		});
		const { groupedResults: searchResults } = await searchResponse.json();
		groupedResults = searchResults;
	};

	// Function to close the modal after saving settings
	const handleSaveSettings = () => {
		showModal = false;
	};
</script>

<main>
	<h1>Search Roblox 3D Models</h1>

	<!-- Button to open settings modal -->
	<div>
		<button on:click={openSettings}>Settings</button>
		<br /><br />
	</div>

	<!-- User input and search button on the same line -->
	<div class="search-bar">
		<input
			type="text"
			bind:value={userInput}
			placeholder="Describe what you are looking for..."
		/>
		<button on:click={handleSearch}>Search</button>
	</div>

	<!-- Search results display -->
	<section>
		{#if groupedResults.length > 0}
			{#each groupedResults as group}
				<h2 style="font-size: 1.5em; margin-top: 30px;">
					Results for keyword: "{group.keyword}"
				</h2>
				<ul>
					{#each group.results as result}
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
			{/each}
		{/if}
	</section>

	<!-- Modal for AI prompt and settings -->
	{#if showModal}
		<div class="modal-backdrop">
			<div class="modal">
				<h2>Customize AI Search Parameters</h2>

				<label for="customPrompt">Custom Prompt:</label>
				<textarea id="customPrompt" bind:value={customPrompt}
				></textarea>

				<label for="keywordCount">Number of keywords:</label>
				<input
					type="number"
					id="keywordCount"
					bind:value={keywordCount}
					min="1"
					max="10"
				/>

				<label for="resultsPerKeyword"
					>Number of results per keyword:</label
				>
				<input
					type="number"
					id="resultsPerKeyword"
					bind:value={resultsPerKeyword}
					min="1"
					max="100"
				/>

				<button on:click={handleSaveSettings}>Save</button>
				<button on:click={() => (showModal = false)}>Cancel</button>
			</div>
		</div>
	{/if}
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

	/* Flexbox to align the input and button on one line */
	.search-bar {
		display: flex;
		gap: 10px; /* Adds space between the input and button */
	}

	/* Make sure the input takes up most of the space */
	.search-bar input {
		flex-grow: 1;
		padding: 10px;
	}

	/* Style the button */
	.search-bar button {
		padding: 10px 20px;
	}

	/* Modal styling */
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.modal {
		background: white;
		padding: 20px;
		border-radius: 8px;
		width: 400px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	textarea {
		width: 100%;
		height: 80px;
		margin-bottom: 10px;
	}

	input {
		width: 100%;
		margin-bottom: 10px;
	}

	button {
		margin-right: 10px;
	}
</style>
