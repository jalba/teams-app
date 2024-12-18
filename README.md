# Teams app

## Getting Started

### Requirements

Besides node and a package manager (pnpm, npm or yarn), you'll need docker desktop or something similar

### Installation

Install the dependencies:

```bash
pnpm install
```

```bash
npm install
```

or

```bash
yarn
```

### Running the application:

You have two choices here:

- you can either run the app entirely on docker
- or just run the db dockerized and the app itself on node

For the first option you'll need to run:

```bash
npm run docker:full
```

For the second one:

- first start the db:

```bash
npm run docker:db
```

- then the app:

```bash
npm run dev
```

Your application will be available at `http://localhost:3000`.

## Technical decisions

- Framework:
  I had originally thought about Remix, but when I went to their website I realised that they just released React Router V7, and that their recommendation was that if you needed to start a new project, you were better off using React Router, so that is what I did

- Visualization library:
  I realised early that I would need some form of data visualisation tool to represent the hierarchical structure of the teams. After a bit of search, I was convinced that React Flow would provide exactly what I needed, in terms of layout to represent this tree-like graph and I'm quite happy with the result

- ORM replacement:
  Since the requirement was not to use a full fledged ORM, I decided for pg-promise, that is merely a wrapper for node-pg, that gives you the control flow of promises to handle the results of your queries

- The rest:
  I tried to keep it as simple as possible and using the usual tools in web devepopment: tailwind and shadcn for styles and component library

## Query design decisions

Tried to keep it very simple and only hitting the db when exctricly necessary:

- main query for the home page, just a left join for the two tables in the db (teams and members), to bring all the necessary data in a single trip to the db
- for the edit page, again very similar to the other one, just bringing one result
- Some helper queries to bring some necessary data to update the team data
- One interesting part is that if you update the parent of a team, I decided to set the children of that team to have null as parent. This was to avoid circular graphs (if you i.e. assign as parent the children of that team) that would have loook weird and not make much sense. Not entirely sure if it was correct, but it feels like the right interation. With more time, the better solution would have been to check that the new parent is not a children of the team, and if is not, then just reassing the parent

## Notes on production deployment considerations

To be able to deploy this app in production there would be some work to be done. Mainly around handling the different environments, using a different docker compose file for each and have the necessary and sensitive data (db password and user) handled via env vars set by the CI/CD pipeline, etc
