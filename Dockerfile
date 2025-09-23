
# ===== Build stage =====
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Копируем только нужные csproj
COPY skillup.server/skillup.server.csproj ./skillup.server/
# COPY skillup.shared/skillup.shared.csproj ./skillup.shared/
# Если есть другие проекты, добавь их аналогично

# Восстанавливаем зависимости
RUN dotnet restore ./skillup.server/skillup.server.csproj

# Копируем остальной код
COPY . .

# Публикуем только сервер
RUN dotnet publish ./skillup.server/skillup.server.csproj -c Release -o /app

# ===== Runtime stage =====
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "skillup.server.dll"]

