import express, { Request } from "express";
import path from "path";
import { CSP } from "./csp";
import { parse } from "node-html-parser";
import fs from "fs";
import crypto from "crypto";

const server = express();

const buildDir = path.join(process.cwd(), "..", "build");

server.use(express.static(buildDir));

const getDomain = (req: Request) =>
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

  res.header(CSP.header, CSP.HeaderStrictCsp(args));
  head.appendChild(
    parse(
      `<meta http-equiv="Content-Security-Policy" content="${CSP.HtmlStrictCsp(
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

type CspReport = {
  "csp-report": {
    "document-uri": string;
    referrer: string;
    "violated-directive": string;
    "effective-directive": string;
    "original-policy": string;
    disposition: string;
    "blocked-uri": string;
    "status-code": number;
    "script-sample": string;
  };
};

server.post(
  "/csp",
  express.json({
    type: [
      "application/json",
      "application/csp-report",
      "application/reports+json",
    ],
  }),
  express.urlencoded({ extended: true }),
  (req, res) => {
    const report: CspReport["csp-report"] = req.body["csp-report"];
    console.log({
      rule: report["original-policy"],
      directive: report["violated-directive"],
      blockedUri: report["blocked-uri"],
    });
    res.sendStatus(204);
  }
);

server.listen(5000, () => console.log(":5000"));
