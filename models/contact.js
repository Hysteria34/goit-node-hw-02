const {Schema, model} = require("mongoose");
const Joi = require("joi");

const contactsJoiSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
})

const statusJoiSchema = Joi.object({
  favorite: Joi.bool().required(),
})

const contactsSchema = Schema({
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    }
  },{versionKey:false, timestamps:true});
  
  const Contact = model("contact",contactsSchema);

  module.exports = {
  Contact,
  statusJoiSchema,
  contactsJoiSchema
}