import { z } from "zod";
import { prisma } from "../lib/prisma";

export const createCourseSchema = z.object({
	nombre: z.string().min(1, "El nombre del curso es requerido"),
	fecha: z.string(),
	temas: z.array(z.string()).optional().default([]),
	grupoId: z.string().min(1, "El ID del grupo es requerido")
});
export const updateCourseSchema = createCourseSchema.partial();

type CreateCourseSchema = z.infer<typeof createCourseSchema>;
type UpdateCourseSchema = z.infer<typeof updateCourseSchema>;


export async function findCourses(grupoId?: string) {
	const where = grupoId ? { grupoId } : {};
	return await prisma.curso.findMany({
		where,
		include: {
			grupo: true,
			clases: true
		}
	});
}

export async function findCourseById(id: string) {
	return await prisma.curso.findUnique({
		where: { id },
		include: {
			grupo: true,
			clases: true
		}
	});
}

export async function createCourse(data: CreateCourseSchema) {
	const { temas, ...rest } = data;
	return await prisma.curso.create({
		data: {
			...rest,
			temas: temas || []
		},
		include: {
			grupo: true
		}
	});
}

export async function updateCourse(id: string, data: UpdateCourseSchema) {
	const { temas, ...rest } = data;
	const currentCourse = await prisma.curso.findUnique({
		where: { id },
		select: { temas: true }
	});

	return await prisma.curso.update({
		where: { id },
		data: {
			...rest,
			...(temas && { temas })
		},
		include: {
			grupo: true
		}
	});
}

export async function deleteCourse(id: string) {
	return await prisma.curso.delete({ where: { id } });
}