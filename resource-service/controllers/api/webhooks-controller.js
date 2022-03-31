/**
 * Module for the WebhooksController.
 *
 * @author Elida Arrechea
 * @version 1.0
 */

import { Data } from '../../models/data.js'

/**
 * Encapsulates a controller.
 */
export class WebhooksController {
  /**
   * Authenticates the webhook.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  authenticate (req, res, next) {
    // Use the Heroku secret token to validate the received payload.
    if (req.headers['x-gitlab-token'] !== process.env.WEBHOOK_SECRET) {
      const error = new Error('Invalid token')
      error.status = 401
      next(error)
      return
    }

    next()
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
        description: ''
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
   * Notifies when a new catch has been added.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async newCatch (req, res, next) {
    try {
      let data = null
      if (req.body.event_type === 'newCatch') {
        data = new Data({
        username: username,
        fishType: req.body.fishType,
        position: req.body.position,
        nameOfLocation: req.body.nameOfLocation,
        city: req.body.city,
        weight: req.body.weight,
        length: req.body.length        
        })

        await data.save()
      }

      // It is important to respond quickly!
      res.status(200).end()

      // Put this last because socket communication can take long time.
      if (data) {
        res.io.emit('catch/create', data.toObject())
      }
    } catch (error) {
      const err = new Error('Internal Server Error')
      err.status = 500
      next(err)
    }
  }
}
