/**
 * Module for the AccountController.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import { User } from '../../models/user.js'

/**
 * Encapsulates a controller.
 */
export class AccountController {
  /**
   * Authenticates a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async login (req, res, next) {
    try {
      const user = await User.authenticate(req.body.email, req.body.password)
      const payload = {
        username: user.username,
        email: user.email,
        permissionLevel: user.permissionLevel
      }
      // Create the access token with the shorter lifespan.
      const accessToken = jwt.sign(payload, process.env.PERSONAL_ACCESS_TOKEN, {
        algorithm: 'HS256', // 'RS256',
        expiresIn: process.env.ACCESS_TOKEN_LIFE
      })
         const urls = [{   
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}`,
        description: 'API entry point.'
        },
      {
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/all`,
        description: 'Show all catches from all users.'
      },
       {
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches`,
        description: 'Show all catches from logged in user.'
      },
        {
        method: 'POST',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches`,
        description: 'Add new catch to catches. Data in body as JSON.'
      },
      {
        method: 'PUT',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/` + ' + id',
        description: 'Change data about catch. Catch ID in parameter. Data in body as JSON.'
      },
       {
        method: 'DELETE',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/` + ' + id',
        description: 'Remove catch from catches. Catch ID in parameter.'
      }]
      
      res
        .header('Cache-control', 'max-age=5')
        .status(201)
        .json({
          access_token: accessToken
        })
    } catch (error) {
      // Authentication failed.
      const err = createError(401)
      err.innerException = error
      next(err)
    }
  }

  /**
   * Gets all users.
   * Sends a JSON response containing all data.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getUsers(req, res, next) {
    try {
      const users = await User.getAll()
       const urls = [{   
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}`,
        description: 'API entry point.'
      },
         {
        method: 'POST',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/register`,
        description: 'Register new user. Email, username and password in body as JSON'
      },
        {
        method: 'POST',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/login`,
        description: 'Login user. Email and password in body as JSON.'
      }]
      res
        .header('Last-Modified', new Date(),)
        .header('Cache-control', 'max-age=5')
        .status(200)
        .json({
          message: 'Data fetched.',
          data: users,
          links: urls
        })
    } catch (error) {
      next(error)
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
        password: req.body.password,
        permissionLevel: 8 // change level
      })
        const urls = [{   
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}`,
        description: 'API entry point.'
      },
        {
        method: 'POST',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/login`,
        description: 'Login user. Email and password in body as JSON.'
      }]
      res
        .header('Cache-control', 'max-age=5')
        .status(200)
        .json({
          message: 'User account created.',
          links: urls
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
