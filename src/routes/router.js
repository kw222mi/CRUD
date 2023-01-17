/**
 * The routes.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import express from 'express'
import { router as homeRouter } from './home-router.js'
import { router as snippetRouter } from './snippet-router.js'
import { router as userRouter } from './user-router.js'

export const router = express.Router()

router.use('/', homeRouter)
router.use('/snippets', snippetRouter)
router.use('/users', userRouter)

router.use('*', (req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
