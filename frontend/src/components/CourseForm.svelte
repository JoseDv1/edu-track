<script lang="ts">
	import { fetchGroups, groups } from "../lib/groups";
	import { createCourse } from "../lib/courses";
	import GrupoOption from "./GrupoOption.svelte";

	let grupoId = $state(
		new URLSearchParams(window.location.search).get("group") || ""
	);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const nombre = formData.get("nombre") as string;
		const grupoId = formData.get("grupoId") as string;

		if (!nombre || !grupoId) {
			alert("Por favor, completa todos los campos obligatorios.");
			return;
		}

		try {
			await createCourse({ nombre, grupoId });
			alert("Curso creado exitosamente.");
			window.location.href = "/groups/" + grupoId;
		} catch (error) {
			console.error("Error al crear el curso:", error);
			alert("Error al crear el curso. Por favor, inténtelo de nuevo.");
		}
	}
</script>

<form onsubmit={handleSubmit} class="form">
	<div class="form-group">
		<label for="nombre">Nombre del curso:</label>
		<input type="text" id="nombre" name="nombre" required class="input" />
	</div>

	<div class="form-group">
		<label for="grupo">Grupo:</label>
		{#await fetchGroups() then _}
			<select id="grupo" required class="input" name="grupoId">
				<option value="" disabled selected>-- Selecciona un grupo --</option>
				{#each $groups as grupo}
					<GrupoOption {grupo} selected={grupo.id === grupoId} />
				{/each}
			</select>
		{/await}
	</div>

	<div class="actions">
		<button type="submit" class="btn primary">Guardar curso</button>
		<a href="/" class="btn">Cancelar</a>
	</div>
</form>

<style>
	.form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.input {
		padding: 0.6rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
	}

	.actions {
		display: flex;
		gap: 1rem;
		margin-top: 0.5rem;
	}

	.btn {
		padding: 0.6rem 1.2rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
		text-decoration: none;
		text-align: center;
		background-color: #f2f2f2;
		color: #333;
	}

	.btn.primary {
		background-color: #4a55a2;
		color: white;
	}
</style>
