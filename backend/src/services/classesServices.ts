import { z } from "zod";
import { prisma } from "../lib/prisma";

export const createClassSchema = z.object({
	fecha: z.coerce.date().default(() => new Date()),
	preparacion: z.string().min(1, "La preparación es requerida"),
	tema: z.string().min(1, "El tema es requerido"),
	guion: z.string().min(1, "El guión es requerido"),
	reflexion: z.string().optional(),
	duracion: z.number().optional(),
	asistentes: z.number().optional(),
	cursoId: z.string().min(1, "El ID del curso es requerido")
});

type CreateClassSchema = z.infer<typeof createClassSchema>;

export const updateClassSchema = createClassSchema.partial();
type UpdateClassSchema = z.infer<typeof updateClassSchema>;

export async function findClasses(cursoId?: string) {
	const where = cursoId ? { cursoId } : {};
	return await prisma.clase.findMany({
		where,
		include: {
			curso: true
		},
		orderBy: {
			fecha: 'desc'
		}
	});
}

export async function findClassById(id: string) {
	return await prisma.clase.findUnique({
		where: { id },
		include: {
			curso: true
		}
	});
}

export async function createClass(data: CreateClassSchema) {
	return await prisma.clase.create({
		data,
		include: {
			curso: true
		}
	});
}

export async function updateClass(id: string, data: UpdateClassSchema) {
	return await prisma.clase.update({
		where: { id },
		data,
		include: {
			curso: true
		}
	});
}

export async function deleteClass(id: string) {
	return await prisma.clase.delete({ where: { id } });
}