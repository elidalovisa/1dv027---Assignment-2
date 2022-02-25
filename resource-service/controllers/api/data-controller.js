/**
 * Module for the controller.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

import createError from 'http-errors'
import { Data } from '../../models/data.js'
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
   * @param {string} id - The value of the id for the image to load.
   */
  async loadData(req, res, next, username) {
    try {
      // Get the data
      const data = await Data.getById(username)

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
   * Sends a JSON response containing requested data.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async find(req, res, next) {
    console.log(req.data)
    const resData = {
      user: req.data.user,
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
   * Add new data.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async addFish (req, res, next) {
    const fishToAdd = {
      user: req.body.username,
      fishType: req.body.fishType,
      position: req.body.position,
      nameOfLocation: req.body.nameOfLocation,
      city: req.body.city,
      weight: req.body.weight,
      length: req.body.length
    }
    try {
      const postData = await fetch(process.env.DATA_URL,
        {
          method: 'POST',
          headers: {
            'PRIVATE-TOKEN': req.headers.authorization,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(fishToAdd)
        })
      const response = await postData.json()
      const data = await Data.insert({
        user: req.body.username,
        fishType: req.body.fishType,
        position: req.body.position,
        nameOfLocation: req.body.nameOfLocation,
        city: req.body.city,
        weight: req.body.weight,
        length: req.body.length,
        _id: response.id
      })
      const urls = [{
        rel: 'self',
        href: process.env.BASE_URL + data._id
      },
      {
        rel: 'addFish',
        method: 'POST',
        href: process.env.BASE_URL + 'api/v1/add-fish' + '/' + data._id
      }]
      data.links = urls
      res
        // .location(location.href)
        .status(201)
        .json(data)
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
   * Sends a JSON response containing all data.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAll(req, res, next) {
    try {
      // Get the data from Database.
      const fetchData = await fetch(process.env.DATA_URL,
        {
          method: 'GET',
          headers: {
            'PRIVATE-TOKEN': process.env.PERSONAL_ACCESS_TOKEN,
            'Content-Type': 'application/json'
          }
        })
      const response = await fetchData.json()
      console.log(response)
      res.json(response)
    } catch (error) {
      console.log(error)
      next(error)
    }
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
          'PRIVATE-TOKEN': process.env.PERSONAL_ACCESS_TOKEN,
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
    const data = {
      user: req.body.user // check user?
      // add catchID? contentType: req.body.contentType
    }
    const postData = await fetch(process.env.DATA_URL,
      {
        method: 'PUT',
        headers: {
          // 'PRIVATE-TOKEN': process.env.PERSONAL_ACCESS_TOKEN,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
    const response = await postData.json()
    try {
      // todo: change data dependng on what type of API Im doing
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
}
