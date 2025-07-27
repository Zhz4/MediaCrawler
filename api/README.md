# MediaCrawler API 使用说明

## 概述

MediaCrawler API 按功能模块提供接口，支持搜索、详情、创作者三大核心功能。

## 启动服务

```bash
cd api
python main.py
```

服务启动后：
- API 地址：http://localhost:8000
- 文档地址：http://localhost:8000/docs

## API 接口

### 1. 搜索功能

#### POST /search
根据关键词搜索内容（同步执行）

**请求示例：**
```json
{
  "platform": "xhs",
  "keywords": "编程副业,Python",
  "login_type": "qrcode",
  "start_page": 1,
  "get_comment": true,
  "get_sub_comment": false,
  "save_data_option": "json"
}
```

#### POST /search/async
根据关键词搜索内容（异步执行）

#### GET /search/{platform}
便捷搜索接口
```
GET /search/xhs?keywords=编程副业&get_comment=true
```

### 2. 详情功能

#### POST /detail
获取指定帖子/视频详细信息

**请求示例：**
```json
{
  "platform": "xhs",
  "note_ids": "note_id_1,note_id_2",
  "login_type": "qrcode",
  "get_comment": true,
  "save_data_option": "json"
}
```

#### POST /detail/async
异步获取详情信息

### 3. 创作者功能

#### POST /creator
获取指定创作者的内容信息

**请求示例：**
```json
{
  "platform": "xhs",
  "creator_ids": "user_id_1,user_id_2",
  "login_type": "qrcode",
  "get_comment": true,
  "save_data_option": "json"
}
```

#### POST /creator/async
异步获取创作者信息

### 4. 辅助接口

#### GET /
服务状态检查

#### GET /platforms
获取支持的平台列表

## 参数说明

### 平台类型 (platform)
- `xhs`: 小红书
- `dy`: 抖音
- `ks`: 快手
- `bili`: 哔哩哔哩
- `wb`: 微博
- `tieba`: 百度贴吧
- `zhihu`: 知乎

### 登录方式 (login_type)
- `qrcode`: 二维码登录
- `phone`: 手机号登录
- `cookie`: Cookie登录

### 数据保存方式 (save_data_option)
- `json`: JSON文件
- `csv`: CSV文件
- `db`: MySQL数据库
- `sqlite`: SQLite数据库

## 响应格式

### 成功响应
```json
{
  "status": "success",
  "message": "爬虫任务执行成功",
  "output": "执行输出信息",
  "command": "实际执行的命令"
}
```

### 错误响应
```json
{
  "status": "error",
  "message": "爬虫任务执行失败",
  "error": "错误信息",
  "output": "输出信息",
  "command": "实际执行的命令"
}
```

### 异步响应
```json
{
  "status": "started",
  "message": "爬虫任务已在后台启动",
  "pid": 12345,
  "command": "实际执行的命令"
}
```

## 使用示例

### 搜索小红书内容
```bash
curl -X POST "http://localhost:8000/search" \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "xhs",
    "keywords": "编程副业",
    "get_comment": true
  }'
```

### 获取抖音视频详情
```bash
curl -X POST "http://localhost:8000/detail" \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "dy",
    "note_ids": "video_id_123",
    "get_comment": true
  }'
```

### 便捷搜索接口
```bash
curl "http://localhost:8000/search/xhs?keywords=Python学习&get_comment=true"
``` 