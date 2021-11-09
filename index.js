const express = require("express");
const mongoose = require("mongoose");
const app = express();
const config = require("./config");
const port = process.env.port || 314;
const userRoute = require("./routes/user");
const { Client } = require('pg');
const postgresql = new Client({
    host: config.postgresql_db_host,
    user: config.postgresql_db_user,
    port: config.postgresql_db_port,
    password: config.postgresql_db_password,
    database:config.postgresql_db,
  });

postgresql.connect(function (err) {
    if (err) {
        console.log('Database connection failed: ' + err.stack);
        return;
    }

    console.log('Connected to PostgreSQLdatabase.');
});
 







mongoose.connect("mongodb+srv://zameelabdulsammed:Outlookthreeonefour@meshtorycluster.xle7t.mongodb.net/meshtoryMDB?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology:true,

});

const connection = mongoose.connection;
connection.once("open",()=>{
    console.log("MongoDBLOCAL connected"); 

});
app.use(express.json());

app.use("/user",userRoute);




app.route("/").get((req, res) => res.json("meshtory day 0123"));

app.listen(port, () => console.log(`your server is running on port ${port}`));