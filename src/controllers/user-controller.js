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
  async register(req, res) {
    res.render('users/register')
  }

  /**
   * Creates a new user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async registerPost(req, res) {
    console.log(req.body)
    try {
      const user = new User({
        username: req.body.username,
        password: req.body.password
      })
      console.log(user)
      await user.save()

      req.session.flash = { type: 'success', text: 'The user was created successfully.' }
      res.redirect('/users/login')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('/users/register')
    }
  }

  /**
   * Returns a HTML form for login.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async login(req, res) {
    res.render('users/login')
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
      console.log(req.session)
      await User.authenticate(req.body.username, req.body.password)
      req.session.regenerate((err) => {
        if (err) {
          throw new Error('Failed to re-generate session.')
        }
        // Store the authenticated user in the session store.
        req.session.auth = true
        req.session.username = req.body.username
        console.log(req.session)
        res.redirect('/snippets/create')
      })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('/users')
    }
  }
  /**
   * Logout a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
 async logout(req, res) {
  // destroy session data
  req.session = null;
  console.log(req.session)
  // redirect to homepage
  res.redirect('/');
}
}


