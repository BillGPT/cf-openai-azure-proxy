FROM node:18.12-slim

WORKDIR /app

# 安装 Cloudflare Workers CLI 工具
RUN npm install -g wrangler@2.15.0

ENV WRANGLER_SEND_METRICS=false

ENV DEPLOY_NAME_GPT35=""
ENV DEPLOY_NAME_GPT4=""

# 复制源代码到镜像
COPY . .

# 启动本地开发服务器
CMD wrangler dev main.js --local --var RESOURCE_NAME:$RESOURCE_NAME DEPLOY_NAME_GPT35:$DEPLOY_NAME_GPT35 DEPLOY_NAME_GPT4:$DEPLOY_NAME_GPT4
