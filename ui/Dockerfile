FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run test
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app .
EXPOSE 3030
ENV PORT=3030
CMD ["npm", "run", "start"]
