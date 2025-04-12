import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import {
	createClass,
	createClassSchema,
	deleteClass,
	findClassById,
	findClasses,
	updateClass,
	updateClassSchema
} from "../services/classesServices";

export const classesController = new Hono()
	.get('/', async (c) => {
		const cursoId = c.req.query('cursoId')
		return c.json(await findClasses(cursoId))
	})
	.get('/:id',
		zValidator("param", z.object({ id: z.string() })),
		async (c) => {
			const { id } = c.req.valid("param")
			return c.json(await findClassById(id))
		})
	.post('/',
		zValidator("json", createClassSchema),
		async (c) => {
			const data = c.req.valid("json")
			return c.json(await createClass(data), 201)
		})
	.put('/:id',
		zValidator("param", z.object({ id: z.string() })),
		zValidator("json", updateClassSchema),
		async (c) => {
			const { id } = c.req.valid("param")
			const data = c.req.valid("json")
			return c.json(await updateClass(id, data))

		})
	.delete('/:id',
		zValidator("param", z.object({ id: z.string() })),
		async (c) => {
			const { id } = c.req.valid("param")
			return c.json(await deleteClass(id))
		})