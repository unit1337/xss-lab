//@ts-check

const removeHttpProtocol = (url) => url.replace(/^https?:\/\//, "");

const splitIoDomains = `sdk.split.io auth.split.io streaming.split.io events.split.io`;

const newrelicDomains = `*.newrelic.com bam.nr-data.net`;

const newrelicScriptSrc = `https://js-agent.newrelic.com https://bam.nr-data.net https://bam-cell.nr-data.net`;

module.exports = () => {
  const baseUri = (args) => `base-uri ${args.domain}`;

  const objectSrc = () => `object-src 'none'`;

  const defaultSrc = () => `default-src 'none'`;

  const styleSrc = (args) => `style-src 'self' 'nonce-${args.nonce}'`;

  const styleSrcElementWithNonce = (args) =>
    `style-src-elem 'self' 'report-sample' 'nonce-${args.nonce}' ${args.domain} fonts.gstatic.com`;

  const fontSrc = (args) => `font-src ${args.domain} fonts.gstatic.com`;

  const cspDomains = (args) =>
    `${args.domain} https://www.google-analytics.com/analytics.js ${newrelicDomains}`;

  const scriptSrcElem = (args) =>
    `script-src-elem 'self' 'report-sample' 'unsafe-inline' ${cspDomains(
      args
    )} 'nonce-${args.nonce}'`;

  const connectSrc = (args) =>
    `connect-src ${newrelicDomains} ${removeHttpProtocol(
      args.domain
    )} ${splitIoDomains} www.google-analytics.com`;

  const frameAncestor = () => `frame-ancestors 'none'`;

  const frameSrc = () => `frame-src 'none'`;

  const formAction = (args) =>
    `form-action ${args.domain} 'nonce-${args.nonce}' 'report-sample'`;

  const imgSrc = (args) =>
    `img-src 'self' ${args.domain} www.google-analytics.com data:`;

  const prefetchSrc = (args) => `prefetch-src 'self' ${args.domain}`;

  const manifestSrc = (args) => `manifest-src ${args.domain}`;

  const mediaSrc = (args) => `media-src ${args.domain}`;

  const scriptSrc = (args) =>
    `script-src ${args.domain} 'unsafe-inline' 'nonce-${args.nonce}' ${newrelicScriptSrc}`;

  const upgradeInsecureRequests = () => `upgrade-insecure-requests`;

  const htmlStrictRules = [
    baseUri,
    mediaSrc,
    manifestSrc,
    prefetchSrc,
    connectSrc,
    defaultSrc,
    fontSrc,
    frameSrc,
    imgSrc,
    objectSrc,
    scriptSrc,
    formAction,
    scriptSrcElem,
    styleSrc,
    styleSrcElementWithNonce,
    upgradeInsecureRequests,
  ];

  const joinCspRules = (rules, args) => rules.map((fn) => fn(args)).join(";");

  const HtmlStrictCsp = (args) => joinCspRules(htmlStrictRules, args);

  const HeaderStrictCsp = (args) =>
    joinCspRules([...htmlStrictRules, frameAncestor], args);

  const header = "Content-Security-Policy";

  return {
    HtmlStrictCsp,
    HeaderStrictCsp,
    header,
  };
};
