/**
 * Module for the WebhooksController.
 *
 * @author Elida Arrechea
 * @version 1.0
 */

import { Hook } from '../../models/webhooks.js'
import { Data } from '../../models/data.js'

/**
 * Encapsulates a controller.
 */
export class WebhooksController {

 /**
   * Used to authenticate hook.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async authenticate (req, res, next) {
    const key = await Hook.getById(req.body.key)
      if (req.body.key !== key.id) {
      const error = new Error('Invalid secret key')
      error.status = 401
      next(error)
      return
    }
    next()
  }

 /**
   * Create new hook.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async addHook (req, res, next) {
    try {
      const newHook = await Hook.insert({
        username: req.body.username,
        url: req.body.url
      })
      await newHook.save()
      res
        .status(201)
        .json({
          message: 'Hook created. Save your secret key and use it in the body as JSON.',
          key: newHook.id
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
   * Endpoint for webhook.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async endPoint (req, res, next) {
    const webhookMsg = 'Regsiter a webhook for when a new catch is added. Name of weebhook: newCatch'
    const urls = [
      {
        rel: 'self',
        method: 'GET',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/webhook`,
        description: 'Information about webhook.'
      },
      {
        method: 'POST',
        href: `${req.protocol}://${req.get('host')}${req.baseUrl}/webhook/add`,
        description: 'Add a new webhook. Put username and URL in body as JSON.'
      }
    ]
    try {
      res
      .status(200)
       .json({
          message: webhookMsg,
          links: urls
        })
    } catch (error) {
      const err = new Error('Internal Server Error')
      err.status = 500
      next(err)
    }
  }

   /**
   * Get hook.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getHook (req, res, next) {
    try {
      const data = await Hook.getById(req.body.key)
      res
        .status(201)
        .json({
          data: data})
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
   * Remove hook.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async deleteHook (req, res, next) {
    const data = await Hook.getById(req.body.key)
    try {
     await data.delete()
      res
        .status(200)
        .json({
         message: 'Webhook removed.'})
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

