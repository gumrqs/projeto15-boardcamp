import joi from 'joi';

const gamesSchema =  joi.object({
    name: joi.string().required(),
    stockTotal: joi.number().required(),
    categoryId:joi.number().required(),
    pricePerDay: joi.number().required(),
    image: joi.string().required()
})

export { gamesSchema }