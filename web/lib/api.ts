// API 基础配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// 请求数据类型定义
export interface BaseRequest {
  platform: string;
  login_type?: 'qrcode' | 'phone' | 'cookie';
  save_data_option?: 'csv' | 'db' | 'json' | 'sqlite';
  cookies?: string;
}

export interface SearchRequest extends BaseRequest {
  keywords: string;
  start_page?: number;
  get_comment?: boolean;
  get_sub_comment?: boolean;
}

export interface DetailRequest extends BaseRequest {
  note_ids: string;
  get_comment?: boolean;
  get_sub_comment?: boolean;
}

export interface CreatorRequest extends BaseRequest {
  creator_ids: string;
  get_comment?: boolean;
  get_sub_comment?: boolean;
}

// 响应数据类型定义
export interface ApiResponse {
  status: 'success' | 'error' | 'started';
  message: string;
  output?: string;
  error?: string;
  command?: string;
  pid?: number;
}

export interface Platform {
  platform: string;
  name: string;
}

// API 调用服务类
export class MediaCrawlerAPI {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // 通用请求方法
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.detail || `API 请求失败: ${response.status}`
      );
    }

    return response.json();
  }

  // GET 请求
  private async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST 请求
  private async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // 获取服务状态
  async getStatus(): Promise<{ message: string; version: string }> {
    return this.get('/');
  }

  // 获取支持的平台列表
  async getPlatforms(): Promise<{ platforms: Platform[] }> {
    return this.get('/platforms');
  }

  // 搜索功能
  async search(request: SearchRequest): Promise<ApiResponse> {
    return this.post('/search', request);
  }

  // 异步搜索功能
  async searchAsync(request: SearchRequest): Promise<ApiResponse> {
    return this.post('/search/async', request);
  }

  // 详情功能
  async getDetail(request: DetailRequest): Promise<ApiResponse> {
    return this.post('/detail', request);
  }

  // 异步详情功能
  async getDetailAsync(request: DetailRequest): Promise<ApiResponse> {
    return this.post('/detail/async', request);
  }

  // 创作者功能
  async getCreator(request: CreatorRequest): Promise<ApiResponse> {
    return this.post('/creator', request);
  }

  // 异步创作者功能
  async getCreatorAsync(request: CreatorRequest): Promise<ApiResponse> {
    return this.post('/creator/async', request);
  }

  // 便捷搜索接口
  async quickSearch(
    platform: string,
    keywords: string,
    options: {
      login_type?: string;
      start_page?: number;
      get_comment?: boolean;
    } = {}
  ): Promise<ApiResponse> {
    const params = new URLSearchParams({
      keywords,
      login_type: options.login_type || 'qrcode',
      start_page: String(options.start_page || 1),
      get_comment: String(options.get_comment !== false),
    });

    return this.get(`/search/${platform}?${params}`);
  }
}

// 创建 API 实例
export const api = new MediaCrawlerAPI();

export const getPlatformName = (platformId: string): string => {
  const platformMap: Record<string, string> = {
    xhs: '小红书',
    dy: '抖音',
    ks: '快手',
    bili: '哔哩哔哩',
    wb: '微博',
    tieba: '百度贴吧',
    zhihu: '知乎',
  };
  return platformMap[platformId] || platformId;
};
