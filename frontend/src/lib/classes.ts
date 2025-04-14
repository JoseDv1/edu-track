import { writable } from "svelte/store";
import { apiTypes, type Clase } from "./api";


export const classes = writable<Clase[]>();
export const fetchClasses = async (cursoId?: string) => {
	const response = await apiTypes.api.classes.$get(
		cursoId ? { query: cursoId } : undefined
	);

	if (!response.ok) {
		throw new Error("Error al obtener las clases");
	}

	const data = await response.json();
	classes.set(data);

	return data;
}

export const getClassById = async (id: string) => {
	const response = await apiTypes.api.classes[":id"].$get({
		param: { id }
	});

	if (!response.ok) {
		throw new Error("Error al obtener la clase");
	}

	return await response.json();
}

export interface CreateClaseData {
	fecha: string | Date; // Aceptamos ambos tipos para flexibilidad
	preparacion: string;
	tema: string;
	guion: string;
	reflexion?: string;
	duracion?: number;
	asistentes?: number;
	cursoId: string;
}

export const createClass = async (data: CreateClaseData) => {
	// Ensure fecha is a Date object before sending to the API
	const processedData = {
		...data,
		fecha: data.fecha instanceof Date ? data.fecha : new Date(data.fecha)
	};

	const response = await apiTypes.api.classes.$post({
		json: processedData,
	});

	await fetchClasses();
	return await response.json();
}

export interface UpdateClaseData {
	fecha?: string | Date;
	preparacion?: string;
	tema?: string;
	guion?: string;
	reflexion?: string;
	duracion?: number;
	asistentes?: number;
	cursoId?: string;
}

export const updateClass = async (id: string, data: UpdateClaseData) => {
	// Process data to ensure fecha is a Date object if provided
	const processedData = {
		...data,
		fecha: data.fecha instanceof Date ? data.fecha : data.fecha ? new Date(data.fecha) : undefined
	};

	const response = await apiTypes.api.classes[":id"].$put({
		param: { id },
		json: processedData
	});

	await fetchClasses();
	return await response.json();
}

export const deleteClass = async (id: string) => {
	const response = await apiTypes.api.classes[":id"].$delete({
		param: { id }
	});

	await fetchClasses();
	return await response.json();
}
