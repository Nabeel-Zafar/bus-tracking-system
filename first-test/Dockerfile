FROM node:latest
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . /
CMD ["npm", "start"]
