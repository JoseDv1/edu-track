import { writable } from "svelte/store";
import { type Curso, apiTypes } from "./api";

export const courses = writable<Curso[]>();

export const fetchCourses = async () => {
	const response = await apiTypes.api.courses.$get();
	if (!response.ok) {
		throw new Error("Error al obtener los cursos");
	}
	const data = await response.json();
	courses.set(data);

	return data;
}

export const getCourseById = async (id: string) => {
	const response = await apiTypes.api.courses[":id"].$get({
		param: { id }
	});

	if (!response.ok) {
		throw new Error("Error al obtener el curso");
	}

	return await response.json();
}

export interface CreateCourseData {
	nombre: string;
	grupoId: string;
	fecha?: string;
	temas?: string[];
}

export const createCourse = async (data: CreateCourseData) => {
	const response = await apiTypes.api.courses.$post({
		json: data,
	});

	await fetchCourses();
	return await response.json();
}

export interface UpdateCourseData {
	nombre?: string;
	grupoId?: string;
	fecha?: string;
	temas?: string[];
}

export const updateCourse = async (id: string, data: UpdateCourseData) => {
	const response = await apiTypes.api.courses[":id"].$put({
		param: { id },
		json: data
	});



	await fetchCourses();
	return await response.json();
}

export const deleteCourse = async (id: string) => {
	const response = await apiTypes.api.courses[":id"].$delete({
		param: { id }
	});

	await fetchCourses();
	return await response.json();
}
