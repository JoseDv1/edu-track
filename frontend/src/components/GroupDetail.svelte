<script lang="ts">
	import { getGroupById } from "@/lib/groups";
	import { type Grupo, type Curso } from "@/lib/api";
	import CourseCard from "./CourseCard.svelte";

	interface Props {
		groupId: string;
	}

	let { groupId }: Props = $props();
</script>

{#await getGroupById(groupId)}
	<div class="loading-container">
		<div class="loader"></div>
		<p>Cargando información del grupo...</p>
	</div>
{:then grupo}
	{#if grupo}
		<div class="group-container">
			<header class="group-header">
				<h1>{grupo.nombre}</h1>
				{#if grupo.padre}
					<p class="group-parent">
						Perten: <a href={`/groups/${grupo.padre.id}`}
							>{grupo.padre.nombre}</a
						>
					</p>
				{/if}
			</header>

			{#if grupo.subgrupos && grupo.subgrupos.length > 0}
				<div class="section">
					<h2>Subgrupos</h2>
					<div class="subgroups-list">
						{#each grupo.subgrupos as subgrupo}
							<a href={`/groups/${subgrupo.id}`} class="subgroup-item">
								{subgrupo.nombre}
							</a>
						{/each}
					</div>
				</div>
			{/if}

			<div class="section">
				<h2>Cursos activos</h2>
				<div class="courses-grid">
					{#each grupo.cursos as curso}
						<CourseCard {curso} />
					{:else}
						<p class="no-courses">
							Este grupo no tiene cursos activos actualmente.
						</p>
					{/each}
				</div>
			</div>
		</div>
	{/if}
{:catch error}
	<div class="error-container">
		<h2>Error</h2>
		<p>{error.message || "Error desconocido"}</p>
		<a href="/groups" class="btn">Volver a grupos</a>
	</div>
{/await}

<style>
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem;
		text-align: center;
	}

	.loader {
		border: 4px solid rgba(0, 0, 0, 0.1);
		border-radius: 50%;
		border-top: 4px solid var(--color-primary);
		width: 40px;
		height: 40px;
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.error-container {
		background-color: var(--color-surface);
		border-radius: 8px;
		padding: 2rem;
		text-align: center;
		box-shadow: var(--shadow-card);
	}

	.group-header {
		margin-bottom: 2rem;
		border-bottom: 1px solid var(--color-border);
		padding-bottom: 1rem;
	}

	h1 {
		color: var(--color-primary);
		margin-bottom: 0.5rem;
	}

	.group-parent {
		font-size: 0.9rem;
		color: var(--color-text-secondary);
	}

	.group-parent a {
		color: var(--color-primary);
		text-decoration: none;
	}

	.group-parent a:hover {
		text-decoration: underline;
	}

	.section {
		margin-bottom: 2rem;
	}

	h2 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
		color: var(--color-text);
	}

	.subgroups-list {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.subgroup-item {
		background-color: var(--color-surface);
		border-radius: 4px;
		padding: 0.75rem 1rem;
		text-decoration: none;
		color: var(--color-text);
		box-shadow: var(--shadow-card);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		border: 1px solid var(--color-border);
	}

	.subgroup-item:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
	}

	.courses-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.btn {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		border-radius: 4px;
		text-decoration: none;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.no-courses {
		background-color: var(--color-surface);
		padding: 2rem;
		text-align: center;
		width: 100%;
		border-radius: 8px;
		color: var(--color-text-secondary);
	}
</style>
