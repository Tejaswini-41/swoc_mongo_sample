import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import bcrypt from "bcrypt";
import Collection from "./db.js";

// Create __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


// Use EJS as the view engin
app.set('view engine', 'ejs');

app.use(express.json());

//static folder path 
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));

//needed for form submissions
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    console.log(req.body); // Log the request body

    const data = {
        email: req.body.username,
        password: req.body.password
    };

    const existingUser = await Collection.findOne({ email: data.email });
    if (existingUser) {
        res.send("User already exists.")
    } else {

        const saltRounds = 10;
        const hashedPass = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPass;


        try {
            const userdata = await Collection.insertMany(data);
            console.log(userdata);
            res.send("User registered successfully!");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error registering user.");
        }
    }
    });

//login
app.post("/login", async (req, res) => { 
    try {
        const check = await Collection.findOne({ email: req.body.username });
        if (!check) {
            res.send("User is not found");
        }
        //compare
        const isPassMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPassMatch) {
            res.render("home")
        } else {
            res.send("wrong Pasword");
        }

    } catch {
        res.send("wrong details");
     }

})    


const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});





