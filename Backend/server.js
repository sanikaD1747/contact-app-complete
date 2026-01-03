const express = require("express");
const cors = require("cors");
const connection = require("./config/db");
const ContactRouter = require("./routes/Contact.routes");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", ContactRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Server is connected with DB");
  } catch (error) {
    console.log("Server is not connected with DB");
    console.error(error.message);
  }

  console.log(`Server is listening on Port : ${PORT}`);
});
