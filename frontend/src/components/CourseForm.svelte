<script lang="ts">
	import { fetchGroups, groups } from "../lib/groups";
	import { createCourse } from "../lib/courses";
	import GrupoOption from "./GrupoOption.svelte";

	let grupoId = $state(
		new URLSearchParams(window.location.search).get("group") || ""
	);

	// Lista de temas del curso
	let temas = $state([""]);

	// Función para agregar un nuevo campo de tema
	function agregarTema() {
		temas = [...temas, ""];
	}

	// Función para eliminar un tema
	function eliminarTema(index: number) {
		temas = temas.filter((_, i) => i !== index);
	}

	// Función para actualizar un tema
	function actualizarTema(index: number, valor: string) {
		temas = temas.map((tema, i) => (i === index ? valor : tema));
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const nombre = formData.get("nombre") as string;
		const grupoId = formData.get("grupoId") as string;

		// Filtrar temas vacíos
		const temasNoVacios = temas.filter((tema) => tema.trim() !== "");

		if (!nombre || !grupoId) {
			alert("Por favor, completa todos los campos obligatorios.");
			return;
		}

		try {
			await createCourse({
				nombre,
				grupoId,
				temas: temasNoVacios,
			});
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

	<div class="form-group">
		<label>Temas del curso:</label>
		<div class="temas-container">
			{#each temas as tema, index}
				<div class="tema-item">
					<input
						type="text"
						value={tema}
						placeholder="Ingrese un tema"
						class="input tema-input"
						oninput={(e) => actualizarTema(index, e.currentTarget.value)}
					/>
					{#if temas.length > 1}
						<button
							type="button"
							class="btn btn-icon delete"
							onclick={() => eliminarTema(index)}
						>
							✕
						</button>
					{/if}
				</div>
			{/each}
			<button type="button" class="btn add-tema" onclick={agregarTema}>
				+ Agregar tema
			</button>
		</div>
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
		border: 1px solid var(--color-border, #ccc);
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
		background-color: var(--color-button, #f2f2f2);
		color: var(--color-text, #333);
	}

	.btn.primary {
		background-color: var(--color-primary, #4a55a2);
		color: white;
	}

	.temas-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.tema-item {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.tema-input {
		flex: 1;
	}

	.btn-icon {
		padding: 0.4rem 0.7rem;
		border-radius: 50%;
		font-size: 0.8rem;
	}

	.delete {
		background-color: var(--color-error-light, #fee);
		color: var(--color-error, #e55);
	}

	.add-tema {
		align-self: flex-start;
		margin-top: 0.5rem;
		background-color: var(--color-success-light, #f2faf2);
		color: var(--color-success, #4a884a);
	}
</style>
