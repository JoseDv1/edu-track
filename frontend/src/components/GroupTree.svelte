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
		margin-left: 1rem;
		gap: 1rem;
	}
</style>
