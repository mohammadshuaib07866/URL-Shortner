import express from "express";

// Initalize the express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  return res.send("Hello Welcome to URL Shortne Website");
});


export {app}