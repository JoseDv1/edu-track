<script lang="ts">
	import GroupTree from "@/components/GroupTree.svelte";
	import { fetchGroups, groups } from "@/lib/groups";
	import { fetchCourses, courses } from "@/lib/courses";
	import { asideVisible } from "@/lib/uiState";
</script>

<aside class="aside" class:hidden={!$asideVisible}>
	<header>
		<h1>Edu-Track</h1>

		<img src="/favicon.webp" alt="Favicon" />
	</header>

	<nav>
		<!-- Sección de Grupos -->
		<section>
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
		</section>

		<!-- Sección de Cursos -->
		<section>
			<header>
				<h3>Cursos</h3>
				<button
					class="btn-new"
					onclick={() => (window.location.href = "/add-course")}
				>
					Nuevo curso
				</button>
			</header>

			{#await fetchCourses() then _}
				<ul class="course-list">
					{#each $courses.slice(0, 5) as curso}
						<li>
							<a href={`/courses/${curso.id}`}>{curso.nombre}</a>
						</li>
					{/each}
					{#if $courses.length > 5}
						<li class="more-link">
							<a href="/courses">Ver todos los cursos...</a>
						</li>
					{/if}
				</ul>
			{:catch error}
				<p class="error-message">Error al cargar cursos: {error.message}</p>
			{/await}
		</section>
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
		transition:
			transform 0.3s ease-in-out,
			margin-left 0.3s ease-in-out;
	}

	aside.hidden {
		transform: translateX(-100%);
		margin-left: -250px;
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

	img {
		width: 4rem;
		height: 4rem;
		border-radius: 50%;
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

	nav {
		overflow-y: auto;
		max-height: calc(100% - 4rem);
	}

	.error-message {
		color: var(--color-error);
		font-size: 0.875rem;
		padding: 0.5rem;
	}

	.course-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.course-list li {
		padding: 0.25rem 0;
	}

	.course-list a {
		text-decoration: none;
		color: var(--color-text);
		transition: color 0.2s ease;
	}

	.course-list a:hover {
		color: var(--color-primary);
	}

	.more-link {
		font-size: 0.875rem;
		margin-top: 0.5rem;
	}

	.more-link a {
		color: var(--color-text-secondary);
	}

	.new-class-section {
		margin-top: 2rem;
		text-align: center;
	}

	.new-class-btn {
		display: block;
		background-color: var(--color-success);
		color: white;
		text-decoration: none;
		padding: 0.75rem 1rem;
		border-radius: 4px;
		font-weight: 500;
		transition: background-color 0.2s ease;
	}

	.new-class-btn:hover {
		background-color: var(--color-success-light);
		color: var(--color-success);
	}
</style>
