FROM node:lts

WORKDIR /app

COPY . .
RUN npm install

WORKDIR /app/types
RUN npm install
RUN npm run build

WORKDIR /app/backend
RUN npm install
RUN npx prisma generate
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
