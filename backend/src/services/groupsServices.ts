import { z } from "zod";
import { prisma } from "../lib/prisma";


export const createGroupSchema = z.object({
	nombre: z.string().min(1, "El nombre del grupo es requerido"),
	padreId: z.string().optional()
});
export const updateGroupSchema = createGroupSchema.partial();

type CreateGroupSchema = z.infer<typeof createGroupSchema>;
type UpdateGroupSchema = z.infer<typeof updateGroupSchema>;


export async function findGroups() {
	const groups = await prisma.grupo.findMany({
		where: { padreId: null },
		include: {
			cursos: true,
			padre: true,
			subgrupos: true
		}
	});
	return groups;
}

export async function findGroupById(id: string) {
	return await prisma.grupo.findUnique({
		where: { id },
		include: {
			cursos: true,
			padre: true,
			subgrupos: true
		}
	});
}

export async function createGroup(data: CreateGroupSchema) {
	return await prisma.grupo.create({
		data,
		include: {
			padre: true
		}
	});
}

export async function updateGroup(id: string, data: UpdateGroupSchema) {
	return await prisma.grupo.update({
		where: { id },
		data,
		include: {
			padre: true
		}
	});
}

export async function deleteGroup(id: string) {
	return await prisma.grupo.delete({ where: { id } });
}





