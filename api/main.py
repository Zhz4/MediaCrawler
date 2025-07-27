import asyncio
import os
import sys
import subprocess
from typing import Optional, List
from enum import Enum

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# 添加项目根目录到Python路径
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

app = FastAPI(
    title="MediaCrawler API",
    description="媒体爬虫API服务",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PlatformEnum(str, Enum):
    xhs = "xhs"  # 小红书
    dy = "dy"  # 抖音
    ks = "ks"  # 快手
    bili = "bili"  # 哔哩哔哩
    wb = "wb"  # 微博
    tieba = "tieba"  # 百度贴吧
    zhihu = "zhihu"  # 知乎


class LoginTypeEnum(str, Enum):
    qrcode = "qrcode"  # 二维码
    phone = "phone"  # 手机号
    cookie = "cookie"  # Cookie


class SaveDataOptionEnum(str, Enum):
    csv = "csv"  # CSV文件
    db = "db"  # MySQL数据库
    json = "json"  # JSON文件
    sqlite = "sqlite"  # SQLite数据库


# 基础请求模型
class BaseRequest(BaseModel):
    platform: PlatformEnum = Field(..., description="媒体平台")
    login_type: LoginTypeEnum = Field(
        default=LoginTypeEnum.qrcode, description="登录方式"
    )
    save_data_option: SaveDataOptionEnum = Field(
        default=SaveDataOptionEnum.json, description="数据保存方式"
    )
    cookies: Optional[str] = Field(default="", description="Cookie值")


# 搜索功能请求模型
class SearchRequest(BaseRequest):
    keywords: str = Field(..., description="搜索关键词，多个关键词用英文逗号分隔")
    start_page: int = Field(default=1, ge=1, description="起始页码")
    get_comment: bool = Field(default=True, description="是否爬取一级评论")
    get_sub_comment: bool = Field(default=False, description="是否爬取二级评论")


# 详情功能请求模型
class DetailRequest(BaseRequest):
    note_ids: str = Field(..., description="帖子/视频ID列表，多个ID用英文逗号分隔")
    get_comment: bool = Field(default=True, description="是否爬取一级评论")
    get_sub_comment: bool = Field(default=False, description="是否爬取二级评论")


# 创作者功能请求模型
class CreatorRequest(BaseRequest):
    creator_ids: str = Field(..., description="创作者ID列表，多个ID用英文逗号分隔")
    get_comment: bool = Field(default=True, description="是否爬取评论")
    get_sub_comment: bool = Field(default=False, description="是否爬取二级评论")


async def execute_crawler_command(cmd_args: List[str]) -> dict:
    """执行爬虫命令的通用函数"""
    try:
        cmd = [sys.executable, os.path.join(parent_dir, "main.py")] + cmd_args

        process = subprocess.Popen(
            cmd,
            cwd=parent_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
            universal_newlines=True,
        )

        output_lines = []

        # 实时读取输出
        while True:
            output = process.stdout.readline()
            if output == "" and process.poll() is not None:
                break
            if output:
                line = output.rstrip()
                print(f"[爬虫] {line}")
                output_lines.append(line)

        return_code = process.poll()

        print("=" * 80)

        if return_code == 0:
            print(f"[API] 爬虫任务执行成功")
            return {
                "status": "success",
                "message": "爬虫任务执行成功",
                "output": "\n".join(output_lines),
                "command": " ".join(cmd),
            }
        else:
            print(f"[API] 爬虫任务执行失败，返回码: {return_code}")
            return {
                "status": "error",
                "message": f"爬虫任务执行失败，返回码: {return_code}",
                "error": "\n".join(output_lines),
                "output": "\n".join(output_lines),
                "command": " ".join(cmd),
            }

    except Exception as e:
        error_msg = f"执行错误: {str(e)}"
        print(f"[API] {error_msg}")
        raise HTTPException(status_code=500, detail=error_msg)


async def execute_crawler_async(cmd_args: List[str]) -> dict:
    """异步执行爬虫命令的通用函数"""
    try:
        cmd = [sys.executable, os.path.join(parent_dir, "main.py")] + cmd_args

        process = await asyncio.create_subprocess_exec(
            *cmd,
            cwd=parent_dir,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.STDOUT,
        )

        # 创建一个任务来实时读取输出
        async def read_output():
            output_lines = []
            while True:
                line = await process.stdout.readline()
                if not line:
                    break
                line_str = line.decode().rstrip()
                print(f"[爬虫-异步] {line_str}")
                output_lines.append(line_str)
            return output_lines

        # 启动输出读取任务（不等待完成）
        asyncio.create_task(read_output())

        print(f"[API] 异步任务已启动，PID: {process.pid}")

        return {
            "status": "started",
            "message": "爬虫任务已在后台启动",
            "pid": process.pid,
            "command": " ".join(cmd),
        }

    except Exception as e:
        error_msg = f"启动错误: {str(e)}"
        print(f"[API] {error_msg}")
        raise HTTPException(status_code=500, detail=error_msg)


@app.get("/")
async def root():
    return {"message": "MediaCrawler API 服务正在运行", "version": "1.0.0"}


@app.get("/platforms")
async def get_platforms():
    """获取支持的平台列表"""
    return {
        "platforms": [
            {"platform": "xhs", "name": "小红书"},
            {"platform": "dy", "name": "抖音"},
            {"platform": "ks", "name": "快手"},
            {"platform": "bili", "name": "哔哩哔哩"},
            {"platform": "wb", "name": "微博"},
            {"platform": "tieba", "name": "百度贴吧"},
            {"platform": "zhihu", "name": "知乎"},
        ]
    }


# ==================== 搜索功能接口 ====================


@app.post("/search")
async def search_content(request: SearchRequest):
    """
    搜索功能：根据关键词搜索内容

    支持的平台：所有平台 (xhs, dy, ks, bili, wb, tieba, zhihu)
    """
    cmd_args = [
        "--platform",
        request.platform,
        "--lt",
        request.login_type,
        "--type",
        "search",
        "--keywords",
        request.keywords,
        "--start",
        str(request.start_page),
        "--get_comment",
        str(request.get_comment).lower(),
        "--get_sub_comment",
        str(request.get_sub_comment).lower(),
        "--save_data_option",
        request.save_data_option,
    ]

    if request.cookies:
        cmd_args.extend(["--cookies", request.cookies])

    return await execute_crawler_command(cmd_args)


@app.post("/search/async")
async def search_content_async(request: SearchRequest):
    """
    异步搜索功能：根据关键词搜索内容（后台执行）
    """
    cmd_args = [
        "--platform",
        request.platform,
        "--lt",
        request.login_type,
        "--type",
        "search",
        "--keywords",
        request.keywords,
        "--start",
        str(request.start_page),
        "--get_comment",
        str(request.get_comment).lower(),
        "--get_sub_comment",
        str(request.get_sub_comment).lower(),
        "--save_data_option",
        request.save_data_option,
    ]

    if request.cookies:
        cmd_args.extend(["--cookies", request.cookies])

    return await execute_crawler_async(cmd_args)


# ==================== 详情功能接口 ====================


@app.post("/detail")
async def get_content_detail(request: DetailRequest):
    """
    详情功能：获取指定帖子/视频的详细信息

    支持的平台：所有平台 (xhs, dy, ks, bili, wb, tieba, zhihu)
    """
    cmd_args = [
        "--platform",
        request.platform,
        "--lt",
        request.login_type,
        "--type",
        "detail",
        "--keywords",
        request.note_ids,  # 这里复用keywords参数传递ID
        "--get_comment",
        str(request.get_comment).lower(),
        "--get_sub_comment",
        str(request.get_sub_comment).lower(),
        "--save_data_option",
        request.save_data_option,
    ]

    if request.cookies:
        cmd_args.extend(["--cookies", request.cookies])

    return await execute_crawler_command(cmd_args)


@app.post("/detail/async")
async def get_content_detail_async(request: DetailRequest):
    """
    异步详情功能：获取指定帖子/视频的详细信息（后台执行）
    """
    cmd_args = [
        "--platform",
        request.platform,
        "--lt",
        request.login_type,
        "--type",
        "detail",
        "--keywords",
        request.note_ids,
        "--get_comment",
        str(request.get_comment).lower(),
        "--get_sub_comment",
        str(request.get_sub_comment).lower(),
        "--save_data_option",
        request.save_data_option,
    ]

    if request.cookies:
        cmd_args.extend(["--cookies", request.cookies])

    return await execute_crawler_async(cmd_args)


# ==================== 创作者功能接口 ====================


@app.post("/creator")
async def get_creator_content(request: CreatorRequest):
    """
    创作者功能：获取指定创作者的内容信息

    支持的平台：所有平台 (xhs, dy, ks, bili, wb, tieba, zhihu)
    """
    cmd_args = [
        "--platform",
        request.platform,
        "--lt",
        request.login_type,
        "--type",
        "creator",
        "--keywords",
        request.creator_ids,  # 这里复用keywords参数传递创作者ID
        "--get_comment",
        str(request.get_comment).lower(),
        "--get_sub_comment",
        str(request.get_sub_comment).lower(),
        "--save_data_option",
        request.save_data_option,
    ]

    if request.cookies:
        cmd_args.extend(["--cookies", request.cookies])

    return await execute_crawler_command(cmd_args)


@app.post("/creator/async")
async def get_creator_content_async(request: CreatorRequest):
    """
    异步创作者功能：获取指定创作者的内容信息（后台执行）
    """
    cmd_args = [
        "--platform",
        request.platform,
        "--lt",
        request.login_type,
        "--type",
        "creator",
        "--keywords",
        request.creator_ids,
        "--get_comment",
        str(request.get_comment).lower(),
        "--get_sub_comment",
        str(request.get_sub_comment).lower(),
        "--save_data_option",
        request.save_data_option,
    ]

    if request.cookies:
        cmd_args.extend(["--cookies", request.cookies])

    return await execute_crawler_async(cmd_args)


# ==================== 便捷接口 ====================


@app.get("/search/{platform}")
async def search_by_platform(
    platform: PlatformEnum,
    keywords: str,
    login_type: LoginTypeEnum = LoginTypeEnum.qrcode,
    start_page: int = 1,
    get_comment: bool = True,
):
    """
    便捷搜索接口：通过URL参数直接搜索
    """
    request = SearchRequest(
        platform=platform,
        keywords=keywords,
        login_type=login_type,
        start_page=start_page,
        get_comment=get_comment,
    )
    return await search_content(request)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
