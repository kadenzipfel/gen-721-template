const express = require("express");
const handlebars = require("express-handlebars");

const app = express();
const port = 3000;

app.set("view engine", "hbs");
app.engine(
  "hbs",
  handlebars({
    extname: "hbs",
    defaultLayout: "index",
    layoutsDir: __dirname + "/views/layouts",
  })
);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("main", { scriptName: "index.js" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
