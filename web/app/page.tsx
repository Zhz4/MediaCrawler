"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// 平台配置
const PLATFORMS = [
  { id: "xhs", name: "小红书", color: "bg-red-500", icon: "📱" },
  { id: "dy", name: "抖音", color: "bg-slate-900", icon: "🎵" },
  { id: "ks", name: "快手", color: "bg-orange-500", icon: "⚡" },
  { id: "bili", name: "哔哩哔哩", color: "bg-pink-500", icon: "📺" },
  { id: "wb", name: "微博", color: "bg-orange-600", icon: "🐦" },
  { id: "tieba", name: "百度贴吧", color: "bg-blue-600", icon: "💬" },
  { id: "zhihu", name: "知乎", color: "bg-blue-500", icon: "🧠" },
];

// 功能配置
const FEATURES = [
  {
    id: "search",
    name: "搜索功能",
    description: "根据关键词搜索平台内容",
    icon: "🔍",
    color: "bg-green-500",
  },
  {
    id: "detail",
    name: "详情功能", 
    description: "获取指定帖子/视频详细信息",
    icon: "📄",
    color: "bg-primary",
  },
  {
    id: "creator",
    name: "创作者功能",
    description: "获取指定创作者的内容信息", 
    icon: "👤",
    color: "bg-purple-500",
  },
];

export default function Home() {
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedFeature, setSelectedFeature] = useState("");
  const router = useRouter();
  const handleStart = () => {
    if (selectedPlatform && selectedFeature) {
        router.push(`/${selectedFeature}?platform=${selectedPlatform}`);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            MediaCrawler 媒体爬虫平台
          </h1>
          <p className="text-muted-foreground text-lg">
            支持多平台内容爬取，一站式解决方案
          </p>
        </div>

        {/* 平台选择 */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
            选择目标平台
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {PLATFORMS.map((platform) => (
              <div
                key={platform.id}
                className={`cursor-pointer rounded-xl p-4 text-center transition-all duration-200 border-2 ${
                  selectedPlatform === platform.id
                    ? "border-primary bg-accent shadow-lg scale-105"
                    : "border-border bg-card hover:border-border/80 hover:shadow-md"
                }`}
                onClick={() => setSelectedPlatform(platform.id)}
              >
                <div
                  className={`w-12 h-12 ${platform.color} rounded-lg flex items-center justify-center text-white text-xl mx-auto mb-2`}
                >
                  {platform.icon}
                </div>
                <h3 className="font-medium text-foreground text-sm">
                  {platform.name}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* 功能选择 */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
            选择功能模式
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.id}
                className={`cursor-pointer rounded-xl p-6 border-2 transition-all duration-200 ${
                  selectedFeature === feature.id
                    ? "border-primary bg-accent shadow-lg scale-105"
                    : "border-border bg-card hover:border-border/80 hover:shadow-md"
                }`}
                onClick={() => setSelectedFeature(feature.id)}
              >
                <div className="flex items-center mb-4">
                  <div
                    className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center text-white text-xl mr-4`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.name}
                  </h3>
                </div>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 开始按钮 */}
        <div className="text-center">
          <div className="flex gap-4 justify-center">
            <Button
              onClick={handleStart}
              disabled={!selectedPlatform || !selectedFeature}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg rounded-xl disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-all duration-200"
            >
              {selectedPlatform && selectedFeature
                ? "开始爬取"
                : "请选择平台和功能"}
            </Button>
            <Button
              onClick={() => router.push("/status")}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-3 text-lg rounded-xl transition-all duration-200"
            >
              📊 系统状态
            </Button>
          </div>
        </div>

        {/* 快速状态显示 */}
        {(selectedPlatform || selectedFeature) && (
          <div className="mt-8 p-4 bg-card rounded-xl border border-border text-center">
            <p className="text-muted-foreground">
              已选择：
              {selectedPlatform && (
                <span className="text-primary font-medium mx-2">
                  {PLATFORMS.find(p => p.id === selectedPlatform)?.name}
                </span>
              )}
              {selectedPlatform && selectedFeature && " + "}
              {selectedFeature && (
                <span className="text-accent-foreground font-medium mx-2">
                  {FEATURES.find(f => f.id === selectedFeature)?.name}
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
