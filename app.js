const express = require("express");
const handlebars = require("express-handlebars");
const url = require("url");

const app = express();
const port = 3000;

function fullUrl(req, path) {
  return url.format({
    protocol: req.protocol,
    host: req.get("host"),
    pathname: path,
  });
}

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

app.get("/:tokenId", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      name: `#${req.params.tokenId}`,
      description: "A series of generative art NFTs.",
      image: fullUrl(req, `/image/${req.params.tokenId}`),
    })
  );
});

app.get("/", (req, res) => {
  res.render("main", { scriptName: "index.js" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
