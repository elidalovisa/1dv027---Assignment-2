/**
 * Mongoose model User.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import validator from 'validator'

const { isEmail } = validator

// Create a schema.
const schema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'User email required.'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [isEmail, '{VALUE} is not an valid email address.']
  },
  username: {
    type: String,
    unique: true,
    required: [true, 'Username required.']

  },
  password: {
    type: String,
    minlength: [10, 'The password must be of minimum length 10 characters.'],
    required: [true, 'User password required.']
  },
  permissionLevel: Number
}, {
  timestamps: true,
  versionKey: false,
  toJSON: {

    /**
     * Performs a transformation of the resulting object to remove sensitive information.
     *
     * @param {object} doc - The mongoose document which is being converted.
     * @param {object} ret - The plain object representation which has been converted.
     */
    transform: function (doc, ret) {
      delete ret._id
    },
    virtuals: true // ensure virtual fields are serialized
  }
})

schema.virtual('id').get(function () {
  return this._id.toHexString()
})

// Salts and hashes password before save.
schema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 10)
})

/**
 * Authenticates a user.
 *
 * @param {string} email - ...
 * @param {string} password - ...
 * @returns {Promise<User>} ...
 */
schema.statics.authenticate = async function (email, password) {
  const user = await this.findOne({ email })

  // If no user found or password is wrong, throw an error.
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid username or password.')
  }

  // User found and password correct, return the user.
  return user
}

/**
 * Gets a user by username.
 *
 * @param {string} username - The value of the id for the user to get.
 * @returns {Promise<User>} The Promise to be fulfilled.
 */
schema.statics.getByUser = async function (username) {
  return this.findOne({ username: username })
}


/**
 * Gets all users.
 *
 * @returns {Promise<Data[]>} The Promise to be fulfilled.
 */
schema.statics.getAll = async function () {
  return this.find({})
}

/**
 * Inserts a new user.
 *
 * @param {object} userData - ...
 * @param {string} userData.email - ...
 * @param {string} userData.password - ...
 * @param {number} userData.permissionLevel - ...
 * @returns {Promise<User>} - ...
 */
schema.statics.insert = async function (userData) {
  const user = new User(userData)
  return user.save()
}

// Create a model using the schema.
export const User = mongoose.model('User', schema)

/**
 * Deletes data.
 *
 * @returns {object} data - ...
 */
schema.methods.delete = async function () {
  return this.remove()
}
