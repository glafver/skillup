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

Rename the provided example.env in skillup.client folder to .env

### 4. Setup Frontend

Make sure backend is running first

```bash
cd skillup.client
npm install
npm run dev
```

Runs frontend at http://localhost:5173
