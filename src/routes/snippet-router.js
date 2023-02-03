/**
 * Snippet routes.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import express from 'express'
import { SnippetController } from '../controllers/snippet-controller.js'

export const router = express.Router()

const controller = new SnippetController()

// Map HTTP verbs and route paths to controller action methods.

 router.get('/', (req, res, next) => controller.index(req, res, next))

router.get('/create', (req, res, next) => controller.create(req, res, next))
router.post('/create', (req, res, next) => controller.createPost(req, res, next))

router.get('/:id/update', controller.authorize, controller.update)
router.post('/:id/update', controller.authorize, controller.updatePost)

router.get('/:id/delete', controller.authorize, controller.delete)
router.post('/:id/delete', controller.authorize, controller.deletePost)
