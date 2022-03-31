/**
 * Mongoose model.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Create a schema.
const hooksSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required.']
  },
  url: {
    type: String,
    required: [true, 'Url is required.']
    unique: true
  },
  key: {
    type: String,
    required: [true, 'Key is required.']
  }, {
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
 * Gets all fish catches.
 *
 * @returns {Promise<Data[]>} The Promise to be fulfilled.
 */
schema.statics.getAll = async function () {
  return this.find({})
}

/**
 * Gets fish catch by ID.
 *
 * @param {string} id - The value of the id for the catch to get.
 * @returns {object} data.
 */
schema.statics.getById = async function (id) {
  return this.findOne({ _id: id })
}

/**
 * Gets all hooks by username.
 *
 * @param {string} username - The value of the id for the catch to get.
 * @returns {object} data.
 */
schema.statics.getHooksByUser = async function (username) {
  return this.find({ username: username })
}

/**
 * Inserts a new hook.
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
