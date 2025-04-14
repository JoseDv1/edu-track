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
	<div role="status" class="loading">
		<div aria-hidden="true"></div>
		<p>Cargando información del grupo...</p>
	</div>
{:then grupo}
	{#if grupo}
		<main>
			<header>
				<h1>{grupo.nombre}</h1>
				{#if grupo.padre}
					<p>
						Pertenece a: <a href={`/groups/${grupo.padre.id}`}
							>{grupo.padre.nombre}</a
						>
					</p>
				{/if}
			</header>

			{#if grupo.subgrupos && grupo.subgrupos.length > 0}
				<section class="subgrupos">
					<h2>Subgrupos</h2>
					<nav>
						{#each grupo.subgrupos as subgrupo}
							<a href={`/groups/${subgrupo.id}`}>
								<span>
									<img src="/icons/chevron.svg" alt="Ver subgrupo" />
								</span>
								<span>{subgrupo.nombre}</span>
							</a>
						{/each}
					</nav>
				</section>
			{/if}

			<section class="cursos">
				<header>
					<h2>Cursos activos</h2>
					<a href={`/add-course?group=${groupId}`}>Agregar Curso</a>
				</header>
				<div>
					{#each grupo.cursos as curso}
						<CourseCard {curso} />
					{:else}
						<p>Este grupo no tiene cursos activos actualmente.</p>
					{/each}
				</div>
			</section>
		</main>
	{/if}
{:catch error}
	<div>
		<h2>Error</h2>
		<p>{error.message || "Error desconocido"}</p>
		<a href="/groups">Volver a grupos</a>
	</div>
{/await}

<style>
	div[role="status"].loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem;
		text-align: center;

		div {
			border: 4px solid rgba(0, 0, 0, 0.1);
			border-radius: 50%;
			border-top: 4px solid var(--color-primary);
			width: 40px;
			height: 40px;
			animation: spin 1s linear infinite;
			margin-bottom: 1rem;
		}
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	main > header {
		margin-bottom: 2rem;
		border-bottom: 1px solid var(--color-border);
		padding-bottom: 1rem;

		h1 {
			color: var(--color-primary);
			margin-bottom: 0.5rem;
		}

		p {
			font-size: 0.9rem;
			color: var(--color-text-secondary);

			a {
				color: var(--color-primary);
				text-decoration: none;

				&:hover {
					text-decoration: underline;
				}
			}
		}
	}

	main section {
		margin-bottom: 2rem;

		h2 {
			font-size: 1.5rem;
			margin-bottom: 1rem;
			color: var(--color-text);
		}
	}

	.subgrupos {
		border-radius: 8px;

		nav {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
			gap: 1rem;
			margin-bottom: 2rem;

			a {
				background-color: var(--color-surface);
				border-radius: 6px;
				padding: 0.75rem 1rem;
				text-decoration: none;
				color: var(--color-text);
				box-shadow: var(--shadow-card);
				transition:
					transform 0.2s ease,
					box-shadow 0.2s ease,
					background-color 0.2s ease;
				border: 1px solid var(--color-border);
				display: flex;
				align-items: center;

				span:first-child {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 24px;
					height: 24px;
					margin-right: 0.75rem;
					opacity: 0.7;
					transition: opacity 0.2s;

					img {
						width: 16px;
						height: 16px;
						filter: var(
							--color-primary-filter,
							brightness(0) saturate(100%) hue-rotate(190deg)
						);
					}
				}

				span:last-child {
					font-weight: 500;
				}

				&:hover {
					transform: translateY(-2px);
					box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
					background-color: var(--color-primary);
					color: white;
					border-color: var(--color-primary);

					span:first-child {
						opacity: 1;

						img {
							filter: brightness(0) invert(1);
						}
					}
				}
			}
		}
	}

	.cursos div {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.5rem;

		&:has(> p) {
			grid-template-columns: 1fr;
		}

		p {
			background-color: var(--color-surface);
			padding: 2rem;
			text-align: center;
			width: 100%;
			border-radius: 8px;
			color: var(--color-text-secondary);
		}
	}

	.cursos header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;

		h2 {
			margin: 0;
			font-size: 1.5rem;
			color: var(--color-text);
		}

		a {
			background-color: var(--color-primary);
			color: white;
			padding: 0.5rem 1rem;
			border-radius: 4px;
			text-decoration: none;
			font-weight: 500;
			transition: background-color 0.2s ease;

			&:hover {
				background-color: var(--color-primary-hover);
			}
		}
	}
</style>
