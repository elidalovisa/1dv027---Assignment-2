/**
 * Module for the controller.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

import createError from 'http-errors'
import { Data } from '../../models/data.js'
import { User } from '../../../auth-service/models/user.js'
import { Hook } from '../../models/webhooks.js'
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
   * Gets entry point for API.
   * Sends a JSON response containing all data.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getEntry(req, res, next) {
    try {
       const urls = [{
        rel: 'self',
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
      },
        {
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users`,
        description: 'Show all users.'
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
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/:id`,
        description: 'Change data about catch. Catch ID in parameter. Data in body as JSON.'
      },
       {
        method: 'DELETE',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/:id`,
        description: 'Remove catch from catches. Catch ID in parameter.'
      }]
      res
        .header('Last-Modified', new Date())
        .header('Cache-control', 'max-age=5')
        .status(200)
        .json({
          message: 'Welcome to this API where you can save your latest fish catch!',
          links: urls
        })
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * Gets catches from all registred users,
   * Sends a JSON response containing all data.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getAll(req, res, next) {
    try {
      const allcatches = await Data.getAll()
       const urls = [{
        rel: 'self',
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
        method: 'DELETE',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/:id`,
        description: 'Remove catch from catches'

      }, {
        method: 'PUT',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/:id`,
        description: 'Change data about catch. Add data in body.'

      },
      {
        method: 'POST',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches`,
        description: 'Add new catch to catches.'
      }]
      res
        .header('Last-Modified', new Date())
        .header('Cache-control', 'max-age=5')
        .status(200)
        .json({
          message: 'Data fetched.',
          data: allcatches,
          links: urls
        })
    } catch (error) {
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
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/${data.id}`,
        description: 'Show data about catch.'
      },
      {
        method: 'DELETE',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/${data.id}`,
        description: 'Remove catch from catches'

      }, {
        method: 'PUT',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/${data.id}`,
        description: 'Change data about catch. Add data in body.'
      },
      {
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches`,
        description: 'Show all catches from logged in user.'
      },
      {
        method: 'POST',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches`,
        description: 'Add new catch to catches.'
      },
         {
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/all`,
        description: 'Show all catches from all users.'
      }]
      await data.save()
      // Notify webhook subscribers
      const subscribers = await Hook.find({})
       const getUrls = subscribers.map(getUrl => ({
        url: getUrl.url
      }))
      getUrls.shift()
      await Promise.all(getUrls.map(getUrl => {
        fetch(getUrl.url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
       })
      }))
      res
        .status(201)
        .json({
          message: data,
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
  async getCatches(req, res, next) {
    const userData = await Data.getByUser(req.user.username)
        const urls = [{
        rel: 'self',
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches`,
        description: 'Show all catches from logged in user.'
      },
      {
        method: 'DELETE',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/:id`,
        description: 'Remove catch from catches'

      }, {
        method: 'PUT',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/:id`,
        description: 'Change data about catch. Add data in body.'

      },
      {
        method: 'POST',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches`,
        description: 'Add new catch to catches.'
      },
         {
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/all`,
        description: 'Show all catches from all users.'
      }]
      res
        .header('Last-Modified', new Date())
        .header('Cache-control', 'max-age=5')
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
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/${req.params.id}`,
        description: 'Show data about catch.'
      },
      {
        method: 'DELETE',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/${req.params.id}`,
        description: 'Remove catch from catches'

      }, {
        method: 'PUT',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/${req.params.id}`,
        description: 'Change data about catch. Add data in body.'

      },
      {
        method: 'POST',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches`,
        description: 'Add new catch to catches.'
      },
         {
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/all`,
        description: 'Show all catches from all users.'
      }]
      res
        .header('Last-Modified', new Date())
        .header('Cache-control', 'max-age=5')
        .status(200)
        .json({
          message: 'Data fetched.',
          data: userData,
          links: urls
        })
   } 


  /**
   * Gets data requested in the parameters.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
   async getParam (req, res, next) {
     // Add eror if wrong param (ex height)
try {
   const weight = req.query.weight
    const length = req.query.length
    const test = await Data.find({})
    const result = test.filter(w => w.weight > weight && w.length > length)
      const urls = [{
        rel: 'self',
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/fish/details`,
        description: 'Show all catches that match the requested in parameters (minimum weight and length).'
      },
      {
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/:id`,
        description: 'Show data about catch.'
      },
      {
        method: 'DELETE',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/:id`,
        description: 'Remove catch from catches'

      }, {
        method: 'PUT',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/:id`,
        description: 'Change data about catch. Add data in body.'

      },
      {
        method: 'POST',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches`,
        description: 'Add new catch to catches.'
      },
         {
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/all`,
        description: 'Show all catches from all users.'
      }]
      res
        .header('Cache-control', 'max-age=5')
        .status(200)
        .json({
           message: 'Data fetched.',
           data: result,
           links: urls
        })
        .end()
  } catch (error) {
      let err = error
      console.log(err)
      if (error.name === 'ValidationError') {
        // Validation error(s).
        err = createError(400)
        err.innerException = error
      }
      next(err)
    }
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
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/${req.params.id}`,
        description: 'Show data about catch.'
      },
      {
        method: 'DELETE',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/${req.params.id}`,
        description: 'Remove catch from catches'

      }, {
        method: 'PUT',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/${req.params.id}`,
        description: 'Change data about catch. Add data in body.'

      },
      {
        method: 'POST',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches`,
        description: 'Add new catch to catches.'
      },
         {
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/all`,
        description: 'Show all catches from all users.'
      }]
      res
        .header('Cache-control', 'max-age=5')
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
        rel: 'self',
        method: 'DELETE',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/${req.params.id}`,
        description: 'Remove catch from catches'

      }, {
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches`,
        description: 'Show all catches from logged in user.'
      },
      {
        method: 'DELETE',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/:id`,
        description: 'Remove catch from catches'

      }, {
        method: 'PUT',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/:id`,
        description: 'Change data about catch. Add data in body.'
      },
      {
        method: 'POST',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches`,
        description: 'Add new catch to catches.'
      },
         {
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/users/catches/all`,
        description: 'Show all catches from all users.'
      }]
      res
        .header('Cache-control', 'max-age=5')
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
