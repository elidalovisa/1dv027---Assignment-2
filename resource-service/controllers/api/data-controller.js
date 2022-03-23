/**
 * Module for the controller.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

import createError from 'http-errors'
import { Data } from '../../models/data.js'
import { User } from '../../../auth-service/models/user.js'
import fetch from 'node-fetch'

/**
 * Encapsulates a controller.
 */
export class DataController {
  /**
   * Provide req.data to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the user data to load.
   */
  async loadData(req, res, next, id) {
    try {
      // Get the data
      const data = await Data.getById(id)
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
   * Gets collection from all registred users,
   * Sends a JSON response containing all data.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getAll(req, res, next) {
    try {
      const allCollection = await Data.getAll()
       const urls = [{
        rel: 'self',
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection/all`,
        description: 'Show all catches from all users.'
      },
       {
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection`,
        description: 'Show all catches from logged in user.'
      },
      {
        method: 'DELETE',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection/` + ' + id',
        description: 'Remove catch from collection'

      }, {
        method: 'PUT',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection/` + ' + id',
        description: 'Change data about catch. Add data in body.'

      },
      {
        method: 'POST',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection`,
        description: 'Add new catch to collection.'
      }]
      res
        .status(200)
        .json({
          message: 'Data fetched.',
          data: allCollection,
          links: urls
        })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  /**
   * Add a new catch for logged in user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async addCatch (req, res, next) {
    const username = req.user.username
    try {
      const data = await Data.insert({
        username: username,
        fishType: req.body.fishType,
        position: req.body.position,
        nameOfLocation: req.body.nameOfLocation,
        city: req.body.city,
        weight: req.body.weight,
        length: req.body.length
      })
      const urls = [{
        rel: 'self',
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection/${data.id}`,
        description: 'Show data about catch.'
      },
      {
        method: 'DELETE',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection/${data.id}`,
        description: 'Remove catch from collection'

      }, {
        method: 'PUT',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection/${data.id}`,
        description: 'Change data about catch. Add data in body.'
      },
      {
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection`,
        description: 'Show all catches from logged in user.'
      },
      {
        method: 'POST',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection`,
        description: 'Add new catch to collection.'
      },
         {
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection/all`,
        description: 'Show all catches from all users.'
      }]
      await data.save()
      res
        .status(201)
        .json({
          message: 'Data created.',
          links: urls
        }
        )
    } catch (error) {
      let err = error
      if (error.name === 'ValidationError') {
        // Validation error(s).
        err = createError(400)
        err.innerException = error
      }
      next(err)
    }
  }

  /**
   * Gets all catches from the logged in user.
   * Sends a JSON response containing requested data.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getCollection(req, res, next) {
    const userData = await Data.getByUser(req.user.username)
        const urls = [{
        rel: 'self',
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection`,
        description: 'Show all catches from logged in user.'
      },
      {
        method: 'DELETE',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection/` + ' + id',
        description: 'Remove catch from collection'

      }, {
        method: 'PUT',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection/` + ' + id',
        description: 'Change data about catch. Add data in body.'

      },
      {
        method: 'POST',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection`,
        description: 'Add new catch to collection.'
      },
         {
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection/all`,
        description: 'Show all catches from all users.'
      }]
      res
        .status(200)
        .json({
          message: 'Data fetched.',
          data: userData,
          links: urls
        })
  }

  /**
   * Sends a JSON response containing requested data.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
   async getCatch (req, res, next) {
    const userData = await Data.getById(req.params.id)
    const urls = [{
        rel: 'self',
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection/${req.params.id}`,
        description: 'Show data about catch.'
      },
      {
        method: 'DELETE',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection/${req.params.id}`,
        description: 'Remove catch from collection'

      }, {
        method: 'PUT',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection/${req.params.id}`,
        description: 'Change data about catch. Add data in body.'

      },
      {
        method: 'POST',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection`,
        description: 'Add new catch to collection.'
      },
         {
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection/all`,
        description: 'Show all catches from all users.'
      }]
      res
        .status(200)
        .json({
          message: 'Data fetched.',
          data: userData,
          links: urls
        })
   } 

  /**
   * Updates specific data.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async update(req, res, next) {
     const username = req.user.username
    try {
      await req.data.update({
        username: username,
        fishType: req.body.fishType,
        position: req.body.position,
        nameOfLocation: req.body.nameOfLocation,
        city: req.body.city,
        weight: req.body.weight,
        length: req.body.length
      })
        const urls = [{
        rel: 'self',
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection/${req.params.id}`,
        description: 'Show data about catch.'
      },
      {
        method: 'DELETE',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection/${req.params.id}`,
        description: 'Remove catch from collection'

      }, {
        method: 'PUT',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection/${req.params.id}`,
        description: 'Change data about catch. Add data in body.'

      },
      {
        method: 'POST',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection`,
        description: 'Add new catch to collection.'
      },
         {
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection/all`,
        description: 'Show all catches from all users.'
      }]
      res
        .status(200)
        .json({
           message: 'Data updated.',
           links: urls
        })
        .end()
    } catch (error) {
      let err = error
      if (error.name === 'ValidationError') {
        // Validation error(s).
        err = createError(400)
        err.innerException = error
      }
      next(err)
    }
  }

  /**
   * Deletes the specified catch.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete(req, res, next) {
    try {
      await req.data.delete()
        const urls = [{
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection`,
        description: 'Show all catches from logged in user.'
      },
      {
        method: 'DELETE',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection/` + ' + id',
        description: 'Remove catch from collection'

      }, {
        method: 'PUT',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection/` + ' + id',
        description: 'Change data about catch. Add data in body.'
      },
      {
        method: 'POST',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection`,
        description: 'Add new catch to collection.'
      },
         {
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/collection/all`,
        description: 'Show all catches from all users.'
      }]
      res
        .status(200)
        .json({
           message: 'Data deleted.',
           links: urls
        })
    } catch (error) {
      next(error)
    }
  }
}
