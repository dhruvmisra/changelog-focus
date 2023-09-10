<h1 align="center">Changelog Focus</h1>

<h3 align="center">Focus on the changelog relevant to you</h3>

<div align="center">
<img src="https://img.shields.io/badge/next.js-gray?logo=next.js">

<img src="https://img.shields.io/badge/AWS%20Amplify-orange?logo=amazon-aws">

<a href="https://changelogfocus.dhruvmisra.com">
    <img src="https://img.shields.io/website.svg?down_color=red&down_message=down&up_color=green&up_message=up&url=https%3A%2F%2Fchangelogfocus.dhruvmisra.com%2F">
</a>

<img src="https://img.shields.io/github/languages/top/dhruvmisra/changelog-focus.svg?style=flat&color=informational">

<img src="https://img.shields.io/github/issues/dhruvmisra/changelog-focus.svg">

<img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat">

<img src="https://img.shields.io/badge/made%20by-dhruvmisra-blue.svg">
</div>

<br/>

Changelog Focus let's you aggregate changelog across releases and let's you pick and choose the changelog items relevant to your codebase.

https://github.com/dhruvmisra/changelog-focus/assets/40134655/8512f266-be6c-48c2-ae21-1483c92034c3


## Motivation

We all have to upgrade dependencies on our projects and there is no easy way to check what all has changed across multiple versions of a dependency. We end up scrolling through different release changelogs, checking all features, fixes and figuring out if a specific change is relevant for our codebase or not.

To simplify this a little, I built a changelog aggregator which allows you to select a range of releases to fetch the changelog, combine different sections and select relevant line items to focus on.

Also, a lot of enterprise level software organisations don't maintain complete changelog on GitHub releases and instead have it on their website. (e.g. Kong API gateway). Therefore, the tool also supports scraping some of these websites to fetch the changelog content and provide similar functionality.

## Features

-   Add any GitHub repository link which maintains releases. Or any other link containing changelog content. (See [allowed hosts](./docs/allowed-hosts-for-scraping.md))
-   Click on individual line items to select, then click FOCUS button to show only those line items
-   Search for specific keywords in changelog relevant to your codebase
-   Remove entire blocks which are useless like Documentation updates
-   Share focused changelog with the team

## How does it work?

### GitHub releases

For GitHub links, the GitHub releases for the repository are fetched directly on client-side, thanks to the GitHub public API without CORS restriction.

Releases are fetched, markdown is parsed and list items are aggregated to view the changelog.

### Scraped releases

For non-GitHub links, things get a little tricky.

-   The request is sent to the server-side API which opens the page in a headless chromium browser using [puppeteer](https://github.com/puppeteer/puppeteer) and scrapes the HTML for ['changelog content'](#what-is-changelog-content).
-   The HTML content is then converted to markdown and sent back to the client.
-   After this point, it follows the same GitHub releases flow: markdown is parsed and list items are aggregated to view the changelog.

#### What is 'changelog content'?

Currently, what we define as changelog content is:

-   A heading which matches a semantic version (e.g. v2.4.6)
-   An unordered list of content followed by the previous heading

This is of course not perfect but works in a lot of cases. Will try to keep improving this moving forward.

#### Why not simply make a GET request instead of opening in headless browser?

A lot of websites use a client-side rendered application, which doesn't have any content in the `index.html` file returned in the GET request.

## Development

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`. Make sure you have node v18 installed along with `yarn`.

### 1. Install dependencies

```bash
yarn install
```

### 2. Create .env

```bash
cp .env.example .env
```

### 3. Install chromium for puppeteer

This is required to make scraping work locally. ([ref](https://github.com/Sparticuz/chromium#running-locally--headlessheadful-mode))

Run:

```bash
npx @puppeteer/browsers install chromium@latest --path /tmp/localChromium
```

and copy the output path (`/tmp/localChromium/chromium/mac-1194571/chrome-mac/Chromium.app/Contents/MacOS/Chromium`) to `CHROMIUM_PATH` in .env

### 4. Run development server

```bash
yarn dev
```

The application will be available on `http://localhost:3000`.

## Contributing

Contributions are welcome. Please refer to [contributing guidelines](./CONTRIBUTING.md) for more information.

## Future scope

-   Support a switch to using `CHANGELOG.md` file defined in most repositories if release notes are not sufficient
-   Use LLMs like ChatGPT to summarize and de-duplicate changelog content
-   Add a `package.json`, `pyproject.yaml` or any other file with dependencies and produce a summarized changelog for all dependencies to the required version

## Support Me

Help me keep this project running.

<a href="https://www.buymeacoffee.com/dhruvmisra" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" width="120" >
</a>
