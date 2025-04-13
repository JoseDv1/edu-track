<script lang="ts">
	import { type Grupo } from "@/lib/api";

	interface Props {
		curso: Grupo["cursos"][0];
	}

	let { curso }: Props = $props();
</script>

<a href={`/courses/${curso.id}`}>
	<h3>{curso.nombre}</h3>
</a>

<style>
	a {
		text-decoration: none;
		color: white;
		display: block;
		background-color: var(--color-primary);
		border-radius: 8px;
		overflow: hidden;
		box-shadow: var(--shadow-card);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		border: 1px solid var(--color-border);
		padding: 1rem;

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
			background-color: var(--color-primary-hover);
		}
	}

	h3 {
		margin: 0;
		font-size: 1.2rem;
	}
</style>
