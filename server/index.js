const express = require("express");
const cors = require("cors");

const catalogueAPI = require("./routes/catalogueAPI");
const dotenv = require("dotenv");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;
const mongoConnection = require("./db-config/mongodb");
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
  cors({
    origin: function (origin, callback) {
      // console.log("API requested from " + origin);
      if (!origin || ( origin.indexOf("localhost") > -1|| origin.indexOf("instalogue") > -1)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use((req, res, next) => {
  if (req.header("x-forwarded-proto") != undefined && req.header("x-forwarded-proto") !== "https") {
    res.redirect(`https://${req.header("host")}${req.url}`);
  }
  else {
    next();
  }
});

app.use("/api", catalogueAPI);

app.get("/", (req, res) => {
  res.status(200).json("Instalogue Server is up!");
});

if (process.env.NODE_ENV == "production") {
  console.log("Found node environment as" + process.env.NODE_ENV , __dirname);
  // Serve static files from the React app
  app.use(express.static("client/build"));
  
  // The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
  app.get("*", (req, res) => {
    // Only serve index.html for non-API routes
    if (!req.path.startsWith('/api/')) {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    } else {
      res.status(404).json({ error: "API endpoint not found" });
    }
  });
}

app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});
