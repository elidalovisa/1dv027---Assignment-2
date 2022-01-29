/**
 * Mongoose model.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Create a schema.
// todo: change depending of what API im doing.
const schema = new mongoose.Schema({
  data: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  contentType: {
    type: String,
    default: false
  },
  location: {
    type: String,
    default: false
  },
  description: {
    type: String,
    default: false
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
  return this._id.toHexString()
})

/**
 * Gets all data.
 *
 * @returns {Promise<Data[]>} The Promise to be fulfilled.
 */
schema.statics.getAll = async function () {
  return this.find({})
}

/**
 * Gets data by ID.
 *
 * @param {string} id - The value of the id for the task to get.
 * @returns {object} data.
 */
schema.statics.getById = async function (id) {
  return this.findOne({ _id: id })
}

/**
 * Inserts data.
 *
 * @param {object} data - ...
 * @param {string} data.description - ...
 * @param {boolean} data.done - ...
 * @returns {object} data.
 */
schema.statics.insert = async function (data) {
  const newData = new Data(data)
  return newData.save()
}

/**
 * Updates data.
 *
 * @param {object} data - ...
 * @param {string} data.description - ...
 * @param {boolean} data.done - ...
 * @returns {object} data - ...
 */
schema.methods.update = async function (data) {
  if (data.description?.localeCompare(this.description) !== 0) {
    this.description = data.description
  }

  if (data.data?.localeCompare(this.data) !== 0) {
    this.data = data.data
  }

  if (data.contentType?.localeCompare(this.contenType) !== 0) {
    this.contenType = data.contenType
  }

  return this.save()
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
export const Data = mongoose.model('Data', schema)
