function errorHandler(err, req, res ,next) {
    if (err.name === "ErrorNotFound") {
       res.status(404).json({
            message: "Error Not Found"
       });
    } else if (err.name === "WrongPassword") {
        res.status(400).json({
            message: "Wrong Password or username"
        })
    } else if (err.name === "denied") {
        res.status(400).json({
            message: "Access Denied"
        });
    } else if (err.name === "JWTerror") {
        res.status(400).json({
            message: "JWT Denied"
        });
    } else if (err.name === "Unaothorized") {
        res.status(400).json({
            message: "tidak boleh ya"
        });
    } else {
        res.status(500).json({
            message: "Internal Server Error"
        });
    };
    console.log(err);
};

module.exports = errorHandler;