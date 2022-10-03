import cors from "cors";
import express, {json} from "express";
import router from "./routes/indexRoutes.js";


const server = express();
server.use(cors());
server.use(json());


server.use(router)






const port = process.env.PORT || 4000;

server.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})