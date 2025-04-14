<script lang="ts">
	import { fetchCourses, courses } from "../lib/courses";
	import { createClass } from "../lib/classes";

	let cursoId = $state(
		new URLSearchParams(window.location.search).get("course")
	);

	if (!cursoId) {
		alert("No se ha proporcionado un ID de curso.");
		window.history.back();
	}

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
			cursoId: cursoId!,
		};

		console.log("Datos del formulario:", data);

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
			await createClass(data);
			alert("Clase creada exitosamente.");
			window.location.href = "/courses/" + data.cursoId;
		} catch (error) {
			console.error("Error al crear la clase:", error);
			alert("Error al crear la clase. Por favor, inténtelo de nuevo.");
		}
	}
</script>

<form onsubmit={handleSubmit} class="form">
	<div class="form-group">
		<label for="fecha">Fecha:</label>
		<input
			type="date"
			id="fecha"
			name="fecha"
			required
			class="input"
			value={new Date().toISOString().split("T")[0]}
		/>
	</div>

	<div class="form-group">
		<label for="tema">Tema:</label>
		<input type="text" id="tema" name="tema" required class="input" />
	</div>

	<div class="form-group">
		<label for="preparacion">Preparación:</label>
		<textarea
			id="preparacion"
			name="preparacion"
			required
			class="input textarea"
		></textarea>
	</div>

	<div class="form-group">
		<label for="guion">Guión:</label>
		<textarea id="guion" name="guion" required class="input textarea"
		></textarea>
	</div>

	<div class="form-group">
		<label for="reflexion">Reflexión (opcional):</label>
		<textarea id="reflexion" name="reflexion" class="input textarea"></textarea>
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
			/>
		</div>
	</div>

	<div class="actions">
		<button type="submit" class="btn primary">Guardar clase</button>
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

	.form-row {
		display: flex;
		gap: 1rem;
	}

	.form-row .form-group {
		flex: 1;
	}

	.input {
		padding: 0.6rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
	}

	.textarea {
		min-height: 100px;
		resize: vertical;
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
