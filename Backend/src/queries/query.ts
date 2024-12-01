
const queries = {
    user: {
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
        `,

        getDisplayName:`
            SELECT u.display_name
            FROM users u 
            WHERE u.id = $1;
        `,
        getDisplayNameAndId:`
            SELECT u.display_name, u.id
            FROM USERS u
            where u.id = $1;
        `
    },
    project:{
        addProjectsQ:`
            INSERT INTO projects (name, description, github_link, specifications)
            VALUES ($1, $2, $3, $4) RETURNING *;
        `,

        addProjectMembersQ:`
            INSERT INTO project_members (project_id, member_id, role)
            VALUES ($1, $2, $3) RETURNING *;
        `,
        getProjectsQ:`
            SELECT p.*
            FROM projects p;
        `,
        getProjectByIdQ:`
            SELECT p.*
            from projects p
            WHERE p.id = $1;
        `,
        getProjectMembers:`
            SELECT pm.*
            FROM project_members pm
            WHERE pm.project_id = $1;
        `,
        getProjectByUserIdQ:`
            SELECT p.id, p.name, p.description, TO_CHAR(p.created_at, 'YYYY Month DD') as created_at_formatted, p.github_link, p.specifications, 
                COUNT(pm.member_id) as member_count
            FROM projects p 
            JOIN project_members pm ON p.id = pm.project_id
            WHERE pm.member_id = $1
            GROUP BY p.id, p.name, p.description, p.created_at, p.github_link, p.specifications;
        `
    },
}





export {queries}