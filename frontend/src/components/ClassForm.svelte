<script lang="ts">
	import { fetchCourses, courses } from "../lib/courses";
	import { createClass, getClassById, updateClass } from "../lib/classes";
	import SvelteMarkdown from "svelte-markdown";
	import { asideVisible } from "../lib/uiState";

	interface Props {
		classId?: string; // ID de clase para edición (opcional)
	}

	// Determinar si estamos en modo edición o creación
	let { classId }: Props = $props();
	let isEditMode = $derived(!!classId);
	let isLoading = $state(false);

	// Variables para almacenar el contenido de los campos markdown
	let preparacion = $state("");
	let tema = $state("");
	let guion = $state("");
	let reflexion = $state("");
	let fecha = $state(new Date().toISOString().split("T")[0]);
	let duracion = $state<number | undefined>(undefined);
	let asistentes = $state<number | undefined>(undefined);
	let cursoId = $state<string | undefined>(
		new URLSearchParams(window.location.search).get("course") || undefined
	);

	// Variable para controlar qué campo se está editando actualmente
	let campoActual = $state("preparacion");

	// Variable para controlar si se muestra la vista previa
	let mostrarVistaPrevia = $state(false);

	// Cargar datos de la clase si estamos en modo edición
	$effect(() => {
		if (isEditMode && classId) {
			loadClassData();
		}
	});

	// Función para cargar los datos de la clase existente
	async function loadClassData() {
		try {
			isLoading = true;
			const clase = await getClassById(classId!);

			if (!clase) {
				alert("No se encontró la clase solicitada.");
				window.history.back();
				return;
			}

			// Llenar el formulario con los datos de la clase
			tema = clase.tema;
			preparacion = clase.preparacion;
			guion = clase.guion;
			reflexion = clase.reflexion || "";
			fecha = new Date(clase.fecha).toISOString().split("T")[0];
			duracion = clase.duracion ?? undefined;
			asistentes = clase.asistentes ?? undefined;
			cursoId = clase.cursoId;
		} catch (error) {
			console.error("Error al cargar la clase:", error);
			alert("Error al cargar los datos de la clase.");
		} finally {
			isLoading = false;
		}
	}

	// Función para actualizar el campo actual y mostrar la vista previa
	function actualizarCampoActual(campo: string) {
		campoActual = campo;
		mostrarVistaPrevia = true;
		asideVisible.set(false); // Ocultar el aside cuando se muestra la vista previa
	}

	// Función para ocultar la vista previa
	function ocultarVistaPrevia() {
		mostrarVistaPrevia = false;
		asideVisible.set(true); // Mostrar el aside cuando se oculta la vista previa
	}

	// Función para obtener el contenido del campo actual
	function obtenerContenidoCampoActual() {
		switch (campoActual) {
			case "preparacion":
				return preparacion;
			case "guion":
				return guion;
			case "reflexion":
				return reflexion;
			default:
				return "";
		}
	}

	// Verificar que hay un curso seleccionado para modo creación
	$effect(() => {
		if (!isEditMode && !cursoId) {
			alert("No se ha proporcionado un ID de curso.");
			window.history.back();
		}
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		const data = {
			fecha: new Date(formData.get("fecha") as string),
			preparacion: formData.get("preparacion") as string,
			tema: formData.get("tema") as string,
			guion: formData.get("guion") as string,
			reflexion: (formData.get("reflexion") as string) || undefined,
			duracion: formData.get("duracion")
				? Number(formData.get("duracion"))
				: undefined,
			asistentes: formData.get("asistentes")
				? Number(formData.get("asistentes"))
				: undefined,
			cursoId: formData.get("cursoId") as string,
		};

		if (
			!data.tema ||
			!data.preparacion ||
			!data.guion ||
			!data.cursoId ||
			!data.fecha
		) {
			alert("Por favor, completa todos los campos obligatorios.");
			return;
		}

		try {
			if (isEditMode) {
				// Actualizar clase existente
				await updateClass(classId!, data);
				alert("Clase actualizada exitosamente.");
			} else {
				// Crear nueva clase
				await createClass(data);
				alert("Clase creada exitosamente.");
			}
			window.location.href = "/courses/" + data.cursoId;
		} catch (error) {
			console.error(
				`Error al ${isEditMode ? "actualizar" : "crear"} la clase:`,
				error
			);
			alert(
				`Error al ${isEditMode ? "actualizar" : "crear"} la clase. Por favor, inténtelo de nuevo.`
			);
		}
	}
</script>

<form
	onsubmit={handleSubmit}
	class="form-container"
	class:with-preview={mostrarVistaPrevia}
>
	{#if isLoading}
		<div class="loading">
			<p>Cargando datos de la clase...</p>
		</div>
	{:else}
		<div class="form-section">
			<div class="form">
				<div class="form-group">
					<label for="fecha">Fecha:</label>
					<input
						type="date"
						id="fecha"
						name="fecha"
						required
						class="input"
						bind:value={fecha}
					/>
				</div>

				{#if isEditMode}
					<!-- En modo edición, mostramos el selector de curso sin deshabilitarlo -->
					<div class="form-group">
						<label for="cursoId">Curso:</label>
						{#await fetchCourses() then _}
							<select
								id="cursoId"
								name="cursoId"
								required
								class="input"
								bind:value={cursoId}
							>
								<option value="" disabled>Selecciona un curso</option>
								{#each $courses as curso}
									<option value={curso.id} selected={curso.id === cursoId}
										>{curso.nombre}</option
									>
								{/each}
							</select>
						{/await}
					</div>
				{:else}
					<!-- En modo creación, el curso viene por parámetro de URL y no se puede cambiar -->
					<input type="hidden" name="cursoId" value={cursoId} />
				{/if}

				<div class="form-group">
					<label for="tema">Tema:</label>
					<input
						type="text"
						id="tema"
						name="tema"
						required
						class="input"
						bind:value={tema}
					/>
				</div>

				<div class="form-group">
					<label for="preparacion">Preparación:</label>
					<textarea
						id="preparacion"
						name="preparacion"
						required
						class="input textarea"
						bind:value={preparacion}
						onfocus={() => actualizarCampoActual("preparacion")}
						onblur={ocultarVistaPrevia}
					></textarea>
				</div>

				<div class="form-group">
					<label for="guion">Guión:</label>
					<textarea
						id="guion"
						name="guion"
						required
						class="input textarea"
						bind:value={guion}
						onfocus={() => actualizarCampoActual("guion")}
						onblur={ocultarVistaPrevia}
					></textarea>
				</div>

				<div class="form-group">
					<label for="reflexion">Reflexión (opcional):</label>
					<textarea
						id="reflexion"
						name="reflexion"
						class="input textarea"
						bind:value={reflexion}
						onfocus={() => actualizarCampoActual("reflexion")}
						onblur={ocultarVistaPrevia}
					></textarea>
				</div>

				<div class="form-row">
					<div class="form-group">
						<label for="duracion">Duración (minutos):</label>
						<input
							type="number"
							id="duracion"
							name="duracion"
							class="input"
							min="1"
							bind:value={duracion}
						/>
					</div>

					<div class="form-group">
						<label for="asistentes">Número de asistentes:</label>
						<input
							type="number"
							id="asistentes"
							name="asistentes"
							class="input"
							min="0"
							bind:value={asistentes}
						/>
					</div>
				</div>

				<div class="actions">
					<button type="submit" class="btn primary">
						{isEditMode ? "Actualizar clase" : "Guardar clase"}
					</button>
					<a
						href={isEditMode && cursoId ? `/courses/${cursoId}` : "/"}
						class="btn"
					>
						Cancelar
					</a>
				</div>
			</div>
		</div>

		{#if mostrarVistaPrevia}
			<div class="preview-section">
				<div class="preview-header">
					<h3>Vista previa de {campoActual}</h3>
				</div>
				<div class="preview-content">
					<SvelteMarkdown source={obtenerContenidoCampoActual()} />
				</div>
			</div>
		{/if}
	{/if}
</form>

<style>
	.form-container {
		display: flex;
		position: relative;
		width: 100%;
		transition: all 0.3s ease;
	}

	.form-section {
		flex: 1;
		max-width: 47%; /* Ancho ajustado para evitar solapamiento */
		transition: all 0.3s ease;
		padding: 0 1rem;
	}

	.form-container.with-preview .form-section {
		margin-left: 0;
	}

	.preview-section {
		position: fixed;
		right: 0;
		top: 0;
		width: 50%;
		height: 100vh;
		z-index: 100;
	}

	.preview-section {
		position: fixed;
		right: 0;
		top: 0;
		width: 50%;
		height: 100vh;
		border-left: 1px solid #ccc;
		background-color: #f9f9f9;
		display: flex;
		flex-direction: column;
		z-index: 100;
		box-shadow: -4px 0px 10px rgba(0, 0, 0, 0.1);
		padding-top: 2rem; /* Dar espacio superior para alinearse mejor con el contenido */
	}

	.preview-header {
		padding: 0.75rem;
		background-color: #eaeaea;
		border-bottom: 1px solid #ccc;
	}

	.preview-header h3 {
		margin: 0;
		font-size: 1rem;
		color: #555;
		text-transform: capitalize;
	}

	.preview-content {
		padding: 1rem;
		overflow-y: auto;
		overflow-x: hidden;
		flex: 1;
		max-width: 100%;
	}

	.preview-content :global(*) {
		word-wrap: break-word;
		overflow-wrap: break-word;
		max-width: 100%;
		white-space: normal;
	}

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

	.form-row {
		display: flex;
		gap: 1rem;
	}

	.form-row .form-group {
		flex: 1;
	}

	.input {
		padding: 0.6rem;
		border: 1px solid var(--color-border, #ccc);
		border-radius: 4px;
		font-size: 1rem;
	}

	.textarea {
		min-height: 8rem;
		resize: vertical;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 1rem;
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
		background-color: var(--color-primary, #4a90e2);
		color: white;
	}

	/* Estilos para el contenido markdown renderizado */
	.preview-content :global(h1),
	.preview-content :global(h2),
	.preview-content :global(h3),
	.preview-content :global(h4),
	.preview-content :global(h5),
	.preview-content :global(h6) {
		margin-top: 0.5em;
		margin-bottom: 0.5em;
	}

	.preview-content :global(p) {
		margin-bottom: 1em;
	}

	.preview-content :global(ul),
	.preview-content :global(ol) {
		margin-left: 2em;
		margin-bottom: 1em;
	}

	.preview-content :global(code) {
		background-color: #eee;
		padding: 0.2em 0.4em;
		border-radius: 3px;
		font-family: monospace;
	}

	.preview-content :global(pre) {
		background-color: #eee;
		padding: 1em;
		border-radius: 4px;
		overflow-x: auto;
		margin-bottom: 1em;
	}

	.preview-content :global(blockquote) {
		border-left: 4px solid #ccc;
		padding-left: 1em;
		margin-left: 0;
		margin-right: 0;
		font-style: italic;
	}

	.preview-content :global(table) {
		border-collapse: collapse;
		width: 100%;
		margin-bottom: 1em;
	}

	.preview-content :global(th),
	.preview-content :global(td) {
		border: 1px solid #ccc;
		padding: 0.5em;
	}
</style>
