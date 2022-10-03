import { Router } from "express";
import { allGames, games }from "../controllers/gamesControllers.js";
import { validateSchema } from "../middlewares/schemaValidatorMiddleware.js";
import { gamesSchema } from "../schemas/gamesSchema.js";

const gamesRouter = Router();

gamesRouter.post('/games', validateSchema(gamesSchema), games);
gamesRouter.get('/games', allGames)
export default gamesRouter