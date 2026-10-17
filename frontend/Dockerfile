FROM node:24.16.0-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Maintained NGINX Inc. variant of the official image that runs as non-root (UID 101).
FROM nginxinc/nginx-unprivileged:1.30.1-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/notes-ui/browser /usr/share/nginx/html
USER 101
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s --retries=6 \
  CMD wget -q -Y off -T 3 -O /dev/null http://127.0.0.1:8080/ || exit 1
