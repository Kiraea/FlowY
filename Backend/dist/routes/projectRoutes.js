import express from 'express';
const router = express();
import { pool } from '../index.js';
import { queries } from '../queries/query.js';
router.get('/getProjects', async (req, res) => {
    try {
        let result = await pool.query(queries.project.getProjectsQ);
        res.status(200).json(result.rows);
    }
    catch (e) {
        res.status(403).json({ error: e });
    }
});
router.get(`/getProjectsById`, async (req, res) => {
    try {
        let result = await pool.query(queries.project.getProjectByIdQ);
        res.status(200).json({ result: result.rows });
    }
    catch (e) {
        res.json(403).json({ error: e });
    }
});
router.post('/getProjectMembersById', async (req, res) => {
    const { projectId } = req.body;
    console.log(projectId + "Dsadas");
    try {
        let result = await pool.query(queries.project.getProjectMembers, [projectId]);
        if (result.rowCount > 0) {
            res.status(200).json({ result: result.rows });
        }
        else {
            res.status(401).json({ error: "did not add" });
        }
    }
    catch (e) {
        res.status(500).json({ error: e });
    }
});
const checkIfValidURL = (urlLink) => {
    if (urlLink.includes('github.com/')) {
        return true;
    }
    else {
        return false;
    }
};
router.post('/createProject', async (req, res) => {
    const { userId, name, description, link, specifications, members } = req.body;
    let hasMembers = false;
    const githubLink = link === '' ? link : null;
    console.log(userId, name, description, link, specifications, members);
    if (req.body.members != null) {
        hasMembers = true;
    }
    if (githubLink !== null) {
        if (checkIfValidURL(githubLink) === false) {
            res.status(402).json({ error: "invalid github link" });
        }
    }
    try {
        if (!hasMembers) { // no other members inserted
            let res0 = await pool.query(queries.project.addProjectsQ, [name, description, githubLink, specifications]);
            if (res0.rowCount > 0) {
                let idR = res0.rows[0].id;
                try {
                    let res2 = await pool.query(queries.project.addProjectMembersQ, [idR, userId, 'leader']);
                    console.log("res2:", res2);
                    if (res2.rowCount > 0) {
                        res.status(200).json({ result: res2.rows });
                    }
                }
                catch (e) {
                    res.status(500).json({ error: e });
                }
            }
        }
        else {
            let res0 = await pool.query(queries.project.addProjectsQ, [name, description, githubLink, specifications]);
            if (res0.rowCount > 0) {
                let idR = res0.rows[0].id;
                let res2 = await pool.query(queries.project.addProjectMembersQ, [idR, userId, 'leader']);
                for (let i = 0; i < members.length; i++) {
                    await pool.query(queries.project.addProjectMembersQ, [idR, members[i], 'member']);
                }
                res.status(200).json({ result: res2 });
            }
        }
    }
    catch (e) {
        res.status(402).json({ error: e });
    }
});
export { router };
//# sourceMappingURL=projectRoutes.js.map