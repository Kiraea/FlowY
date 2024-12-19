
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

        addProjectMembersByDisplayName:`
            INSERT INTO project_members (project_id, member_id, role)
            VALUES (
            $1,
            (SELECT u.id FROM users u WHERE u.display_name = $2),
            $3) RETURNING *`,
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
            SELECT pm.role, u.display_name, pm.member_id
            FROM project_members pm JOIN users u
                ON pm.member_id = u.id
            WHERE pm.project_id = $1;
        `,
        getProjectByUserIdQ:`
            SELECT p.id, p.name, p.description, TO_CHAR(p.created_at, 'YYYY Month DD') as created_at_formatted, p.github_link, p.specifications, 
            (SELECT COUNT(DISTINCT pm2.member_id)
            FROM project_members pm2
            WHERE pm2.project_id = p.id) as member_count
            FROM projects p 
            JOIN project_members pm ON p.id = pm.project_id
            WHERE pm.member_id = $1
            GROUP BY p.id, p.name, p.description, p.created_at, p.github_link, p.specifications;
        `,
        getProjectMemberByIdQ:`
            SELECT pm.project_id, pm.member_id, pm.role
            FROM project_members pm
            WHERE pm.project_id = $1 AND pm.member_id = $2;
        `,
        updateProjectMemberRole:`
            UPDATE project_members
            SET role = $1
            WHERE member_id = $2 AND project_id = $3 RETURNING *;
        `,
    },
    tasks:{
        getTasksQ:`
            SELECT t.*
            FROM tasks t;
        `,
        getTaskByProjectIdQ:`
            SELECT t.*
            FROM tasks t
            WHERE t.project_id = $1;
        `,
        addTaskQ:`
            INSERT INTO tasks (task_title, task_priority, task_status, project_id)
            VALUES
            ($1, $2, $3, $4) RETURNING *;
        `,
        updateTaskStatusQ:`
            UPDATE tasks
            SET task_status = $1
            WHERE id = $2 RETURNING *;
        `,
        getTaskMembersByProjectIdQ:`
            SELECT t.*
            FROM task_members t
            WHERE t.project_id = $1;
        `,

        getTaskMembersUByProjectIdQ:`
            SELECT u.id, u.display_name, tm.task_id
            FROM task_members tm JOIN project_members pm
                        ON tm.task_user_id = pm.member_id AND tm.project_id = pm.project_id
                        JOIN users u ON u.id = pm.member_id
            WHERE tm.project_id = $1;
        `,
        addTaskMemberQ:`
            INSERT INTO task_members (task_user_id, project_id, task_id)
            VALUES
            ($1, $2, $3) RETURNING *;
        `,
        addTaskFullQ:`
            INSERT INTO tasks (task_title, task_priority, task_status, project_id, task_update)
            VALUES
            ($1, $2, $3, $4, $5) RETURNING *;
        `,
        deleteTaskQ:`
            DELETE FROM tasks
            WHERE id = $1;
        `,
        updateTaskQ:`
            UPDATE tasks
            SET task_title = $1, task_status = $2, task_priority = $3
            WHERE id = $4;
        `,
        updateTaskUpdate:`
            UPDATE tasks
            SET task_update = $1
            WHERE id = $2 RETURNING *;
        `,
        getUserTask:`
            SELECT t.*
            FROM tasks t JOIN task_members tm
                        ON t.id = tm.task_id
            WHERE t.project_id = $1 AND tm.task_user_id = $2
        `,
        deleteAllTaskMembersQ:`
            DELETE FROM task_members 
            where task_id = $1 RETURNING *;
        `,
        addAllTaskMembersQ:`
            INSERT INTO task_members (task_user_id, project_id, task_id)
            VALUES ($1, $2, $3) RETURNING *;
        `

    }

}





export {queries}