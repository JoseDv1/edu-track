import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import {
	createCourse,
	createCourseSchema,
	deleteCourse,
	findCourseById,
	findCourses,
	updateCourse,
	updateCourseSchema
} from "../services/coursesServices";

export const coursesController = new Hono()
	.get('/', async (c) => {
		const grupoId = c.req.query('grupoId')
		return c.json(await findCourses(grupoId))
	})
	.get('/:id',
		zValidator("param", z.object({ id: z.string() })),
		async (c) => {
			const { id } = c.req.valid("param")
			const course = await findCourseById(id)
			if (!course) {
				return c.json({ error: "Curso no encontrado" }, 404)
			}
			return c.json(course)
		})
	.post('/',
		zValidator("json", createCourseSchema),
		async (c) => {
			const data = c.req.valid("json")
			return c.json(await createCourse(data), 201)
		})
	.put('/:id',
		zValidator("param", z.object({ id: z.string() })),
		zValidator("json", updateCourseSchema),
		async (c) => {
			const { id } = c.req.valid("param")
			const data = c.req.valid("json")
			try {
				const course = await updateCourse(id, data)
				return c.json(course)
			} catch (error) {
				return c.json({ error: "Error al actualizar el curso" }, 400)
			}
		})
	.delete('/:id',
		zValidator("param", z.object({ id: z.string() })),
		async (c) => {
			const { id } = c.req.valid("param")
			try {
				return c.json(await deleteCourse(id))
			} catch (error) {
				return c.json({ error: "Error al eliminar el curso" }, 400)
			}
		})