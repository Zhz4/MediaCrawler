import { ApiResponse } from "@/lib/api";

interface ResultDisplayProps {
  result: ApiResponse;
}

export default function ResultDisplay({ result }: ResultDisplayProps) {
  return (
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
  );
} 