<script lang="ts">
	import { fetchGroups, groups } from "@/lib/groups";
	import GroupTableRow from "./GroupTableRow.svelte";
</script>

<div class="manage-groups">
	<h2>Gestión de Grupos</h2>

	{#await fetchGroups()}
		<div class="loading">
			<div class="spinner"></div>
			<p>Cargando grupos...</p>
		</div>
	{:then _}
		<div class="groups-container">
			{#if !$groups || $groups.length === 0}
				<p class="empty-state">
					No hay grupos disponibles. <a href="/groups/new">Crear un grupo</a>
				</p>
			{:else}
				<table>
					<thead>
						<tr>
							<th>Nombre</th>
							<th>Cursos</th>
							<th>Acciones</th>
						</tr>
					</thead>
					<tbody>
						{#each $groups as grupo}
							<GroupTableRow {grupo} level={0} />
						{/each}
					</tbody>
				</table>
			{/if}
		</div>
	{:catch error}
		<div class="error-message">
			<p>
				{error instanceof Error ? error.message : "Error al cargar los grupos"}
			</p>
			<button on:click={() => fetchGroups()}>Reintentar</button>
		</div>
	{/await}
</div>

<style>
	.manage-groups {
		background-color: var(--color-surface);
		border-radius: 8px;
		padding: 1.5rem;
		box-shadow: var(--shadow-card);
	}

	h2 {
		margin-top: 0;
		margin-bottom: 1.5rem;
		color: var(--color-primary);
		border-bottom: 1px solid var(--color-border);
		padding-bottom: 0.5rem;
	}

	.loading,
	.error-message,
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		text-align: center;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid rgba(0, 0, 0, 0.1);
		border-left-color: var(--color-primary);
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	button {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		background-color: var(--color-primary);
		color: white;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s ease;
		margin-top: 1rem;
	}

	button:hover {
		background-color: var(--color-primary-hover);
	}

	.empty-state {
		color: var(--color-text-secondary);
	}

	.empty-state a {
		color: var(--color-primary);
		text-decoration: none;
		font-weight: 500;
	}

	.empty-state a:hover {
		text-decoration: underline;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th {
		text-align: left;
		padding: 0.75rem;
		border-bottom: 2px solid var(--color-border);
		color: var(--color-text-secondary);
		font-weight: 600;
	}

	.error-message {
		color: var(--color-error);
	}

	.manage-groups {
		background-color: var(--color-surface);
		border-radius: 8px;
		padding: 1.5rem;
		box-shadow: var(--shadow-card);
	}

	h2 {
		margin-top: 0;
		margin-bottom: 1.5rem;
		color: var(--color-primary);
		border-bottom: 1px solid var(--color-border);
		padding-bottom: 0.5rem;
	}

	.loading,
	.error-message,
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		text-align: center;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid rgba(0, 0, 0, 0.1);
		border-left-color: var(--color-primary);
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	button {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		background-color: var(--color-primary);
		color: white;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s ease;
		margin-top: 1rem;
	}

	button:hover {
		background-color: var(--color-primary-hover);
	}

	.empty-state {
		color: var(--color-text-secondary);
	}

	.empty-state a {
		color: var(--color-primary);
		text-decoration: none;
		font-weight: 500;
	}

	.empty-state a:hover {
		text-decoration: underline;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th {
		text-align: left;
		padding: 0.75rem;
		border-bottom: 2px solid var(--color-border);
		color: var(--color-text-secondary);
		font-weight: 600;
	}

	.error-message {
		color: var(--color-error);
	}
</style>
