/**
 * Mongoose model.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required.']
  },
  url: {
    type: String,
    required: [true, 'Url is required.']
  }
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
  if (this._id === undefined) {
    return
  }
  return this._id.toHexString()
})

/**
 * Gets all hooks.
 *
 * @returns {Promise<Data[]>} The Promise to be fulfilled.
 */
schema.statics.getAll = async function () {
  return this.find({})
}

/**
 * Get hook by ID.
 *
 * @param {string} id - The value of the id for the catch to get.
 * @returns {object} data.
 */
schema.statics.getById = async function (id) {
  return this.findOne({ _id: id })
}

/**
 * Gets all hooks from user.
 *
 * @param {string} username - The value of the id for the catch to get.
 * @returns {object} data.
 */
schema.statics.getHookUser = async function (username) {
  return this.find({ username: username })
}

/**
 * Inserts a new fish catch.
 *
 * @param {object} data - ...
 * @param {string} data.description - ...
 * @param {boolean} data.done - ...
 * @returns {object} data.
 */
schema.statics.insert = async function (data) {
  const newData = new Hook(data)
  return newData.save()
}

/**
 * Deletes data.
 *
 * @returns {object} data - ...
 */
schema.methods.delete = async function () {
  return this.remove()
}

// Create a model using the schema.
export const Hook = mongoose.model('Hook', schema)
