"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { api, CreatorRequest, ApiResponse, getPlatformName } from "@/lib/api";
import { useRouter } from "next/navigation";
import ResultDisplay from "@/components/result-display";
import CommonFormFields from "@/components/common-form-fields";

export default function CreatorPage() {
  const searchParams = useSearchParams();
  const platformParam = searchParams.get("platform") || "";
  const router = useRouter();
  // 表单状态
  const [formData, setFormData] = useState<CreatorRequest>({
    platform: platformParam,
    creator_ids: "",
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
    field: keyof CreatorRequest,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 执行获取创作者信息
  const handleGetCreator = async (async: boolean = false) => {
    if (!formData.creator_ids.trim()) {
      toast.error("请输入创作者ID");
      return;
    }

    setLoading(true);
    setIsAsync(async);
    setResult(null);

    try {
      const response = async
        ? await api.getCreatorAsync(formData)
        : await api.getCreator(formData);

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
              创作者功能
            </h1>
            <p className="text-muted-foreground">
              获取 {getPlatformName(formData.platform)} 平台指定创作者的内容信息
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
            创作者配置
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 创作者 ID 输入 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                创作者 ID *
              </label>
              <Textarea
                value={formData.creator_ids}
                onChange={(e) =>
                  handleInputChange("creator_ids", e.target.value)
                }
                placeholder="请输入创作者的用户ID，多个ID用英文逗号分隔"
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                示例：user_id_1,user_id_2,creator_id_3
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
              onClick={() => handleGetCreator(false)}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1"
            >
              {loading && !isAsync ? "获取中..." : "同步获取"}
            </Button>
            <Button
              onClick={() => handleGetCreator(true)}
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
