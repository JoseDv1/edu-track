<script lang="ts">
	import { getCourseById } from "@/lib/courses";
	import { type Curso, type Grupo } from "@/lib/api";

	interface Props {
		courseId: string;
	}

	let { courseId }: Props = $props();
</script>

{#await getCourseById(courseId)}
	<div role="status" class="loading">
		<div aria-hidden="true"></div>
		<p>Cargando información del curso...</p>
	</div>
{:then curso}
	{#if curso}
		<main>
			<header>
				<h1>{curso.nombre}</h1>
				<p>
					Grupo: <a href={`/groups/${curso.grupo.id}`}>{curso.grupo.nombre}</a>
				</p>
				<p>Fecha: {new Date(curso.createdAt).toLocaleDateString("es-ES")}</p>
			</header>

			<section class="temas">
				<h2>Temas</h2>
				<ul>
					{#each typeof curso.temas === "string" ? JSON.parse(curso.temas) : curso.temas as tema}
						<li>{tema}</li>
					{:else}
						<li>Este curso no tiene temas registrados actualmente.</li>
					{/each}
				</ul>
			</section>

			<section class="clases">
				<header>
					<h2>Clases</h2>
					<a href={`/add-class?course=${courseId}`}>Agregar Clase</a>
				</header>
				<div class="clases-grid">
					{#each curso.clases as clase, index}
						<div class="clase-card">
							<h3>{clase.tema + ` - Clase ${index + 1}`}</h3>
							<p>
								Fecha: {new Date(clase.fecha).toLocaleDateString("es-ES")}
							</p>
							<a href={`/classes/${clase.id}`}>Ver detalles</a>
						</div>
					{:else}
						<p>Este curso no tiene clases registradas actualmente.</p>
					{/each}
				</div>
			</section>
		</main>
	{/if}
{:catch error}
	<div>
		<h2>Error</h2>
		<p>{error.message || "Error desconocido"}</p>
		<a href="/courses">Volver a cursos</a>
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
	}

	section {
		margin: 2rem 0;
	}

	section > header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.clases-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1.5rem;

		&:has(> p) {
			grid-template-columns: 1fr;
		}
	}

	.clase-card {
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		background-color: var(--color-bg-secondary);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}

	.clase-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
	}

	.temas ul {
		padding-left: 1.5rem;
		list-style-type: disc;
	}

	a {
		text-decoration: none;
		color: var(--color-primary);
		font-weight: 500;
		transition: color 0.2s;
	}

	a:hover {
		color: var(--color-primary-dark);
		text-decoration: underline;
	}

	a[href^="/add-class"] {
		display: inline-block;
		padding: 0.5rem 1rem;
		background-color: var(--color-primary);
		color: white;
		border-radius: 4px;
		font-weight: 500;
		transition:
			background-color 0.2s,
			transform 0.1s;

		&:hover {
			background-color: var(--color-primary-hover);
			transform: translateY(-2px);
			text-decoration: none;
		}
	}

	.clase-card a {
		display: inline-block;
		margin-top: 0.75rem;
		font-size: 0.9rem;
	}
</style>
