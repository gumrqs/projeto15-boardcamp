import { Router } from 'express'
import { category, allCategory } from '../controllers/categoryControllers.js'
import { validateSchema } from '../middlewares/schemaValidatorMiddleware.js'
import { categorySchema } from '../schemas/categorySchema.js';

const categoryRouter = Router ();
categoryRouter.post('/categories', validateSchema(categorySchema), category)
categoryRouter.get('/categories', allCategory)

export default categoryRouter