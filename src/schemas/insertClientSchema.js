import joi from 'joi';

const insertClientSchema =  joi.object({
    name: joi.string().required(),
    cpf: joi.string().length(11).required(),
    birthday:joi.date().required(),
    phone: joi.string().min(10).max(11).required()
})

export {insertClientSchema}