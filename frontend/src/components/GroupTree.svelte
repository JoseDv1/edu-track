<script lang="ts">
	import type { Grupo } from "@/lib/api";
	import GroupTree from "./GroupTree.svelte";

	interface Props {
		grupos: Grupo[];
	}

	let { grupos }: Props = $props();
</script>

<ul>
	{#each grupos as grupo}
		{@const isLastLevel = !grupo.subgrupos || grupo.subgrupos.length === 0}
		<li>
			{#if isLastLevel}
				<a href={`/groups/${grupo.id}`}>
					{grupo.nombre}
				</a>
			{:else}
				<details>
					<summary>
						<a href={`/groups/${grupo.id}`}>
							{grupo.nombre}
						</a>
					</summary>
					{#if grupo.subgrupos && grupo.subgrupos.length > 0}
						<GroupTree grupos={grupo.subgrupos as Grupo[]} />
					{/if}
				</details>
			{/if}
		</li>
	{/each}
</ul>

<style>
	ul {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		list-style-type: none;
	}

	summary {
		list-style: none;
		border-radius: 4px;
		cursor: pointer;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: var(--color-background);
	}

	details::details-content {
		opacity: 0;
		transform: translateY(-10px);
		transition:
			opacity 300ms,
			content-visibility 300ms allow-discrete,
			transform 300ms;
	}

	details[open]::details-content {
		padding: 0.5rem 0 0 0.5rem;
		opacity: 1;
		transform: translateY(0);
	}

	details > summary::after {
		content: "+";
	}

	details[open] > summary::after {
		content: "-";
	}

	a {
		text-decoration: none;
		font-weight: 500;
		color: var(--color-text);
		transition: color 0.2s ease;

		&:hover {
			color: var(--color-primary-hover);
		}
	}
</style>
