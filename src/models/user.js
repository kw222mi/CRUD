/**
 * Mongoose model Snippet.
 *
 * @author Therese
 * @version 1.0.0
 */

import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 1
  },
  password: {
    type: String,
    required: true,
    minlength: [10, 'The password must be of minimum length 10 characters.'],
    maxlength: 2000
  }
}, {
  timestamps: true,
  toObject: {
    virtuals: true, // ensure virtual fields are serialized
    /**
     * Performs a transformation of the resulting object to remove sensitive information.
     *
     * @param {object} doc - The mongoose document which is being converted.
     * @param {object} ret - The plain object representation which has been converted.
     */
    transform: function (doc, ret) {
      delete ret._id
      delete ret.__v
    }
  }
})

schema.virtual('id').get(function () {
  return this._id.toHexString()
})

// Salts and hashes password before saving.
schema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 8)
})

/**
 * Checks if the password is valid.
 *
 * @param {*} username - The username.
 * @param {*} password - The password.
 * @returns {object} - The user.
 */
schema.statics.authenticate = async function (username, password) {
  const user = await this.findOne({ username })
  // If no user found or password is wrong, throw an error.
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid login attempt.')
  }
  // User found and password correct, return the user.
  return user
}



// Create a model using the schema.
export const User = mongoose.model('User', schema)
