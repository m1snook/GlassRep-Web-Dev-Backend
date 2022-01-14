const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// configs
const { initDb } = require("./config/db");
require("./config/firebase");

const productRouter = require("./routes/productRoutes");
const orderRouter = require("./routes/orderRoutes");
const errorController = require("./controllers/errorController");
const { protectRoutes } = require("./controllers/authController");

// env
dotenv.config({ path: `${__dirname}/.env` });
//swaggerJsDoc
const swaggerDocs = swaggerJsDoc({
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "GlassRep API",
      description: "GlassRep API v1",
      contact: {
        name: "API Support",
        url: "",
      },
      servers: [
        {
          url: "http://localhost:5000",
        },
      ],
    },
  },
  apis: ["routes/*.js"],
});

(async () => {
  try {
    await initDb();

    const app = express();

    // cors
    app.use(
      cors({
        credentials: true,
        origin: "http://localhost:3000",
      })
    );

    // data parsers
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // logger
    if (process.env.NODE_ENV === "development") {
      app.use(morgan("dev"));
    }

    // Api routes
    app.use("/api/users", protectRoutes);
    app.use("/api/products", productRouter);
    app.use("/api/orders", orderRouter);
    app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    // Global error Handler
    app.use(errorController);

    app.listen(process.env.PORT, () => {
      console.log(`App running on port ${process.env.PORT}`);
    });

    // For Unhandeled Rejections
    process.on("unhandledRejection", (err) => {
      console.log("UNHANDLED REJECTION, SHUTTING DOWN......");
      console.log(err);
    });
  } catch (err) {
    process.exit(1);
  }
})();
