const express = require("express");
const app = express();
const port = 3000;
const router = require("./routes/indexCatch");
const errorHandler = require("./middlewares/errorhandler");
const swaggerUI = require("swagger-ui-express");
const moviesJson = require("./movies.json");
const morgan = require("morgan");


//Middlewares
app.use(morgan('tiny'));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(moviesJson));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(router);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`listening on port ${port}`)
});