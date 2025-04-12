import { Hono } from 'hono'
import { groupsController } from './controllers/groupsController'


export const apiRouter = new Hono()
	.route('/groups', groupsController)
	.route('/groups/:groupId/courses', groupsController)
	.route('/groups/:groupId/courses/:courseId/classes', groupsController)


