'use strict'
const User = require('./User');
const db = require('../db');
const bcrypt = require('bcrypt');

/**
 * Function to create a User object from a row of the Person table
 * @param {*} row a row of the users table
 */
const createUser = function (row) {

    const userID = row.UserID;
    const fullName = row.Name + ' ' + row.Surname;
    const username = row.UserName;
    const passwordHash = row.Password;
    const accessLevel = row.AccessLevel;
    const hasDoneTutorial = row.Tutorial;
    return new User(userID, fullName, username, passwordHash, accessLevel, hasDoneTutorial);
}

exports.getUser = (username) => {

    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM User WHERE UserName = ?"
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

exports.getUserByID = (userID) => {

    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM User WHERE UserID = ?"
        db.all(sql, [userID], (err, rows) => {
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

exports.setTutorialCompleted = (userID) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE User SET Tutorial = 1 WHERE UserID = ?"
        db.all(sql, [userID], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        });
    });
};