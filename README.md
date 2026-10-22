# ufitgo-web

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_F7KBVL2GGPEovy6c1R3uhLMJuhRa)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## API-owned discovery and featured experiences

`/packages` sends filters and pagination to the public Operator API and loads
category labels, selling seasons, year counts, warnings and configured defaults
from `/api/operator/packages/public/discovery`. Defaults are never calculated
from the browser's calendar. Hajj/Ramadan explicit selections use `seasonYear`;
ordinary Umrah uses departure `year`, with `yearMode=specific`. Category shortcuts
clear previous restrictions; empty seasons offer an all-upcoming-years action.
Search uses `title`, price filtering uses `budget`, and month uses lowercase names.

The marketing page retains its existing design and non-package content. Its
existing experience placement now renders the ordered package sections returned
by `/api/operator/packages/public/home-feed`, with exact collection filters in
“See all” links. Advert sections are not turned into package cards; existing ad
surfaces remain untouched. Empty/disabled sections never trigger local inventory
selection. Discovery/feed requests are uncached so configuration changes are not
hidden by the previous one-hour cache.

Run focused contract tests with `node --test tests/package-discovery.test.cjs`.
Use `npx --no-install tsc --noEmit --incremental false` for full typechecking and
`npm run build` for the website build.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.
