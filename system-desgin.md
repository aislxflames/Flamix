vercel-clone/
│
├── proxy/ # Traefik Reverse Proxy Layer
│ ├── docker-compose.yml
│ ├── traefik.toml # OR traefik.yml (choose one)
│ └── letsencrypt/ # Stored certificates
│ └── acme.json
│
│
├── backend/ # Express.js Deployment Engine
│ ├── src/
│ │ ├── app.ts
│ │ ├── config/
│ │ │ ├── mongo.ts
│ │ │ └── docker.ts
│ │ ├── controllers/
│ │ │ ├── deploy.controller.ts
│ │ │ ├── appstore.controller.ts
│ │ │ └── domain.controller.ts
│ │ ├── routes/
│ │ │ ├── deploy.routes.ts
│ │ │ ├── appstore.routes.ts
│ │ │ └── domain.routes.ts
│ │ ├── services/
│ │ │ ├── docker.service.ts
│ │ │ ├── appstore.service.ts
│ │ │ └── domain.service.ts
│ │ ├── queue/ # Build + Deployment Workers
│ │ │ ├── index.ts
│ │ │ ├── build.worker.ts
│ │ │ └── deploy.worker.ts
│ │ ├── models/
│ │ │ ├── Project.ts
│ │ │ ├── Deployment.ts
│ │ │ └── App.ts
│ │ └── utils/
│ │ ├── logger.ts
│ │ └── helpers.ts
│ ├── package.json
│ └── tsconfig.json
│
│
├── frontend/ # Next.js UI
│ ├── app/
│ │ ├── layout.tsx
│ │ ├── page.tsx
│ │ ├── deploy/
│ │ │ └── page.tsx
│ │ ├── logs/
│ │ │ └── page.tsx
│ │ ├── project/
│ │ │ └── [id]/
│ │ │ └── page.tsx
│ │ └── api/ # Only lightweight UI APIs
│ │ └── projects/
│ │ └── route.ts
│ ├── components/
│ ├── lib/
│ ├── public/
│ ├── package.json
│ └── next.config.js
│
│
├── databases/
│ ├── docker-compose.yml # MongoDB + Redis
│ ├── mongo/
│ │ └── data/
│ └── redis/
│ └── data/
│
│
├── dev-docker-compose.yml # Combine Everything for local dev
└── README.md
