FROM node:18
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
ENV DB_USER root
ENV DB_PASSWORD password
ENV DB_HOST 0.0.0.0
ENV DB_PORT 3006
ENV DATABASE price_lookup
COPY ./price-lookup-api/ ./
CMD [ "ls" ]

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

EXPOSE 3000
CMD [ "npm", "run","dev" ]
