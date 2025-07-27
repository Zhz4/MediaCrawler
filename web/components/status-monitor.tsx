"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { api, ApiResponse, Platform } from "@/lib/api";

interface StatusMonitorProps {
  className?: string;
}

export default function StatusMonitor({ className = "" }: StatusMonitorProps) {
  const [apiStatus, setApiStatus] = useState<{
    status: "loading" | "online" | "offline";
    message?: string;
    version?: string;
  }>({ status: "loading" });
  
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(false);

  // 检查 API 状态
  const checkApiStatus = async () => {
    setLoading(true);
    try {
      const statusResponse = await api.getStatus();
      const platformsResponse = await api.getPlatforms();
      
      setApiStatus({
        status: "online",
        message: statusResponse.message,
        version: statusResponse.version,
      });
      
      setPlatforms(platformsResponse.platforms);
    } catch (error) {
      setApiStatus({
        status: "offline",
        message: error instanceof Error ? error.message : "API 服务连接失败",
      });
      setPlatforms([]);
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时检查状态
  useEffect(() => {
    checkApiStatus();
  }, []);

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-800">服务状态监控</h2>
        <Button
          onClick={checkApiStatus}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2"
        >
          {loading ? "检测中..." : "刷新状态"}
        </Button>
      </div>

      {/* API 状态 */}
      <div className="mb-6">
        <h3 className="font-medium text-slate-700 mb-3">API 服务状态</h3>
        <div className="flex items-center">
          <div
            className={`w-3 h-3 rounded-full mr-3 ${
              apiStatus.status === "loading"
                ? "bg-yellow-500 animate-pulse"
                : apiStatus.status === "online"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          />
          <span className="text-sm text-slate-600">
            {apiStatus.status === "loading" && "检测中..."}
            {apiStatus.status === "online" && `服务正常 (${apiStatus.version})`}
            {apiStatus.status === "offline" && "服务离线"}
          </span>
        </div>
        {apiStatus.message && (
          <p className="text-xs text-slate-500 mt-2 ml-6">{apiStatus.message}</p>
        )}
      </div>

      {/* 平台支持状态 */}
      <div>
        <h3 className="font-medium text-slate-700 mb-3">
          支持的平台 ({platforms.length})
        </h3>
        {platforms.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {platforms.map((platform) => (
              <div
                key={platform.platform}
                className="flex items-center p-2 bg-slate-50 rounded-lg"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                <span className="text-sm text-slate-700">{platform.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">
            {apiStatus.status === "offline" ? "无法获取平台信息" : "暂无平台信息"}
          </p>
        )}
      </div>

      {/* 快速连接测试 */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <h3 className="font-medium text-slate-700 mb-3">连接信息</h3>
        <div className="text-sm text-slate-600 space-y-1">
          <p>
            <span className="font-medium">API 地址：</span>
            <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
              {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}
            </span>
          </p>
          <p>
            <span className="font-medium">状态：</span>
            <span
              className={`font-medium ${
                apiStatus.status === "online"
                  ? "text-green-600"
                  : apiStatus.status === "offline"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {apiStatus.status === "online" && "✅ 连接正常"}
              {apiStatus.status === "offline" && "❌ 连接失败"}
              {apiStatus.status === "loading" && "⏳ 检测中"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
} 