<script>
	export let grupo;
	export let indent = 0;
	export let selected = false;
</script>

<option value={grupo.id} name="padreId" {selected}>
	{indent === 0 ? "" : "—>".repeat(indent)}
	{grupo.nombre}
</option>

{#if grupo.subgrupos && grupo.subgrupos.length > 0}
	{#each grupo.subgrupos as subgrupo}
		<svelte:self grupo={subgrupo} indent={indent + 1} />
	{/each}
{/if}
