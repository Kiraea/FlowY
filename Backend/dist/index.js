import express from 'express';
import cors from 'cors';
import Pool from 'pg-pool';
import dotenv from 'dotenv';
dotenv.config();
import { router as userRoutes } from './routes/userRoutes.js';
import connectpgsimple from 'connect-pg-simple';
import session from 'express-session';
import bodyParser from 'body-parser';
import { router as projectRoutes } from './routes/projectRoutes.js';
import { router as taskRoutes } from './routes/taskRoutes.js';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
const pgSession = connectpgsimple(session);
const app = express();
var pool = new Pool({
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    ssl: false,
    max: 20, // set pool max size to 20
    idleTimeoutMillis: 1000, // close idle clients after 1 second
    connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
    maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
});
const corsOptions = {
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    credentials: true
};
app.use(cors(corsOptions));
// We have 3 types of sending data
// application/json
/// application/x-www-form-urlencoded
/// multipart/form-data
//app.use(express.json()) // multipart/form-data
//app.use(express.urlencoded({extended: false})) 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'user_sessions'
    }),
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true, // basically no javascript to access cookie,
        sameSite: 'strict',
        maxAge: 60000 * 60,
    }
}));
let i = 0;
app.use('/api', userRoutes);
app.use('/api', taskRoutes);
app.use('/api', projectRoutes);
app.get('/', (req, res) => {
    res.send('Hello World');
});
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    },
    maxHttpBufferSize: 1e8
});
io.on('connection', (socket) => {
    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });
    socket.on('joinProject', ({ projectId, displayName }) => {
        socket.join(`project_${projectId}`);
        io.to(`project_${projectId}`).emit(`${displayName} has joined this project`);
        console.log(`${displayName} joined this project ${projectId}`);
    });
    // Example: Handling errors globally
    socket.on('error', (err) => {
        console.error('Socket error:', err);
    });
    socket.on('undo', ({ userId, projectId }) => {
        console.log(userId, projectId, " this user sent undo");
        socket.to(`project_${projectId}`).emit('receiveUndoDrawings', userId);
    });
    socket.on(`draw`, ({ projectId, drawingStroke }) => {
        try {
            console.log(i);
            i++;
            //console.log(drawingData.width , drawingData.height, drawingArray, "drawing data");
            console.log(drawingStroke.type);
            socket.to(`project_${projectId}`).emit('receiveIncomingDrawings', drawingStroke);
        }
        catch (err) {
            console.log(err);
        }
    });
    /*
    6
    
    This is by design in the socket.io API. This form you were using:
    
    socket.to(channelId).emit(...)
    is specifically designed to send to all sockets in the channelId room EXCEPT socket.
    
    If you want to send to ALL users in that room, then change the above code to:
    
    io.to(channelId).emit(...)
    */
    socket.on(`leaveProject`, ({ projectId, displayName }) => {
        console.log(`${displayName} left project:${projectId}`);
        socket.leave(`project_${projectId}`); // to actually remove the socket from the room
    });
});
const run = async () => {
    server.listen(process.env.PORT, () => {
        console.log(`${process.env.PORT}`);
        try {
            setupDatabase();
        }
        catch (e) {
            console.log(e);
        }
    });
};
run();
// So in PostgreSQL we have the concept of DB(we put this in pool config) and then inside those DBs are schema, we create a 'kanban' schema and we select it
// by doign search_path to
const setupDatabase = async () => {
    await pool.query("SET search_path TO 'kanban';");
    /*
      await pool.query(`DROP TABLE IF EXISTS task_comments;`);
      await pool.query(`DROP TABLE IF EXISTS task_members;`);
      await pool.query(`DROP TABLE IF EXISTS project_members;`);
      await pool.query(`DROP TABLE IF EXISTS friend_request;`);
      await pool.query(`DROP TABLE IF EXISTS user_sessions;`);
      await pool.query(`DROP TABLE IF EXISTS friends;`);
      await pool.query(`DROP TABLE IF EXISTS users;`);
      await pool.query(`DROP TABLE IF EXISTS tasks;`);
      await pool.query(`DROP TABLE IF EXISTS projects;`);
    
      // Drop types (now that tables are gone)
      await pool.query(`DROP TYPE IF EXISTS status_enum CASCADE;`);
      await pool.query(`DROP TYPE IF EXISTS task_priority_type CASCADE;`);
      await pool.query(`DROP TYPE IF EXISTS task_status_type CASCADE;`);
      await pool.query(`DROP TYPE IF EXISTS role_type CASCADE;`);
      await pool.query(`CREATE TYPE status_enum AS ENUM('pending', 'accepted', 'rejected');`);
      await pool.query(`CREATE TYPE task_priority_type AS ENUM('low', 'medium', 'high');`);
      await pool.query(`CREATE TYPE task_status_type AS ENUM('todo', 'in-progress', 'review', 'done');`);
      await pool.query(`CREATE TYPE role_type AS ENUM ('leader', 'member', 'admin');`);
    */
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      display_name VARCHAR(255) UNIQUE NOT NULL,
      is_disabled BOOLEAN DEFAULT FALSE
    );`);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "user_sessions" (
      "sid" varchar NOT NULL PRIMARY KEY,
      "sess" json NOT NULL,
      "expire" timestamp(6) NOT NULL
      )
      WITH (OIDS=FALSE);
      `);
    await pool.query(`CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "user_sessions" ("expire");`);
    console.log("0");
    /*
  await pool.query(`
    CREATE TABLE IF NOT EXISTS friends (
      id SERIAL PRIMARY KEY,
      user_id_1 INTEGER,
      user_id_2 INTEGER,
      CONSTRAINT fk_user1 FOREIGN KEY (user_id_1)
      REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_user2 FOREIGN KEY (user_id_2)
      REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE (user_id_1, user_id_2)
      );
    `)
    console.log("1")
    await pool.query(`
      CREATE TABLE IF NOT EXISTS friend_request (
        id SERIAL PRIMARY KEY,
        sender_user INTEGER,
        receiver_user INTEGER,
        status status_enum,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_sender FOREIGN KEY (sender_user)
        REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_receiver FOREIGN KEY (receiver_user)
        REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE (sender_user, receiver_user)
        );
      `)
    */
    console.log("2");
    await pool.query(`
          CREATE TABLE IF NOT EXISTS projects (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            github_link VARCHAR(255) NULL,
            specifications VARCHAR(255) NOT NULL,
            created_at DATE DEFAULT CURRENT_DATE
          );
        `);
    await pool.query(`
          CREATE TABLE IF NOT EXISTS project_members (
            project_id uuid NOT NULL,
            member_id uuid NOT NULL,
            role role_type,
            CONSTRAINT fk_project_id_project_members FOREIGN KEY (project_id)
            REFERENCES projects(id) ON DELETE CASCADE,
            CONSTRAINT fk_member_id_project_members FOREIGN KEY (member_id)
            REFERENCES users(id) ON DELETE CASCADE,
            PRIMARY KEY (project_id, member_id)
          );     
        `);
    await pool.query(`
          CREATE TABLE IF NOT EXISTS tasks (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            task_title VARCHAR(255) NOT NULL,
            task_priority task_priority_type NOT NULL,
            task_status task_status_type NOT NULL,
            task_update status_enum NOT NULL,
            created_at DATE DEFAULT CURRENT_DATE,
            project_id uuid NOT NULL,
            CONSTRAINT fk_project_id_tasks FOREIGN KEY (project_id)
            REFERENCES projects(id) ON DELETE CASCADE
          );
        `);
    await pool.query(`CREATE TABLE IF NOT EXISTS task_comments (
              id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
              task_id uuid,
              project_member_id uuid, 
              project_id uuid,
              comment VARCHAR(255) NOT NULL,
              created_at DATE DEFAULT CURRENT_DATE,
              edited BOOLEAN NOT NULL,
              CONSTRAINT fk_project_member_task_comments FOREIGN KEY (project_member_id, project_id)
              REFERENCES project_members(member_id, project_id) ON DELETE CASCADE,
              CONSTRAINT fk_task_id_task_comments FOREIGN KEY (task_id)
              REFERENCES tasks(id) ON DELETE CASCADE
          );`);
    await pool.query(`
          CREATE TABLE IF NOT EXISTS task_members (
            task_user_id uuid NOT NULL,
            project_id uuid,
            task_id uuid NOT NULL,
            CONSTRAINT fk_member_id_task_members FOREIGN KEY(task_user_id, project_id)
            REFERENCES project_members(member_id, project_id),
            CONSTRAINT fk_task_id_task_members FOREIGN KEY(task_id)
            REFERENCES tasks(id),
            PRIMARY KEY (task_id, task_user_id)
          ); 
        `);
    console.log("6");
    /*
  await pool.query(`
    CREATE TABLE IF NOT EXISTS friend_request (
      id SERIAL PRIMARY KEY,
      INTEGER,
      receiver_user INTEGER,
      status status_enum,
      sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_sender FOREIGN KEY (sender_user)
      REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_receiver FOREIGN KEY (receiver_user)
      REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE (sender_user, receiver_user)
      );
    `)
  */
};
export { pool };
//# sourceMappingURL=index.js.map