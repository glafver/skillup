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

The frontend reads `VITE_API_URL`: copy `skillup.client/example.env` to
`skillup.client/.env` and adjust it.

The backend needs a MongoDB connection string and a JWT key, which are **not**
committed. Copy `skillup.server/example.env` and export the variables, for example:

```bash
export MongoDBSettings__ConnectionString="mongodb+srv://user:password@cluster.mongodb.net/?retryWrites=true&w=majority"
export Jwt__Key="a-random-string-of-at-least-32-characters"
dotnet run --project skillup.server
```

The API refuses to start with a clear message if either value is missing.

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
| Secret | `ADMIN_EMAIL`             | email of the administrator account                |
| Secret | `ADMIN_PASSWORD`          | password for the administrator account            |

Project ID, project number, region and service name are configured at the top of the
workflow file. The project number is used to build the public Cloud Run URL, which is
baked into the client as `VITE_API_URL`. The Artifact Registry repository is created
on the first run, which requires `roles/artifactregistry.admin` for the deploy
service account.

### Secrets

Secrets are never committed: `appsettings.json` only holds non-secret defaults, and
the API refuses to start without the values below. In Cloud Run they are supplied by
the workflow from GitHub Secrets.

| Variable                            | Description                                      |
| ----------------------------------- | ------------------------------------------------ |
| `MongoDBSettings__ConnectionString` | MongoDB Atlas connection string                  |
| `MongoDBSettings__DatabaseName`     | database name (default `SkillupDB`)              |
| `Jwt__Key`                          | JWT signing key, at least 32 characters          |
| `Jwt__Issuer`, `Jwt__Audience`      | token issuer/audience (defaults in appsettings)  |

Rotate the MongoDB password and the JWT key if they were ever exposed.

## Roles and the admin area

Every account has a role, either `User` or `Admin`.

- A **User** can browse the courses, start one, follow its levels, take the quiz of a
  level and collect certificates.
- An **Admin** can additionally open **/admin** and manage courses, learning content
  and quizzes.

### Creating the administrator

The API creates (or promotes) the administrator on startup from two settings:

| Variable          | Description                                       |
| ----------------- | ------------------------------------------------- |
| `Admin__Email`    | email of the administrator account                |
| `Admin__Password` | password, only used when the account is created   |

If the email is already registered, that account is promoted to `Admin` and its
password is left untouched. When running with `docker compose` both values are set in
`docker-compose.yml`; on Cloud Run they come from the `ADMIN_EMAIL` and
`ADMIN_PASSWORD` GitHub secrets.

### Adding content

1. Log in as the administrator and open **/admin**.
2. **Courses → Load starter courses** fills the database with four example courses
   (HTML, JavaScript, Python, C#) that use the illustrations already shipped in
   `skillup.client/public/examples`. It is safe to run repeatedly: existing courses
   are skipped.
3. **Content** — pick a course and edit its levels and the topics of each level
   (title, text and illustration).
4. **Quizzes** — pick a course and a level, then add questions with options and mark
   the correct answer.

Regular users never see the admin link, and the admin API rejects them with 403.
