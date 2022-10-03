import { Router } from "express";
import { allClients, insertClient, updtadeClient } from "../controllers/customersControllers.js";
import { validateSchema } from "../middlewares/schemaValidatorMiddleware.js";
import { insertClientSchema } from "../schemas/insertClientSchema.js";

const customersRouter = Router();

customersRouter.post('/customers', validateSchema(insertClientSchema), insertClient);
customersRouter.get('/customers/:id', allClients )
customersRouter.put('/customers/:id', validateSchema(insertClientSchema), updtadeClient)
export default customersRouter;