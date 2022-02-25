/**
 * Module for the AccountController.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

// import createError from 'http-errors'
import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import { User } from '../../models/user.js'
import { fileURLToPath } from 'url'
import fs from 'fs'

/**
 * Encapsulates a controller.
 */
export class AccountController {
  /**
 * Provide req.data to the route if :id is present.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @param {string} username - The username of the user data to load.
 */
  async loadData (req, res, next, username) {
    try {
      // Get the data
      const data = await User.getById(username)

      // If no data found send a 404 (Not Found).
      if (!data) {
        next(createError(404))
        return
      }
      // Provide the data to req.
      req.data = data

      // Next middleware.
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Authenticates a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async login (req, res, next) {
    console.log(req)
    try {
      const user = await User.authenticate(req.body.email, req.body.password)
      const payload = {
        sub: user.email,
        x_permission_level: 15
      }

      const privateKEY = fs.readFileSync('/Users/elida/private.pem', 'utf8')

      // Create the access token with the shorter lifespan.
      const accessToken = jwt.sign(payload, privateKEY, {
        algorithm: 'RS256',
        expiresIn: process.env.ACCESS_TOKEN_LIFE
      })
      res
        .status(201)
        .json({
          access_token: accessToken
          //private_token: process.env.PERSONAL_ACCESS_TOKEN // Add personal token to headers?
        })
    } catch (error) {
      // Authentication failed.
      const err = createError(401)
      err.innerException = error
      next(err)
    }
  }

  /**
   * Registers a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async register (req, res, next) {
    try {
      const user = await User.insert({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
      })

      res
        .status(200)
        .json({
          id: user.id,
          links: {
            href: 'http://localhost:8085/login' + user.id
          }
        })
    } catch (error) {
      let err = error

      if (err.code === 11000) {
        // Duplicated keys.
        err = createError(409)
        err.innerException = error
      } else if (error.name === 'ValidationError') {
        // Validation error(s).
        err = createError(400)
        err.innerException = error
      }

      next(err)
    }
  }
}
