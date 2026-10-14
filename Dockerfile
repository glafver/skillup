# syntax=docker/dockerfile:1

########################################
# Stage 1 - build the client (Vite)
########################################
FROM node:22-alpine AS client-build
WORKDIR /app/client
COPY skillup.client/package.json skillup.client/package-lock.json ./
RUN npm ci
COPY skillup.client/ ./
# The client and the API share one origin, so this must be the final public URL
# (or http://localhost:<port> when running the image locally).
ARG VITE_API_URL=http://localhost:8090
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

########################################
# Stage 2 - build the server (.NET)
########################################
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS server-build
WORKDIR /app/server
COPY skillup.server/skillup.server.csproj ./
RUN dotnet restore skillup.server.csproj
COPY skillup.server/ ./
RUN dotnet publish skillup.server.csproj -c Release -o /app/publish --no-restore

########################################
# Stage 3 - runtime (nginx + ASP.NET)
########################################
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

RUN apt-get update \
    && apt-get install -y --no-install-recommends nginx gettext-base \
    && rm -rf /var/lib/apt/lists/*

ENV ASPNETCORE_ENVIRONMENT=Production \
    PORT=8080 \
    SERVER_PORT=5000

WORKDIR /app

# backend
COPY --from=server-build /app/publish ./server/

# frontend (static files served by nginx)
COPY --from=client-build /app/client/dist /usr/share/nginx/html

# nginx config template + entrypoint
COPY docker/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY docker/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 8080
CMD ["/app/entrypoint.sh"]
