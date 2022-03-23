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
        method: 'PATCH/PUT?',
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
        method: 'PATCH/PUT?',
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
        method: 'PATCH/PUT?',
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
        method: 'PATCH/PUT?',
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
   * Sends a JSON response containing requested data.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async find(req, res, next) {
    console.log(req.data)
    const resData = {
      user: req.data.username,
      fishType: req.data.fishType,
      position: req.data.position,
      nameOfLocation: req.data.nameOfLocation,
      city: req.data.city,
      weight: req.data.weight,
      length: req.data.length,
      _id: req.data._id,
      links: [{
        rel: 'self',
        href: process.env.BASE_URL
      },
      {
        rel: 'addFish',
        method: 'POST',
        href: process.env.BASE_URL + 'api/v1/add-fish' + '/'
      }]
    }
    res.json(resData)
  }

  /**
   * Updates a specific fish catch.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async updatePartially(req, res, next) {
    const catchId = req.params.id
    console.log(catchId)
    const postData = await fetch(process.env.DATA_URL + '/' + catchId,
      {
        method: 'POST',
        headers: {
          'PRIVATE-TOKEN': req.headers.authorization,
          'Content-Type': 'application/json'
        }
      })
    const response = await postData.json()
    console.log(response)
    try {
      await req.data.update({
        user: req.body.user,
        fishType: req.body.fishType,
        position: req.body.position,
        nameOfLocation: req.body.nameOfLocation,
        city: req.body.city,
        weight: req.body.weight,
        length: req.body.length,
        imageURL: req.body.imageURL,
        _id: response.id
      })
      res
        .status(204)
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
      res
        .status(204)
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
   * Deletes the specified fish
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete(req, res, next) {
    const fishToDelete = await fetch('http://localhost:8081/api/v1/users/elsa/fish/621966e15e6a51efad2c4cf3',
      {
        method: 'DELETE',
        headers: {
          'PRIVATE-TOKEN': req.headers.authorization,
          'Content-Type': 'application/json'
        }
      })
    const response = await fishToDelete.json()
    console.log(response)
    try {
      await req.data.delete()

      res
        .status(204)
        .end()
    } catch (error) {
      next(error)
    }
  }
}
