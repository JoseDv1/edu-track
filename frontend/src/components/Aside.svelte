<script lang="ts">
	import GroupTree from "@/components/GroupTree.svelte";
	import { fetchGroups, groups } from "@/lib/groups";

	const themes = ["light", "dark", "ligth dark"];
	let currentTheme = $state(
		document.documentElement.style.colorScheme ?? "light"
	);

	const toggleTheme = () => {
		const newTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length];
		document.documentElement.style.colorScheme = newTheme;
		currentTheme = newTheme;
	};
</script>

<aside>
	<header>
		<h1>Edu-Track</h1>
		<button onclick={() => toggleTheme()} class="btn-theme">
			{#if currentTheme === "dark"}
				🌙
			{:else if currentTheme === "light"}
				☀️
			{:else}
				💻
			{/if}
		</button>
	</header>

	<nav>
		<header>
			<a href="/groups">
				<h3>Grupos</h3>
			</a>
			<button
				class="btn-new"
				onclick={() => (window.location.href = "/groups/new")}
			>
				Nuevo grupo
			</button>
		</header>

		{#await fetchGroups() then _}
			<GroupTree grupos={$groups} />
		{:catch error}
			<p class="error-message">Error al cargar grupos: {error.message}</p>
		{/await}
	</nav>
</aside>

<style>
	aside {
		position: sticky;
		min-height: 100dvh;
		padding: 1rem;
		min-width: 250px;
		background-color: var(--color-surface);
		box-shadow: var(--shadow-card);
		border-radius: 0 24px 24px 0;
		z-index: 999;
	}

	h1 {
		font-size: 1.5rem;
		color: var(--color-primary);
	}

	aside header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	nav header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1px solid var(--color-border);
		padding-top: 1rem;
	}

	.btn-new {
		background-color: var(--color-primary);
		color: white;
		border: none;
		border-radius: 4px;
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.btn-new:hover {
		background-color: var(--color-primary-hover);
	}

	.btn-theme {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 1.5rem;
	}

	.btn-theme:hover {
		color: var(--color-primary-hover);
	}

	nav {
		overflow-y: auto;
		max-height: calc(100% - 4rem);
	}

	.error-message {
		color: var(--color-error);
		font-size: 0.875rem;
		padding: 0.5rem;
	}
</style>
