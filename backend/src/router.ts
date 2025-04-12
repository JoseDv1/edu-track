import { Hono } from 'hono'
import { groupsController } from './controllers/groupsController'
import { coursesController } from './controllers/coursesController'
import { classesController } from './controllers/classesController'


export const apiRouter = new Hono()
	.route('/groups', groupsController)
	.route('/courses', coursesController)
	.route('/classes', classesController)


