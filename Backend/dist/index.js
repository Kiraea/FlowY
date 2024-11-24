import express from 'express';
import cors from 'cors';
import Pool from 'pg-pool';
import dotenv from 'dotenv';
dotenv.config();
import { router as userRoutes } from './routes/userRoutes.js';
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
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true
};
app.use(cors(corsOptions));
// We have 3 types of sending data
// application/json
/// application/x-www-form-urlencoded
/// multipart/form-data
app.use(express.json()); // multipart/form-data
app.use(express.urlencoded({ extended: false }));
app.use('/api', userRoutes);
app.get('/', (req, res) => {
    res.send('Hello World');
});
const run = async () => {
    app.listen(process.env.PORT, () => {
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
    //await pool.query("DROP TYPE IF EXISTS status_enum");
    //await pool.query(`CREATE TYPE status_enum AS ENUM('pending', 'accepted', 'rejected')`);
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      display_name VARCHAR(255) NOT NULL,
      is_disabled BOOLEAN DEFAULT FALSE   
    );`);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS friends (
        id SERIAL PRIMARY KEY,
        user_id_1 INTEGER,
        user_id_2 INTEGER, 
        CONSTRAINT fk_user1 FOREIGN KEY (user_id_1)
        REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_user2 FOREIGN KEY (user_id_2)
        REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT unique_friend UNIQUE (user_id_1, user_id_2)
        );
      `);
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
          CONSTRAINT unique_request UNIQUE (sender_user, receiver_user)
          );
        `);
};
export { pool };
/*
The constraint unique_friendship UNIQUE (user_id_1, user_id_2) ensures that no two friendships can exist between the same pair of users, regardless of the order.
This means that if you already have a row where user_id_1 = 1 and user_id_2 = 2, you cannot insert another row with user_id_1 = 2 and user_id_2 = 1, because these represent the same friendship.
*/ 
//# sourceMappingURL=index.js.map