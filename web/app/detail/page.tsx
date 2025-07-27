"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { api, DetailRequest, ApiResponse, getPlatformName } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function DetailPage() {
  const searchParams = useSearchParams();
  const platformParam = searchParams.get("platform") || "";
  const router = useRouter();
  // 表单状态
  const [formData, setFormData] = useState<DetailRequest>({
    platform: platformParam,
    note_ids: "",
    login_type: "qrcode",
    save_data_option: "json",
    get_comment: true,
    get_sub_comment: false,
    cookies: "",
  });

  // UI 状态
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [isAsync, setIsAsync] = useState(false);

  // 处理表单输入
  const handleInputChange = (
    field: keyof DetailRequest,
    value: string | boolean
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 执行获取详情
  const handleGetDetail = async (async: boolean = false) => {
    if (!formData.note_ids.trim()) {
      toast.error("请输入帖子/视频ID");
      return;
    }

    setLoading(true);
    setIsAsync(async);
    setResult(null);

    try {
      const response = async 
        ? await api.getDetailAsync(formData)
        : await api.getDetail(formData);
      
      setResult(response);
    } catch (error) {
      setResult({
        status: "error",
        message: error instanceof Error ? error.message : "未知错误",
        error: error instanceof Error ? error.message : "未知错误",
      });
    } finally {
      setLoading(false);
    }
  };

  // 返回主页
  const goBack = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              详情功能
            </h1>
            <p className="text-muted-foreground">
              获取 {getPlatformName(formData.platform)} 平台指定内容的详细信息
            </p>
          </div>
          <Button
            onClick={goBack}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            返回主页
          </Button>
        </div>

        {/* 配置表单 */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">详情配置</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ID 输入 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                帖子/视频 ID *
              </label>
              <Textarea
                value={formData.note_ids}
                onChange={(e) => handleInputChange("note_ids", e.target.value)}
                placeholder="请输入帖子或视频的ID，多个ID用英文逗号分隔"
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                示例：note_id_1,note_id_2,video_id_3
              </p>
            </div>

            {/* 登录方式 */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                登录方式
              </label>
              <Select onValueChange={(value) => handleInputChange("login_type", value)} value={formData.login_type}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择登录方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="qrcode">二维码登录</SelectItem>
                  <SelectItem value="phone">手机号登录</SelectItem>
                  <SelectItem value="cookie">Cookie登录</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 数据保存方式 */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                数据保存方式
              </label>
              <Select onValueChange={(value) => handleInputChange("save_data_option", value)} value={formData.save_data_option}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择数据保存方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON文件</SelectItem>
                  <SelectItem value="csv">CSV文件</SelectItem>
                  <SelectItem value="sqlite">SQLite数据库</SelectItem>
                  <SelectItem value="db">MySQL数据库</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 评论选项 */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                评论设置
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <Checkbox
                    checked={formData.get_comment}
                    onCheckedChange={(checked) => handleInputChange("get_comment", checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-foreground">爬取一级评论</span>
                </label>
                <label className="flex items-center">
                  <Checkbox
                    checked={formData.get_sub_comment}
                    onCheckedChange={(checked) => handleInputChange("get_sub_comment", checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-foreground">爬取二级评论</span>
                </label>
              </div>
            </div>

            {/* Cookie */}
            {formData.login_type === "cookie" && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Cookie 值
                </label>
                <Textarea
                  value={formData.cookies}
                  onChange={(e) => handleInputChange("cookies", e.target.value)}
                  placeholder="请输入 Cookie 值"
                  rows={3}
                />
              </div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-4 mt-6">
            <Button
              onClick={() => handleGetDetail(false)}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1"
            >
              {loading && !isAsync ? "获取中..." : "同步获取"}
            </Button>
            <Button
              onClick={() => handleGetDetail(true)}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white flex-1"
            >
              {loading && isAsync ? "启动中..." : "异步获取"}
            </Button>
          </div>
        </div>

        {/* 结果展示 */}
        {result && (
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">执行结果</h2>

            {/* 状态标识 */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${
              result.status === "success" 
                ? "bg-primary/10 text-primary border border-primary/20" 
                : result.status === "started"
                ? "bg-accent/10 text-accent-foreground border border-accent/20"
                : "bg-destructive/10 text-destructive border border-destructive/20"
            }`}>
              {result.status === "success" && "✅ 执行成功"}
              {result.status === "started" && "🚀 已启动"}
              {result.status === "error" && "❌ 执行失败"}
            </div>

            {/* 消息 */}
            <div className="mb-4">
              <h3 className="font-medium text-foreground mb-2">执行消息</h3>
              <p className="text-muted-foreground bg-muted p-3 rounded-lg">
                {result.message}
              </p>
            </div>

            {/* 进程 ID */}
            {result.pid && (
              <div className="mb-4">
                <h3 className="font-medium text-foreground mb-2">进程 ID</h3>
                <p className="text-muted-foreground bg-muted p-3 rounded-lg font-mono">
                  {result.pid}
                </p>
              </div>
            )}

            {/* 执行命令 */}
            {result.command && (
              <div className="mb-4">
                <h3 className="font-medium text-foreground mb-2">执行命令</h3>
                <pre className="text-sm text-muted-foreground bg-muted p-3 rounded-lg overflow-x-auto">
                  {result.command}
                </pre>
              </div>
            )}

            {/* 输出信息 */}
            {result.output && (
              <div className="mb-4">
                <h3 className="font-medium text-foreground mb-2">输出信息</h3>
                <pre className="text-sm text-muted-foreground bg-muted p-3 rounded-lg max-h-96 overflow-y-auto">
                  {result.output}
                </pre>
              </div>
            )}

            {/* 错误信息 */}
            {result.error && (
              <div>
                <h3 className="font-medium text-destructive mb-2">错误信息</h3>
                <pre className="text-sm text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-lg max-h-96 overflow-y-auto">
                  {result.error}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 