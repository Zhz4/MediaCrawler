"use client";

import { Button } from "@/components/ui/button";
import StatusMonitor from "@/components/status-monitor";
import { useRouter } from "next/navigation";    
export default function StatusPage() {
  const router = useRouter();
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
              📊 系统状态监控
            </h1>
            <p className="text-muted-foreground">
              实时监控 MediaCrawler API 服务状态和平台支持情况
            </p>
          </div>
          <Button
            onClick={goBack}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            返回主页
          </Button>
        </div>

        {/* 状态监控 */}
        <StatusMonitor className="mb-6" />

        {/* 使用说明 */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">使用说明</h2>
          
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h3 className="font-medium text-foreground mb-2">🚀 启动 API 服务</h3>
              <p className="mb-2">在使用 Web UI 之前，请确保 API 服务已启动：</p>
              <div className="bg-muted p-3 rounded-lg font-mono text-xs">
                cd api<br/>
                python main.py
              </div>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-2">🔧 配置说明</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>API 服务默认运行在 http://localhost:8000</li>
                <li>支持 7 个主流平台：小红书、抖音、快手、哔哩哔哩、微博、百度贴吧、知乎</li>
                <li>提供搜索、详情、创作者三大功能模块</li>
                <li>支持同步和异步执行模式</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-2">💡 使用提示</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>同步模式：等待任务完成后返回结果，适合小规模数据获取</li>
                <li>异步模式：立即返回任务ID，在后台执行，适合大规模数据获取</li>
                <li>Cookie 登录：可以避免频繁的登录验证，提高爬取效率</li>
                <li>数据保存：支持多种格式，建议大量数据使用数据库存储</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-2">⚠️ 注意事项</h3>
              <ul className="list-disc list-inside space-y-1 text-orange-600">
                <li>请遵守各平台的使用条款和爬取规范</li>
                <li>建议设置合理的爬取频率，避免对平台造成压力</li>
                <li>异步任务可能需要较长时间完成，请耐心等待</li>
                <li>首次使用需要进行平台登录认证</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 