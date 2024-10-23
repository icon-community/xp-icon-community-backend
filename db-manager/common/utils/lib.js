function parseUrl(url) {
  const inputInlowercase = url.toLowerCase();
  const urlRegex =
    /^((https|http):\/\/)?(([a-zA-Z0-9-]{1,}\.){1,}([a-zA-Z0-9]{1,63}))(:[0-9]{2,5})?(\/.*)?$/;

  const parsedUrl = {
    protocol: "https",
    path: "/",
    hostname: null,
    port: "443",
  };

  const regexResult = inputInlowercase.match(urlRegex);

  if (regexResult != null) {
    parsedUrl.protocol = regexResult[2] == null ? "https" : regexResult[2];
    parsedUrl.path = regexResult[7] == null ? "/" : regexResult[7];
    parsedUrl.hostname = regexResult[3] == null ? null : regexResult[3];
    parsedUrl.port = regexResult[6] == null ? "" : regexResult[6].slice(1);
  }

  return parsedUrl;
}

function isValidHex(str) {
  if (typeof str !== "string") {
    return false;
  }
  const hexRegex = /^0x[0-9a-fA-F]+$/;
  return hexRegex.test(str);
}

function isXChainWallet(wallet) {
  return wallet.includes("/");
}

function taskRunner(task, db) {
  return async (input) => await task(input, db);
}

module.exports = {
  isValidHex,
  isXChainWallet,
  parseUrl,
  taskRunner,
};
