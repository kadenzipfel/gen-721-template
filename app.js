const express = require("express");
const handlebars = require("express-handlebars");
const ethers = require("ethers");
const abi = require("./abi.json");
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

app.get("/", (req, res) => {
  res.render("main", { scriptName: "index.js" });
});

app.get("/:tokenId", async (req, res) => {
  const provider = await new ethers.getDefaultProvider("rinkeby");
  const contract = new ethers.Contract(
    "0x5D8D97C344f86B1a36F95A05aA1e1C00d8Ca0f9b",
    abi,
    provider
  );
  const tokenHash = await contract.tokenIdToHash(
    ethers.BigNumber.from(req.params.tokenId)
  );
  res.render("main", { scriptName: "index.js", tokenHash });
});

app.get("/token/:tokenId", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      name: `#${req.params.tokenId}`,
      description: "A series of generative art NFTs.",
      image: fullUrl(req, `/${req.params.tokenId}`),
    })
  );
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
