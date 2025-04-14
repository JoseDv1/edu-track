import { writable } from "svelte/store";
import { type Grupo, apiTypes } from "./api";

export const groups = writable<Grupo[]>();

export const fetchGroups = async () => {
	const response = await apiTypes.api.groups.$get();
	if (!response.ok) {
		throw new Error("Failed to fetch groups");
	}
	const data = await response.json();
	groups.set(data);

	return data;
}

export const getGroupById = async (id: string) => {
	const response = await apiTypes.api.groups[":id"].$get({
		param: { id }
	});

	if (!response.ok) {
		throw new Error("Failed to fetch group");
	}

	return await response.json();
}

export interface CreateGroupData {
	nombre: string;
	padreId?: string;
}

export const createGroup = async (data: CreateGroupData) => {
	await apiTypes.api.groups.$post({
		json: data,
	})
	await fetchGroups();
}

export interface UpdateGroupData {
	nombre?: string;
	padreId?: string;
}

export const updateGroup = async (id: string, data: UpdateGroupData) => {
	const response = await apiTypes.api.groups[":id"].$put({
		param: { id },
		json: data
	});

	await fetchGroups();
	return await response.json();
}

export const deleteGroup = async (id: string) => {
	const response = await apiTypes.api.groups[":id"].$delete({
		param: { id }
	});

	await fetchGroups();
	return await response.json();
}
