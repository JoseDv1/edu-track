import { Hono } from "hono";
import { createGroup, createGroupSchema, deleteGroup, findGroups, findGroupById, updateGroup, updateGroupSchema } from "../services/groupsServices"
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";


export const groupsController = new Hono()
	.get('/', async (c) => { return c.json(await findGroups()) })
	.get('/:id',
		zValidator("param", z.object({ id: z.string() })),
		async (c) => {
			const { id } = c.req.valid("param")
			return c.json(await findGroupById(id))
		})
	.post('/',
		zValidator("json", createGroupSchema),
		async (c) => {
			const data = c.req.valid("json")
			return c.json(await createGroup(data), 201)
		})
	.put('/:id',
		zValidator("param", z.object({ id: z.string() })),
		zValidator("json", updateGroupSchema),
		async (c) => {
			const { id } = c.req.valid("param")
			const data = c.req.valid("json")
			return c.json(await updateGroup(id, data))
		})
	.delete('/:id',
		zValidator("param", z.object({ id: z.string() })),
		async (c) => {
			const { id } = c.req.valid("param")
			return c.json(await deleteGroup(id))
		})
