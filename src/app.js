const express = require("express");
const app = express();
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const passportSetup = require("./passport");
const config = require("../config");
const flash = require("connect-flash");
const ErrorHandler = require("./utils/error");
const handleErrors = require("./middleware/handleErrors");
const TypesenseClient = require("./typesense/client");

app.enable("trust proxy");

require("./typesense/businessCollection");
require("./typesense/listingCollection");
require("../cloudinaryConfig");

const collections = TypesenseClient.collections().retrieve();

console.log("typesense collections ", collections);

const swaggerOptions = {
  apis: ["./src/routes/*.js"],
  definition: {
    openapi: "3.0.0",
    info: {
      title: "techninja360 api",
      version: "1.0.0",
      description: "backend for",
    },
    servers: [
      {
        url: "http://localhost:8000",
      },
    ],
  },
};
const specs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const corsOptions = {
  origin: "*",
};

app.use(morgan("dev"));
app.use(cors(corsOptions));

//security related middlewares
// app.use(helmet());

app.use(express.urlencoded());
app.use(express.json());

app.use(flash());
app.use(session({ secret: "notagoodsecret" }));

app.use(passport.initialize());
app.use(passport.session());

app.use(
  "/src/uploads/images",
  express.static(path.join(__dirname, "uploads", "images"))
);

app.use((req, res, next) => {
  res.locals.currentUser = req.user;

  next();
});

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const merchantRouter = require("./routes/merchant");
const businessRouter = require("./routes/business");

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/merchant", merchantRouter);
app.use("/api/business", businessRouter);

// app.use(express.static(path.join(__dirname, "..", "..", "client", "build")));

app.get("/api", (req, res) => {
  // res.send(`Hello world from http://${config.HOST}:${config.PORT}`);
  res.send("Welcome to techninja 360 ");
  console.log("yeah it ran");
});

app.get("/api/secret", (req, res) => {
  res.send("techninja secret is 360");
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.use(handleErrors);

module.exports = app;
