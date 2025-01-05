export interface BlackListRule {
  id?: number; // 主键 ID
  fieldName?: string; // 匹配字段的名称
  alias?: string; // 别名
  regexPattern?: string; // 正则表达式
  description?: string; // 描述信息（可选）
  createdAt?: number; // 创建时间，使用 UNIX 时间戳（毫秒）
  type?: number;
}

export interface Product {
  id?: number; // 唯一标识符，自动递增
  name: string; // 商品名称
  description?: string; // 商品描述，非必填
  targetPlatform?: string; // 目标平台，非必填
  orderPlatform?: string; // 订单平台，非必填
  price?: number; // 商品价格，默认值为 0.00
  createdAt?: number; // 创建时间（Unix 时间戳秒）
  updatedAt?: number; // 更新时间（Unix 时间戳秒）
  isDel?: number; // 是否删除，非必填
}

export interface KeywordsManagement {
  id?: number; // 主键，自增
  keyword?: string; // 关键词
  productId?: number; // 所属商品ID（外键，可关联商品表）
  priority?: number; // 优先级，数字值，值越大优先级越高
  autoExpand?: number; // 是否自动拓展，0 表示否，1 表示是
  enableBlacklist?: number; // 是否启用黑名单，0 表示否，1 表示是
  whitelistOnly?: number; // 只能加白的限制值
  createdAt?: number; // 创建时间
  smartBlacklisted?: number;
  smartWhitelisted?: number;
}

// BlackListRule interface
export interface ListManagement {
  id?: number;
  platform?: string;
  uuid?: string;
  nickname?: string;
  reason?: string;
  updatedAt?: number;
  createdAt?: number;
  type?: number;
  fieldName?: string; // Optional, as per your modal usage
  alias?: string;
  regexPattern?: string;
}
