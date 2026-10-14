# SkillUp

This is a monorepo for the SkillUp project with:  
- **Frontend**: Vite + React + TypeScript + TailwindCSS  
- **Backend**: .NET 8 API  

## Folder Structure

```
skillup/
├─ skillup.client/ # Frontend
├─ skillup.server/ # Backend
```

---

## Prerequisites

Make sure you have installed:  
- Node.js 
- npm (comes with Node.js)  
- .NET 8 SDK  

## Setup Instructions

### 1. Clone the repository

```bash
git clone git@github.com:glafver/skillup.git
cd skillup
```

### 2. Setup Backend

```bash
cd skillup.server
dotnet restore
dotnet run
```

Runs backend API at http://localhost:5178

### 3. Environment Variables

Make a copy of the provided example.env in skillup.client folder and rename it to .env

### 4. Setup Frontend

Make sure backend is running first

```bash
cd skillup.client
npm install
npm run dev
```

Runs frontend at http://localhost:5173

---

## Docker

The whole app (frontend + API) runs in one container: nginx serves the built
frontend and proxies `/api` to the ASP.NET backend running next to it. Because the
browser talks to the same origin, there are no CORS issues.

Start the stack (app + MongoDB):

```bash
docker compose up --build
```

The app is then available at <http://localhost:8090>. Change the host port with the
`APP_PORT` environment variable.

Useful commands:

```bash
docker compose logs -f app     # follow logs
docker compose down            # stop
docker compose down -v         # stop and delete the MongoDB volume
```

To build and run the image without Compose (an external MongoDB is required):

```bash
docker build --build-arg VITE_API_URL=http://localhost:8080 -t skillup .
docker run --rm -p 8080:8080 \
  -e MongoDBSettings__ConnectionString="mongodb://host.docker.internal:27017" \
  -e MongoDBSettings__DatabaseName="SkillupDB" \
  -e Jwt__Key="a-random-key-of-at-least-32-chars" \
  skillup
```

Inside the container `PORT` (default `8080`) is the public port served by nginx,
while `SERVER_PORT` (default `5000`) is the internal port used by ASP.NET. Cloud Run
sets `PORT` automatically.

The client calls the API on the same origin, so `VITE_API_URL` must be the final
public URL and is baked in at build time.

## Deploy to Cloud Run

Cloud Run is stateless, so MongoDB must be hosted externally (MongoDB Atlas). Cloud
Run egress IP addresses are not static, so the Atlas cluster has to accept
connections from `0.0.0.0/0` (or use a VPC connector).

Deployment is automated with GitHub Actions
([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)): on every push to
`main` it builds the image on the runner and deploys it to Cloud Run.

One-time setup — add these under Settings → Secrets and variables → Actions:

| Kind   | Name                      | Value                                            |
| ------ | ------------------------- | ------------------------------------------------ |
| Secret | `GCP_SA_KEY`              | JSON key of the `github-actions` service account  |
| Secret | `MONGO_CONNECTION_STRING` | MongoDB Atlas connection string                   |
| Secret | `JWT_KEY`                 | a random string of at least 32 characters         |

Project, region and service name are configured at the top of the workflow file. The
Artifact Registry repository is created on the first run, which requires
`roles/artifactregistry.admin` for the deploy service account.

### Security note

`skillup.server/appsettings.json` contains a working MongoDB Atlas connection string
and a JWT key, while the repository is public. Those credentials should be rotated,
and the file reduced to placeholders with the real values supplied through
environment variables (`MongoDBSettings__ConnectionString`, `Jwt__Key`) — which is
what the workflow does.
