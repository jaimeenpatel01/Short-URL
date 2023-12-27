const express = require('express');
const {connectToMongoDB } = require('./connect');
const path = require('path');
const cookieParser = require('cookie-parser');

const URL = require('./models/url');

const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRoutes');
const userRoute = require('./routes/user');

const app = express();
const PORT = 8001;

const { restrictToUserLoggedInUserOnly, checkAuth } = require('./middlewares/auth');

connectToMongoDB("mongodb://localhost:27017/short-url")
    .then(() => console.log("Database connected!"));
    
app.set("view engine", "ejs");
app.set("views", path.resolve("./views")); 

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use("/url",restrictToUserLoggedInUserOnly ,urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);
    

app.get("/url/:shortId", async(req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId,
        },
        {
            $push: {
                visitHistory: { timestamp: Date.now() }
            },
        }
    );
    res.redirect(entry.redirectUrl);
})

app.get("/", async (req, res) => {
    const allUrls = await URL.find({});
    return res.render('home', {
        urls:allUrls,
    });
});
 

app.listen(PORT, () => console.log(`Server is running on PORT number: ${PORT}`));