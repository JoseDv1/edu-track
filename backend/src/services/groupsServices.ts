import { z } from "zod";
import { prisma } from "../lib/prisma";


export const createGroupSchema = z.object({
	nombre: z.string().min(1, "El nombre del grupo es requerido"),
	padreId: z.string().optional()
});

type CreateGroupSchema = z.infer<typeof createGroupSchema>;

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

export async function createGroup(data: CreateGroupSchema) {
	return await prisma.grupo.create({ data });
}

export async function deleteGroup(id: string) {
	return await prisma.grupo.delete({ where: { id } });
}





