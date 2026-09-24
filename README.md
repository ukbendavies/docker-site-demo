# docker-site-demo

## Synopsis

Demonstration of a mkdocs site published to Azure AKS as a Docker image using a small nginx linux image as a base.

## Description

I created this repo to assist my understanding of potential workflows for linux based Docker images and hosting options such as Microsoft Azure Managed Kubernettes (AKS).

MkDocs and nginx were chosen as reasonable examples of a minimalist stack that runs within a Docker container.

The documents herein aims to cover core research topics and will hopefully help others exploring these topics. The example MkDocs site is available using GitHub Pages so that viewers can gain a flavour of what the running container would look like if the docs are followed. GitHub Pages is used to avoid on-going costs involved in Kubernetes container hosting for this non-production workload.

To assist learning, some factors are intentionally ignored such as official mkdocs docker images and the fact that mkdocs can host directly on GitHub pages, and other such facts.

## Playwright smoke tests

The Playwright tests verify navigation through the deployed documentation site:

1. Abstract
2. Build
3. Deploy
4. Back to Build

Each page is checked for its expected URL, title, and main heading.

Install the test dependencies and browser:

```bash
npm install
npx playwright install chromium
```

Run the tests headlessly:

```bash
npm test
```

Run the tests in a visible browser:

```bash
npm run test:headed
```

Use Playwright's interactive UI:

```bash
npm run test:ui
```

The tests target `https://bendavies.me` by default. Set `BASE_URL` to test
another deployment:

```bash
BASE_URL=http://localhost:8000 npm test
```

Set `SLOW_MO` in milliseconds to slow browser interactions:

```bash
SLOW_MO=1000 npm run test:headed
```
