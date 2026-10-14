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

On startup the stack creates two accounts (see
[Roles and the admin area](#roles-and-the-admin-area)):

| Role  | Email                 | Password                   |
| ----- | --------------------- | -------------------------- |
| Admin | `admin@skillup.local` | `local-admin-password-123` |
| User  | `demo@skillup.local`  | `demo-password-123`        |

The login page fills in the demo account automatically.

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
| Secret | `DEMO_EMAIL`              | email of the shared demo account (optional)       |
| Secret | `DEMO_PASSWORD`           | password for the shared demo account (optional)   |

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
| `Admin__Email`, `Admin__Password`   | administrator account, created on startup        |
| `Demo__Email`, `Demo__Password`     | shared demo account, created on startup          |

Rotate the MongoDB password and the JWT key if they were ever exposed.

## Keeping the Atlas free cluster awake

Atlas automatically **pauses free (M0) clusters after 30 days without a single
connection**, and refuses connections while the cluster is paused. Three ways to deal
with it:

### Scheduled ping (works out of the box)

`GET /api/health` runs a real command against MongoDB, so a request to it counts as
activity. The repository ships a scheduled workflow
([`.github/workflows/keepalive.yml`](.github/workflows/keepalive.yml)) that pings it
every Monday, and it can also be started by hand from the Actions tab. If the answer
is not `200` the run fails — a handy warning that the cluster is already paused.

### Cloud Scheduler (more robust)

GitHub disables scheduled workflows after 60 days without repository activity, while
Atlas only pauses after 30 days without connections, so the workflow above is safe
but not bullet-proof. A Cloud Scheduler job is independent of the repository:

```bash
# Cloud Scheduler needs an App Engine app in the project. If the command below
# complains about a missing App Engine application, create one first:
#   gcloud app create --project=glafira-se --region=europe-west1

gcloud scheduler jobs create http skillup-keepalive \
  --project=glafira-se \
  --location=europe-west1 \
  --schedule="0 6 * * *" \
  --uri="https://skillup-364590748641.europe-west1.run.app/api/health" \
  --http-method=GET
```

Three Cloud Scheduler jobs per month are free.

### Or leave the free tier

Paid tiers (M2 and up, roughly $9/month) are never paused automatically.

### If the cluster is already paused

Open Atlas → **Database** → **Resume**. The data is kept, resuming takes a minute or
two, and while the cluster is paused every database call fails: the API answers 500
and `/api/health` answers 503.

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

### Shared demo account

So that anybody can look around without registering, the API can also create a demo
account with the `User` role:

| Variable          | Description                                     |
| ----------------- | ----------------------------------------------- |
| `Demo__Email`     | email of the demo account                       |
| `Demo__Password`  | password, only used when the account is created |

The login page asks `GET /api/auth/demo` for those credentials and **fills the form
in automatically**, so a visitor only has to press *Login*. When no demo account is
configured the endpoint returns 404 and the form stays empty.

> The demo credentials are public by design. Never store anything private, and delete
> content you do not want strangers to change — a signed-in demo user can start
> courses and take quizzes like anybody else.

Local defaults: `demo@skillup.local` / `demo-password-123` (see `docker-compose.yml`).

### Adding content

1. Log in as the administrator and open **/admin**.
2. **Courses → Load starter courses** fills the database with four example courses
   (HTML, JavaScript, Python, C#) that use the illustrations already shipped in
   `skillup.client/public/examples`. It is safe to run repeatedly: existing courses
   are skipped. **Reset starter content** does the same but overwrites the existing
   starter courses, their levels, topics and quizzes — useful when the sample data
   has been updated, and destructive for any edits you made to those items.
3. **Content** — pick a course and edit its levels and the topics of each level
   (title, text and illustration).
4. **Quizzes** — pick a course and a level, then add questions with options and mark
   the correct answer.

Regular users never see the admin link, and the admin API rejects them with 403.
