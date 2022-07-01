FROM node
WORKDIR /app
COPY package.json .
COPY tsconfig.json .
COPY yarn.lock .
COPY src ./src
RUN yarn
RUN yarn build
RUN rm -r src
CMD ["yarn", "start"]
