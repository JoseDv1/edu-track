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
			return c.json(await findCourseById(id))
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
			return c.json(await updateCourse(id, data))
		})
	.delete('/:id',
		zValidator("param", z.object({ id: z.string() })),
		async (c) => {
			const { id } = c.req.valid("param")
			return c.json(await deleteCourse(id))
		})