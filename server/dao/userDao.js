'use strict'
const User = require('./User');
const db = require('../db');
const bcrypt = require('bcrypt');

/**
 * Function to create a User object from a row of the Person table
 * @param {*} row a row of the users table
 */
const createUser = function (row) {

    const username = row.UserName;
    const passwordHash = row.Password;
    const accessLevel = row.AccessLevel; //controlla qui il nome delal colonna nel db!
    return new User(username, passwordHash, accessLevel);
}

exports.getUser = (username) => {

    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Person WHERE UserName = ?" //controlla qui il nome delal colonna nel db!
        db.all(sql, [username], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else {
                const user = createUser(rows[0]);
                resolve(user);
            }
        });
    });
};

exports.checkPassword = function (user, password) {
    return bcrypt.compareSync(password, user.passwordHash);
}