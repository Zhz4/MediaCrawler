#!/bin/bash

# MediaCrawler 启动脚本
# 用于在Docker容器中启动API服务和前端服务

set -e

echo "=== MediaCrawler 启动脚本 ==="
echo "当前时间: $(date)"
echo "Python版本: $(python --version)"
echo "Node版本: $(node --version)"

# 检查必要的目录和文件
echo "检查项目结构..."
if [ ! -f "api/main.py" ]; then
    echo "错误: 找不到 api/main.py"
    exit 1
fi

if [ ! -d "web/.next" ]; then
    echo "错误: 找不到前端构建文件 web/.next"
    exit 1
fi

# 创建必要的目录
mkdir -p data
mkdir -p browser_data
mkdir -p cache

# 启动API服务
echo "启动API服务..."
uv run python api/main.py &
API_PID=$!

# 等待API服务启动
echo "等待API服务启动..."
sleep 5

# 检查API服务是否正常启动
if ! curl -f http://localhost:8000/ > /dev/null 2>&1; then
    echo "错误: API服务启动失败"
    exit 1
fi

echo "API服务启动成功，PID: $API_PID"

# 启动前端服务（如果需要）
if [ -d "web/.next" ] && [ -f "web/package.json" ]; then
    echo "启动前端服务..."
    cd web
    
    # 检查是否安装了依赖
    if [ ! -d "node_modules" ]; then
        echo "安装前端依赖..."
        npm ci --only=production
    fi
    
    # 启动前端服务
    npm start &
    FRONTEND_PID=$!
    echo "前端服务启动成功，PID: $FRONTEND_PID"
fi

echo "=== 服务启动完成 ==="
echo "API服务地址: http://localhost:8000"
echo "API文档地址: http://localhost:8000/docs"
if [ ! -z "$FRONTEND_PID" ]; then
    echo "前端服务地址: http://localhost:3000"
fi

# 等待进程
wait 