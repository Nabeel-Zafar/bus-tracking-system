FROM node:latest
COPY package.json package-lock.json ./
RUN npm install
COPY . /
CMD ["node", "app"]
