const removeHttpProtocol = (url: string) => url.replace(/^https?:\/\//, "");

const splitIoDomains = `sdk.split.io auth.split.io streaming.split.io events.split.io`;

const newrelicDomains = `*.newrelic.com bam.nr-data.net`;

const newrelicScriptSrc = `https://js-agent.newrelic.com https://bam.nr-data.net https://bam-cell.nr-data.net`;

export namespace CSP {
  type Args = { domain: string; nonce: string };
  const baseUri = (args: Args) => `base-uri ${args.domain}`;

  const objectSrc = () => `object-src 'none'`;

  const defaultSrc = () => `default-src 'none'`;

  const styleSrc = (args: Args) => `style-src 'self' 'nonce-${args.nonce}'`;

  const styleSrcElementWithNonce = (args: Args) =>
    `style-src-elem 'self' 'report-sample' 'nonce-${args.nonce}' ${args.domain} fonts.gstatic.com`;

  const fontSrc = (args: Args) =>
    `font-src ${args.domain} fonts.gstatic.com 'report-sample'`;

  const cspDomains = (args: Args) =>
    `${args.domain} https://www.google-analytics.com/analytics.js ${newrelicDomains} 'report-sample'`;

  const scriptSrcElem = (args: Args) =>
    `script-src-elem 'self' 'report-sample' 'unsafe-inline' ${cspDomains(
      args
    )} 'nonce-${args.nonce}'`;

  const connectSrc = (args: Args) =>
    `connect-src ${newrelicDomains} ${removeHttpProtocol(
      args.domain
    )} ${splitIoDomains} www.google-analytics.com 'report-sample'`;

  const frameAncestor = () => `frame-ancestors 'none'`;

  const frameSrc = () => `frame-src 'none'`;

  const formAction = (args: Args) =>
    `form-action ${args.domain} 'nonce-${args.nonce}' 'report-sample'`;

  const imgSrc = (args: Args) =>
    `img-src 'self' ${args.domain} www.google-analytics.com data: 'report-sample'`;

  const prefetchSrc = (args: Args) => `prefetch-src 'self' ${args.domain}`;

  const manifestSrc = (args: Args) => `manifest-src 'none'`;

  const mediaSrc = (args: Args) => `media-src ${args.domain}`;

  const scriptSrc = (args: Args) =>
    `script-src ${args.domain} 'unsafe-inline' 'nonce-${args.nonce}' ${newrelicScriptSrc}`;

  const upgradeInsecureRequests = () => `upgrade-insecure-requests`;

  const reportUri = () => `report-uri /csp`;

  type Rule = (args: Args) => string;

  const htmlStrictRules: Rule[] = [
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

  const joinCspRules = (rules: Rule[], args: Args) =>
    rules.map((fn) => fn(args)).join(";");

  export const HtmlStrictCsp = (args: Args) =>
    joinCspRules(htmlStrictRules, args);

  export const HeaderStrictCsp = (args: Args) =>
    joinCspRules([...htmlStrictRules, reportUri, frameAncestor], args);

  export const header = "Content-Security-Policy";
}
