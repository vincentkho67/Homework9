const express = require("express");
const router = express.Router();
const pool = require("../db");
const {authorization} = require("../middlewares/auth");
const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;



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

module.exports = router;