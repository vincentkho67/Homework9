const express = require("express");
const router = express.Router();
const pool = require("../db");
const {authorization} = require("../middlewares/auth");
const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;


//get users
router.get("/users", authorization, (req, res, next) =>{
    const {limit, page} = req.query;

    let resultLimit = limit ? +limit : DEFAULT_LIMIT;
    let resultPage = page ? +page : DEFAULT_PAGE;
    const findQuery = `
    SELECT
        *
    FROM users
    ORDER BY users.id
    LIMIT ${resultLimit} OFFSET ${(resultPage - 1) * resultLimit}
    `

    pool.query(findQuery, (err, result) => {
        if(err) next(err);

        res.status(200).json(result.rows);
    });
});

//get users by id

router.get("/users/:id", authorization, (req, res, next) =>{
    const {id} = req.params;
    const findOneQuery = `
    SELECT
        *
    FROM users
    WHERE users.id = $1
    `

    pool.query(findOneQuery, [id], (err, result) => {
        if(err) next(err);

        if(result.rows.length === 0) {
            //NOT FOUND
            next({name: "ErrorNotFound"});
        } else {
            //FOUND
            res.status(200).json(result.rows[0]);
        };

        
    });
});

//Put

router.put("/users/:id", authorization, (req, res, next) => {
    const {id} = req.params;
    const {email, password, gender, role} = req.body;

    const updateUser = `
        UPDATE users
        SET email = $1,
            password = $2,
            gender = $3,
            role = $4,
        WHERE id = $5;

    `

    pool.query(updateUser, [email, password, gender, role], (err, result) => {
        if(err) next(err);

        res.status(200).json({
            message: "Updated successfully"
        });
    });
});

//DELETE
router.delete("/users/:id", authorization, (req, res, next) => {
    const {id} = req.params;
    const deleteUser = `
            DELETE FROM users
            WHERE id = $1;
    `
    pool.query(deleteUser, [id], (err,result) => {
        if(err) next(err);

        res.status(200).json({
            message: "Deleted successfully"
        });
    });
});

module.exports = router;
