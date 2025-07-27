"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api, SearchRequest, ApiResponse, getPlatformName } from "@/lib/api";
import { useRouter } from "next/navigation";
import ResultDisplay from "@/components/result-display";
import CommonFormFields from "@/components/common-form-fields";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const platformParam = searchParams.get("platform") || "";
  const router = useRouter();
  // 表单状态
  const [formData, setFormData] = useState<SearchRequest>({
    platform: platformParam,
    keywords: "",
    login_type: "qrcode",
    save_data_option: "json",
    start_page: 1,
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
    field: keyof SearchRequest,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 执行搜索
  const handleSearch = async (async: boolean = false) => {
    if (!formData.keywords.trim()) {
      toast.error("请输入搜索关键词");
      return;
    }

    setLoading(true);
    setIsAsync(async);
    setResult(null);

    try {
      const response = async
        ? await api.searchAsync(formData)
        : await api.search(formData);

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
              搜索功能
            </h1>
            <p className="text-muted-foreground">
              在 {getPlatformName(formData.platform)} 平台搜索内容
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
            搜索配置
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 关键词输入 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                搜索关键词 *
              </label>
              <Input
                type="text"
                value={formData.keywords}
                onChange={(e) => handleInputChange("keywords", e.target.value)}
                placeholder="请输入搜索关键词，多个关键词用英文逗号分隔"
              />
              <p className="text-xs text-muted-foreground mt-1">
                示例：编程副业,Python学习
              </p>
            </div>

            {/* 起始页码 */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                起始页码
              </label>
              <Input
                type="number"
                min="1"
                value={formData.start_page}
                onChange={(e) =>
                  handleInputChange("start_page", parseInt(e.target.value) || 1)
                }
              />
            </div>

            <CommonFormFields
              formData={formData}
              onInputChange={handleInputChange}
            />
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-4 mt-6">
            <Button
              onClick={() => handleSearch(false)}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1"
            >
              {loading && !isAsync ? "搜索中..." : "同步搜索"}
            </Button>
            <Button
              onClick={() => handleSearch(true)}
              disabled={loading}
              className="bg-accent hover:bg-accent/90 text-accent-foreground flex-1"
            >
              {loading && isAsync ? "启动中..." : "异步搜索"}
            </Button>
          </div>
        </div>

        {/* 结果展示 */}
        {result && <ResultDisplay result={result} />}
      </div>
    </div>
  );
}
