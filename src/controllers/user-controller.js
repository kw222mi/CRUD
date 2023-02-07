/**
 * Module for the UserController.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import { User } from '../models/user.js'

/**
 * Encapsulates a controller.
 */
export class UserController {
  /**
   * Returns a HTML form for creating a new user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async register (req, res) {
    res.render('./users/register')
  }

  /**
   * Creates a new user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async registerPost (req, res) {
    try {
      const user = new User({
        username: req.body.username,
        password: req.body.password
      })
      await user.save()

      req.session.flash = { type: 'success', text: 'The user was created successfully.' }
      res.redirect('./login')
    } catch (error) {
      req.session.flash = { type: 'danger', text: 'Could not create user, pick another username.' }
      res.redirect('./register')
    }
  }

  /**
   * Returns a HTML form for login.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async login (req, res) {
    res.render('./users/login', { user: req.session.username })
  }

  /**
   * Login a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {object} next - Express next middleware function.
   */
  loginPost = async (req, res, next) => {
    try {
      await User.authenticate(req.body.username, req.body.password)
      req.session.regenerate((err) => {
        if (err) {
          throw new Error('Failed to re-generate session.')
        }
        // Store the authenticated user in the session store.
        req.session.auth = true
        req.session.username = req.body.username
        res.redirect('../snippets/create')
      })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./login')
    }
  }

  /**
   * Logout a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {object} next - Express next object.
   */
  async logout (req, res, next) {
    // check if user is logged in
    if (!req.session.auth === true) {
      console.log('not logged in')
      const error = new Error('Not found')
      error.statusCode = 404
      return next(error)
    } else {
      // destroy session data
      req.session.destroy()
      // redirect to homepage
      res.redirect('/')
    }
  }
}
