const jwt = require("jsonwebtoken");
const secretKey = "SECRET";
const pool = require("../db")

function authentication(req, res, next) {

    const {access_token} = req.headers;
    
    if(access_token) {
        try { 
            const decoded = jwt.verify(access_token, secretKey);

            const {id, email} = decoded;
            
            const findUser = `
                SELECT
                    *
                FROM users
                WHERE id = $1
            `

            pool.query(findUser, [id], (err, result) => {
                if(err) next(err);

                if(result.rows.length === 0) {
                    next({name: "ErrorNotFound"})
                } else {
                    const user = result.rows[0];

                    req.loggedUser = {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                        gender: user.gender

                    };
                    next();
                }
            })
        } catch (err) {
            next({name: "JWTerror"})
        }
        
    } else {
        next({name: "denied"})
    }
};

function authorization(req, res, next) {
    const {role, email, gender, id} = req.loggedUser;

    if(role) {
        //Authorized -- role apapun boleh
        next();
    } else {
        //Unauthorized berarti nolep tidak boleh
        next({name : "Unauthorized"})
    }
};

module.exports = {
    authentication,
    authorization
};