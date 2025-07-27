import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface CommonFormFieldsProps {
  formData: {
    login_type?: string;
    save_data_option?: string;
    get_comment?: boolean;
    get_sub_comment?: boolean;
    cookies?: string;
  };
  onInputChange: (field: any, value: string | boolean) => void;
}

export default function CommonFormFields({ formData, onInputChange }: CommonFormFieldsProps) {
  return (
    <>
      {/* 登录方式 */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          登录方式
        </label>
        <Select onValueChange={(value) => onInputChange("login_type", value)} value={formData.login_type || "qrcode"}>
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
        <Select onValueChange={(value) => onInputChange("save_data_option", value)} value={formData.save_data_option || "json"}>
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
              checked={formData.get_comment || false}
              onCheckedChange={(checked) => onInputChange("get_comment", checked)}
              className="mr-2"
            />
            <span className="text-sm text-foreground">爬取一级评论</span>
          </label>
          <label className="flex items-center">
            <Checkbox
              checked={formData.get_sub_comment || false}
              onCheckedChange={(checked) => onInputChange("get_sub_comment", checked)}
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
            value={formData.cookies || ""}
            onChange={(e) => onInputChange("cookies", e.target.value)}
            placeholder="请输入 Cookie 值"
            rows={3}
          />
        </div>
      )}
    </>
  );
} 