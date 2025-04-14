<script lang="ts">
	import { type Grupo } from "@/lib/api";
	import GroupDelete from "./GroupDelete.svelte";
	import GroupTableRow from "./GroupTableRow.svelte";

	interface Props {
		grupo: Grupo;
		level?: number;
	}

	let { grupo, level = 0 }: Props = $props();
</script>

<tr>
	<td class="group-name-cell" style="--level: {level}">
		{grupo.nombre}
	</td>
	<td>{grupo.cursos?.length || 0}</td>
	<td class="actions-cell">
		<a href={`/groups/${grupo.id}`} class="btn-view">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				width="16"
				height="16"
				fill="currentColor"
			>
				<path
					d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
				/>
			</svg>
			Ver
		</a>

		<GroupDelete {grupo} />
	</td>
</tr>

{#if grupo.subgrupos && grupo.subgrupos.length > 0}
	{#each grupo.subgrupos as subgrupo}
		<GroupTableRow grupo={subgrupo as Grupo} level={level + 1} />
	{/each}
{/if}

<style>
	.group-name-cell {
		display: flex;
		align-items: center;
		margin-left: calc(1rem * var(--level) + 0.5rem);
	}

	.actions-cell {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		padding: 0.5rem;
	}

	.btn-view {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		text-decoration: none;
		font-size: 0.9rem;
		color: var(--color-text);
		background-color: var(--color-bg);
		border: 1px solid var(--color-border);
		transition: background-color 0.2s ease;

		&:hover {
			background-color: var(--color-bg-hover);
		}
	}
</style>
