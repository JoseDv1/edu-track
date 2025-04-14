<script lang="ts">
	import { deleteGroup } from "@/lib/groups";
	import { type Grupo } from "@/lib/api";

	interface Props {
		grupo: Grupo;
	}

	let { grupo }: Props = $props();

	let showConfirm = $state(false);
	let isDeleting = $state(false);
	let error = $state("");

	function confirmDelete() {
		showConfirm = true;
	}

	function cancelDelete() {
		showConfirm = false;
		error = "";
	}

	async function handleDelete() {
		try {
			isDeleting = true;
			error = "";

			await deleteGroup(grupo.id);
			showConfirm = false;

			// Redirigir a la lista de grupos si estamos viendo el detalle del grupo eliminado
			const currentPath = window.location.pathname;
			if (currentPath.includes(`/groups/${grupo.id}`)) {
				window.location.href = "/groups";
			}
		} catch (err) {
			error = err instanceof Error ? err.message : "Error al eliminar el grupo";
		} finally {
			isDeleting = false;
		}
	}
</script>

{#if showConfirm}
	<div class="confirm-dialog">
		<p>
			¿Estás seguro de que deseas eliminar el grupo <strong
				>{grupo.nombre}</strong
			>?
		</p>

		{#if grupo.subgrupos && grupo.subgrupos.length > 0}
			<p class="error">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					width="16"
					height="16"
					fill="currentColor"
				>
					<path
						d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
					/>
				</svg>
				No se puede eliminar este grupo porque contiene {grupo.subgrupos.length}
				subgrupo{grupo.subgrupos.length !== 1 ? "s" : ""}. Debe eliminar los
				subgrupos primero.
			</p>
		{:else if grupo.cursos && grupo.cursos.length > 0}
			<p class="error">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					width="16"
					height="16"
					fill="currentColor"
				>
					<path
						d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
					/>
				</svg>
				No se puede eliminar este grupo porque contiene {grupo.cursos.length} curso{grupo
					.cursos.length !== 1
					? "s"
					: ""}. Debe mover o eliminar los cursos primero.
			</p>
		{/if}

		<div class="actions">
			<button
				type="button"
				onclick={cancelDelete}
				disabled={isDeleting}
				class="btn-cancel"
			>
				Cancelar
			</button>

			<button
				type="button"
				onclick={handleDelete}
				disabled={isDeleting}
				class="btn-delete"
			>
				{isDeleting ? "Eliminando..." : "Eliminar"}
			</button>
		</div>

		{#if error}
			<p class="error">{error}</p>
		{/if}
	</div>
{:else}
	<button
		type="button"
		onclick={confirmDelete}
		class="btn-delete-small"
		aria-label="Eliminar grupo"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="16"
			height="16"
			fill="currentColor"
		>
			<path
				d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
			/>
		</svg>
		Eliminar
	</button>
{/if}

<style>
	.confirm-dialog {
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		padding: 1rem;
		margin: 1rem 0;
		box-shadow: var(--shadow-card);
		position: absolute;
		z-index: 1000;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	button {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-cancel {
		background-color: var(--color-bg);
		color: var(--color-text);
		border: 1px solid var(--color-border);
	}

	.btn-cancel:hover:not(:disabled) {
		background-color: #e5e5e5;
	}

	.btn-delete {
		background-color: var(--color-error);
		color: white;
	}

	.btn-delete:hover:not(:disabled) {
		background-color: #c0392b;
	}

	.btn-delete-small {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		background-color: transparent;
		color: var(--color-error);
		border: 1px solid var(--color-error);
		padding: 0.25rem 0.5rem;
		font-size: 0.9rem;
	}

	.btn-delete-small:hover {
		background-color: rgba(231, 76, 60, 0.1);
	}

	.error {
		color: var(--color-error);
		font-size: 0.9rem;
		margin: 0.5rem 0 0 0;
	}
</style>
