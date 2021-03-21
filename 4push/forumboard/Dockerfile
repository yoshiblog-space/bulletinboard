# node.js の環境変数を定義する
FROM node:12
ENV TZ=Asia/Tokyo
ENV DEBUG=app:*
WORKDIR /app
COPY ./ ./
RUN npm install
EXPOSE 3000
