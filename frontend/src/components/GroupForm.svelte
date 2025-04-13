<script lang="ts">
	import { createGroup, groups, type CreateGroupData } from "@/lib/groups";
	import GrupoOption from "./GrupoOption.svelte";

	const handleSubmit = async (event: Event) => {
		event.preventDefault();

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const nombre = formData.get("nombre") as string;
		const padreId = formData.get("padreId") as string;

		if (!nombre) {
			alert("El nombre del grupo es obligatorio.");
			return;
		}

		const data: CreateGroupData = {
			nombre,
			padreId: padreId || undefined,
		};

		try {
			await createGroup(data);
			alert("Grupo creado exitosamente.");
			window.location.href = "/";
		} catch (error) {
			console.error("Error al crear el grupo:", error);
			alert("Error al crear el grupo. Por favor, inténtelo de nuevo.");
		}

		form.reset();
	};
</script>

<form onsubmit={handleSubmit}>
	<label for="nombre">Nombre del Grupo *</label>
	<input
		type="text"
		name="nombre"
		id="nombre"
		required
		placeholder="Ingrese el nombre del grupo"
	/>

	<label for="padreId">Grupo Padre (opcional)</label>
	<select id="padreId" name="padreId">
		<option value="">-- Ninguno (Grupo principal) --</option>
		{#each $groups as grupo}
			<GrupoOption {grupo} />
		{/each}
	</select>

	<div class="form-actions">
		<a href="/" class="btn btn-secondary">Cancelar</a>
		<button type="submit" class="btn btn-primary"> Crear Grupo </button>
	</div>
</form>

<style>
	form {
		background-color: var(--color-surface);
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: var(--shadow-card);
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		margin-top: 1rem;
	}

	input,
	select {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 4px;
		font-size: 1rem;
	}

	input:focus,
	select:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 2rem;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 4px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-primary {
		background-color: var(--color-primary);
		color: white;
	}

	.btn-primary:hover {
		background-color: var(--color-primary-hover);
	}

	.btn-secondary {
		background-color: var(--color-bg);
		color: var(--color-text);
		text-decoration: none;
	}

	.btn-secondary:hover {
		background-color: #e5e5e5;
	}

	button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}
</style>
