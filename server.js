// ------------- the main file for the whole project----------------//



// IMPORT PACKAGES
import  express  from "express";
import  bodyParser  from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path  from "path";
import { fileURLToPath } from "url";
import { register} from "./controllers/auth.controller.js";
import router from "./routes/root.routes.js"
import { verifyToken } from "./middleware/auth.js";
import { createPost } from "./controllers/post.controller.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import {users, posts} from "./data/mockdata.js"

// CONFIRURATIONS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config(); // file .env must be in the same folder with package.json

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}))
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));  // direction to the folder keeping assets

// FILE STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage})

// ROUTES WITH FILES (this route stay here because its upload)
app.post("/auth/register", upload.single("picture"), register)  // create user
app.post("/posts", verifyToken, upload.single("picture"), createPost)

// ROUTE 
app.use(router);


// MONGOOSE SETUP
const PORT = process.env.PORT || 6020; // 6020 is backup port

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
      /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
}).catch((error) => console.log(`${error} not connected`));