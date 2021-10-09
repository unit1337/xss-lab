//@ts-check
const express = require("express");
const server = express();
const path = require("path");
const CSP = require("./csp");
const { parse } = require("node-html-parser");
const fs = require("fs");
const crypto = require("crypto");

const buildDir = path.join(process.cwd(), "build");

server.use(express.static(buildDir));

const rules = CSP();

const getDomain = (req) =>
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : `https://${req.hostname}`;

server.get("/with-csp", (req, res) => {
  const indexHtml = fs.readFileSync(path.join(buildDir, "index.html"), "utf-8");
  const DOM = parse(indexHtml);
  const head = DOM.querySelector("head");
  const nonce = crypto.randomBytes(32).toString("base64");
  const domain = getDomain(req);

  const args = { domain, nonce };

  res.header(rules.header, rules.HeaderStrictCsp(args));

  head.appendChild(
    parse(
      `<meta http-equiv="Content-Security-Policy" content="${rules.HtmlStrictCsp(
        args
      )}" />`
    )
  );

  const htmlElementsWithoutNonce = [
    ...DOM.querySelectorAll("script"),
    ...DOM.querySelectorAll("style"),
    ...DOM.querySelectorAll("link"),
  ];

  htmlElementsWithoutNonce.forEach((x) => x.setAttribute("nonce", nonce));

  return res.send(DOM.toString());
});

server.listen(5000, () => console.log(":5000"));
