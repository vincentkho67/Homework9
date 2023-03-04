const express = require("express");
const router = express.Router();
const pool = require("../db");
const {authorization} = require("../middlewares/auth");
const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;


// get movies
router.get("/movies", authorization, (req, res, next) =>{
    const {limit, page} = req.query;

    let resultLimit = limit ? +limit : DEFAULT_LIMIT;
    let resultPage = page ? +page : DEFAULT_PAGE;
    const findQuery = `
    SELECT
        *
    FROM movies
    ORDER BY movies.id
    LIMIT ${resultLimit} OFFSET ${(resultPage - 1) * resultLimit}
    `

    pool.query(findQuery, (err, result) => {
        if(err) next(err);

        res.status(200).json(result.rows);
    });
});

// get movies by id
router.get("/movies/:id", authorization, (req, res, next) =>{
    const {id} = req.params;
    const findOneQuery = `
    SELECT
        *
    FROM movies
    WHERE movies.id = $1
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

//POST movies
router.post("/movies", authorization, (req, res, next) =>{
    const {id,title, genres, year} = req.body;

    const createMovies = `
        INSERT INTO movies (id,title, genres, year)
            VALUES
                ($1, $2, $3, $4)
            RETURNING *;
        `

    pool.query(createMovies, [id, title, genres, year], (err, result) => {
        if(err) next(err);

        res.status(200).json({message: "Movies Created Successfully"})        
    });
});


//Put

router.put("/movies/:id", authorization, (req, res, next) => {
    const {id} = req.params;
    const {title, genres, year} = req.body;

    const UpdateGame = `
        UPDATE movies
        SET title = $1,
            genres = $2,
            year = $3,
        WHERE id = $4;

    `

    pool.query(UpdateGame, [title, genres, year, id], (err, result) => {
        if(err) next(err);

        res.status(200).json({
            message: "Updated successfully"
        });
    });
});

//DELETE
router.delete("/movies/:id", authorization, (req, res, next) => {
    const {id} = req.params;
    const deleteMovies = `
            DELETE FROM movies
            WHERE id = $1;
    `
    pool.query(deleteMovies, [id], (err,result) => {
        if(err) next(err);

        res.status(200).json({
            message: "Deleted successfully"
        });
    });
});
module.exports = router;