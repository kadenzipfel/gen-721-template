const tokenId = window.location.pathname.split("/")[1];
const tokenHash = document.currentScript.getAttribute("tokenHash");

// Generates a random hash and token id each time you reload, in the following format
// let tokenData = {"hash":"0xd9134c11cd5ed9798ea0811364d63bd850c69c5d13383c9983ade39847e9ea86","tokenId":"99000000"};
function genTokenData(projectNum) {
  let data = {};
  let hash = "0x";
  for (var i = 0; i < 64; i++) {
    hash += Math.floor(Math.random() * 16).toString(16);
  }
  data.hash = hash;
  data.tokenId = projectNum * 1000000 + Math.floor(Math.random() * 1000);
  return data;
}

let tokenData;
// Use contract tokenHash if tokenId passed in, otherwise generate random token data
if (tokenId || tokenId === "0") {
  tokenData = { hash: tokenHash, tokenId: tokenId };
} else {
  tokenData = genTokenData(99);
}
