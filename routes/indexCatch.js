const express = require("express");
const router = express.Router();
const moviesRouter = require("./movies");
const usersRouter = require("./users");
const pool = require("../db");
const bycrypt = require("bcrypt");
const salt = bycrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const secretKey = "SECRET";
const {authentication} = require("../middlewares/auth");


//login
router.post("/login", (req, res, next) => {
    const {email, password} = req.body;

    const findUser = `
        SELECT
        *
        FROM users
        WHERE email = $1
        
    `

    pool.query(findUser, [email], (err,result) => {
        if (err) next(err);

        if(result.rows.length === 0) {
            //NOT FOUND
            next({name : "ErrorNotFound"})
        } else {
            //FOUND
            const data = result.rows[0];
            const comparePassword = bycrypt.compareSync(password, data.password);
            
            if(comparePassword) {
                //is valid
                const accessToken = jwt.sign({
                    id: data.id,
                    email: data.email,
                    role: data.role,
                    gender: data.gender

                }, secretKey);

                res.status(200).json({
                    id: data.id,
                    email: data.email,
                    gender: data.gender,
                    role: data.role,
                    accessToken: accessToken
                });

            } else {
                // !valid
                next({name: "WrongPassword"})
            }
        }
    });
});

//register
router.post("/register", (req, res, next) => {
    const {id, email, gender, password, role} = req.body;

    const hash = bycrypt.hashSync(password, salt);

    const insertUser =`
        INSERT INTO users (id, email, gender, password, role)
            VALUES ($1, $2, $3, $4, $5)
        ;
    `

    pool.query(insertUser, [id, email, gender, hash, role], (err, result) => {
        if (err) {
            console.error(err);
            return next(err);
        }

        console.log("result:", result);

        res.status(201).json({
            message : "User Registered"
        });
    });
});

router.use(authentication);
router.use("/", moviesRouter);
router.use("/",usersRouter);

module.exports = router;