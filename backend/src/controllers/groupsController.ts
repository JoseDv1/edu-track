import { Hono } from "hono";
import { createGroup, createGroupSchema, deleteGroup, findGroups } from "../services/groupsServices"
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";


export const groupsController = new Hono()
	.get('/', async (c) => { return c.json(await findGroups()) })
	.post('/',
		zValidator("json", createGroupSchema),
		async (c) => {
			const data = c.req.valid("json")
			return c.json(await createGroup(data), 201)
		})
	.delete('/:id',
		zValidator("param", z.object({ id: z.string() })),
		async (c) => {
			const { id } = c.req.valid("param")
			return c.json(await deleteGroup(id))
		})
