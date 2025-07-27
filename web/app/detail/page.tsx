"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { api, DetailRequest, ApiResponse, getPlatformName } from "@/lib/api";
import { useRouter } from "next/navigation";
import ResultDisplay from "@/components/result-display";
import CommonFormFields from "@/components/common-form-fields";

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
    setFormData((prev) => ({ ...prev, [field]: value }));
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
          <h2 className="text-xl font-semibold text-foreground mb-4">
            详情配置
          </h2>

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

            <CommonFormFields
              formData={formData}
              onInputChange={handleInputChange}
            />
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
              className="bg-accent hover:bg-accent/90 text-accent-foreground flex-1"
            >
              {loading && isAsync ? "启动中..." : "异步获取"}
            </Button>
          </div>
        </div>

        {/* 结果展示 */}
        {result && <ResultDisplay result={result} />}
      </div>
    </div>
  );
}
