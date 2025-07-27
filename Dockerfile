# 第一阶段：构建前端
FROM node:18-alpine AS frontend-builder

# 设置工作目录
WORKDIR /app/web

# 复制前端项目文件
COPY ./web/package.json ./web/pnpm-lock.yaml ./

# 安装pnpm并安装前端依赖
RUN npm install -g pnpm && pnpm install

# 复制前端源码
COPY ./web .

# 构建前端项目
RUN pnpm build

# 第二阶段：构建Python环境并整合前端
FROM python:3.12-slim-bookworm

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# 安装所有必要的系统依赖（包括Node.js）
RUN apt-get update && apt-get install -y \
  gcc \
  build-essential \
  libfreetype6-dev \
  libjpeg-dev \
  zlib1g-dev \
  pkg-config \
  curl \
  nodejs \
  npm \
  && npm install -g pnpm \
  && rm -rf /var/lib/apt/lists/*

# 设置工作目录
WORKDIR /app

# 复制 Python 项目配置文件
COPY ./pyproject.toml ./requirements.txt ./

# 使用 uv 安装 Python 依赖
RUN uv sync

# 安装 Playwright 浏览器
RUN uv run playwright install chromium && \
    uv run playwright install-deps

# 复制 Python 项目源码
COPY . .

# 从第一阶段复制构建好的前端文件
COPY --from=frontend-builder /app/web/.next ./web/.next
COPY --from=frontend-builder /app/web/package.json ./web/package.json
COPY --from=frontend-builder /app/web/node_modules ./web/node_modules

# 复制启动脚本并设置权限
COPY ./start.sh /app/start.sh
RUN chmod +x /app/start.sh

# 暴露端口
EXPOSE 8000 3000

# 容器启动时运行服务
CMD ["/app/start.sh"]