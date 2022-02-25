/**
 * Account routes.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

import express from 'express'
import { AccountController } from '../../../controllers/api/account-controller.js'

export const router = express.Router()

const controller = new AccountController()
// Provide req.data to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => controller.loadData(req, res, next, id))

// Map HTTP verbs and route paths to controller actions.

// Login user
router.post('/users/login', (req, res, next) => controller.login(req, res, next))

// Register new user
router.post('/users/register', (req, res, next) => controller.register(req, res, next))
