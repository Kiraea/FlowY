
const queries = {
    checkIfExistQ:`
    SELECT u.* from users u
    WHERE u.username = $1;
    `,

    loginQ:`
    SELECT u.username from users u
    WHERE u.username = $1 AND u.password = $2;
    `,

    registerQ:`
    INSERT INTO users (username, password, display_name)
    VALUES 
    ($1, $2, $3) RETURNING *;
    `,

    getUsersQ:`
    SELECT u.* 
    FROM users u;
    `,
    checkUsersPassword:`
        SELECT u.*
        FROM users u
        WHERE u.username = $1 and u.password = $2;
    `
    


}

export {queries as userQueries}