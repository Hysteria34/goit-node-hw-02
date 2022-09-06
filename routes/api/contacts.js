const express = require('express');
const { NotFound } = require("http-errors");
const {Contact,contactsJoiSchema,statusJoiSchema} = require("../../models/contact");

const router = express.Router();

router.get('/', async (req, res, next) => {
  const contacts = await Contact.find({});
    try {
       res.json({
         status:"success",
         code: 200,
         data:{
           result: contacts
         }
      })
    } catch (error) {
       res.status(500).json({
        status:"error",
        code: 500,
        message:"Server error"
    });
    }
});

router.get('/:contactId', async (req, res, next) => {
  try{
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);
  if (!result) {
      throw new NotFound(`Product with id=${contactId} not found`);
  }
  res.json({
      status: "success",
      code: 200,
      data: {
          result
      }
  })
}
catch(error){
  next(error  )
}
})

router.post('/', async (req, res, next) => {
  try {
    const {error} = contactsJoiSchema.validate(req.body);
        if(error){
            error.status = 400; 
            error.message = "missing required name field";
            throw error;}
    const result = await Contact.create(req.body);
    res.status(201).json({
        status: "success",
        code: 201,
        data: {
            result
        }
    })
  }
  catch(error){
    next(error);
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try{
  const { contactId } = req.params;
    const result = await Contact.findByIdAndRemove(contactId);
    if (!result) {
        throw new NotFound(`Product with id=${contactId} not found`);
    }
    res.json({
        status: "success",
        code: 204,
        message: "contact deleted",
        data: {
            result
        }
    })
  }
  catch(error){
    next(error)
  }
})

router.put('/:contactId', async (req, res, next) => {
  try{
    const {error} = contactsJoiSchema.validate(req.body);
    console.log({error})
    if(error){
        error.status = 400;
        error.message = "missing fields";
        throw error;
    }
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId,req.body,{new:true});
  if (!result) {
      throw new NotFound(`Product with id=${contactId} not found`);
  }
  res.json({
    status: "success",
    code: 200,
    data: {
        result
    }
})
}
catch(error){
  next(error)
}
})

router.patch('/:contactId/status', async (req, res, next) => {
  try{
    const {error} = statusJoiSchema.validate(req.body);
    console.log({error})
    if(error){
        error.status = 400;
        error.message = "missing fields";
        throw error;
    }
  const { contactId } = req.params;
  const {favorite} = req.body;
  const result = await Contact.findByIdAndUpdate(contactId, {favorite},{new:true});
  if (!result) {
      throw new NotFound(`Product with id=${contactId} not found`);
  }
  res.json({
    status: "success",
    code: 200,
    data: {
        result
    }
})
}
catch(error){
  next(error)
}
})

module.exports = router
