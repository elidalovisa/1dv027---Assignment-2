/**
 * Mongoose model.
 *
 * @author Elida Arrechea
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  fishType: {
    type: String,
    default: false
  },
  position: {
    type: String,
    default: false
  },
  nameOfLocation: {
    type: String,
    default: false
  },
  city: {
    type: String,
    default: false
  },
  weight: {
    type: String,
    default: false
  },
  length: {
    type: String,
    default: false
  },
  imageURL: {
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
 * Inserts a neew fish catch.
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
 * Updates data about fish catch.
 *
 * @param {object} data - ...
 * @param {string} data.description - ...
 * @param {boolean} data.done - ...
 * @returns {object} data - ...
 */
schema.methods.update = async function (data) {
  if (data.fishType?.localeCompare(this.fishType) !== 0) {
    this.fishType = data.fishType
  }

  if (data.position?.localeCompare(this.data) !== 0) {
    this.position = data.position
  }

  if (data.nameOfLocation?.localeCompare(this.nameOfLocation) !== 0) {
    this.nameOfLocation = data.nameOfLocation
  }

  if (data.city?.localeCompare(this.city) !== 0) {
    this.city = data.city
  }

  if (data.weight?.localeCompare(this.weight) !== 0) {
    this.weight = data.weight
  }

  if (data.length?.localeCompare(this.length) !== 0) {
    this.length = data.length
  }

  if (data.imageURL?.localeCompare(this.imageURL) !== 0) {
    this.imageURL = data.imageURL
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
export const Data = mongoose.model('Catch', schema)
