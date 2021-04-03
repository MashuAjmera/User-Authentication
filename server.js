const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5000;
const uri = process.env.URI;

const authRouter = require("./routes/auth.route");
const usersRouter = require("./routes/users.route");

const app = express();
app.use(express.json());
app.use(cors()); // CORS Middleware

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("views/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "views", "build", "index.html"));
  });
}
//  else app.use('/static',express.static(path.join(__dirname,"kids-activity-app", "src","static")));

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully.");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
