export interface BlackListRule {
  id?: number; // 主键 ID
  fieldName?: string; // 匹配字段的名称
  alias?: string; // 别名
  regexPattern?: string; // 正则表达式
  description?: string; // 描述信息（可选）
  createdAt?: number; // 创建时间，使用 UNIX 时间戳（毫秒）
  type?: number;
  disabled?: number;
  rowLoading?: boolean;
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

/**
 * 用户笔记评论表 (NotesComments)
 */
export interface NotesComments {
  id?: number; // 主键ID
  colUserId?: string; // 采集者ID
  colName?: string; // 采集者昵称
  colImage?: string; // 采集者头像
  noteId?: string; // 笔记ID
  noteType?: string; // 笔记类型
  noteCover?: string; // 笔记封面
  noteTitle?: string; // 笔记标题
  noteUserId?: string; // 作者ID
  noteUserName?: string; // 作者昵称
  noteUserImage?: string; // 作者头像
  colCursor?: string; // 评论标识
  colToken?: string; // 采集者Token
  comId?: string; // 评论ID
  comNoteId?: string; // 评论关联的笔记ID
  comStatus?: string; // 评论状态 (0: 隐藏, 1: 显示)
  comContent?: string; // 评论内容
  comCreateTime?: string; // 评论时间
  comLikeCount?: string; // 评论点赞数
  comSubCommentCount?: string; // 评论回复数
  comUserId?: string; // 评论者ID
  comUserNickname?: string; // 评论者昵称
  comUserImage?: string; // 评论者头像
  comUserToken?: string; // 评论者Token
  updatetime?: string; // 更新时间
  createtime?: string; // 创建时间
  myCreateTime?: number; // 自定义创建时间
  filterType?: number; // 0: 黑名单, 1: 白名单
  reason?: string; // 原因
  notifyFlag?: number; // 通知状态 (0: 未通知, 1: 已通知)
  notifyTime?: number; // 提交第三方时间
  filterTime?: number; // 过滤黑白名单时间
  keyType?: string; // 键类型
  keyText?: string; // 键内容

  removeLoading: boolean;
}

// export interface ChatMessage {
//   id: number;
//   chatId: number | null; // 添加 chatId
//   from: 'user' | 'customer';
//   content: string;
//   time: string;
// }

export interface Message {
  id?: number; // 主键ID
  // taskId: string; // 任务ID
  userId: string; // 用户ID
  userName: string; // 用户名
  contentType: number; // 消息类型 (0 = 文本，1 = 图片，2 = 视频)
  contentValue: string; // 消息内容
  timestamp?: number; // 时间戳
  // status: number; // 消息状态 (0 = 待处理，1 = 成功，2 = 失败)
  // operatorId: number; // 操作员ID
  senderType: number; // 发送者类型 (0 = 第三方用户，1 = B 端管理员，2 = 系统消息)
  isRead?: number; // 是否已读 (1 = 未读，0 = 已读)
  // createdAt: number; // 创建时间
  // updatedAt: number; // 更新时间

  last?: boolean; // 用于判断是否显示到最后
  sendStatus?: number; // 0发送中 1 发送成功 2 发送失败
  requestId?: string;
}

export interface UserMessage {
  userId: string;
  userName: string;
  unReadCount: number;
  // messages: Message[];
}

// export interface UserItem {
//   userName: string;
//   userId: string;
//   unReadCount: number;

//   messages;
// }

// export interface ChatMessages {
//   id: number; // 主键ID
//   taskId: string; // 任务ID
//   userId: string; // 用户ID
//   userName: string; // 用户名
//   contentType: number; // 消息类型 (0 = 文本，1 = 图片，2 = 视频)
//   contentValue: string; // 消息内容
//   timestamp: number; // 时间戳
//   status: number; // 消息状态 (0 = 待处理，1 = 成功，2 = 失败)
//   operatorId: number; // 操作员ID
//   senderType: number; // 发送者类型 (0 = 第三方用户，1 = B 端管理员，2 = 系统消息)
//   isRead: number; // 是否已读 (1 = 未读，0 = 已读)
//   createdAt: number; // 创建时间
//   updatedAt: number; // 更新时间
// }

// src/pages/types.ts
export interface ScriptTemplate {
  id?: number; // 主键, 新增时为可选
  keyType?: string; // 招呼话术类型
  content: string; // 招呼话术内容
  isDel: number; // 是否删除（0：未删除，其他：已删除）
  isDisabled: number; // 是否禁用（0：启用，1：禁用）
  createdAt?: number; // 创建时间
  updatedAt?: number; // 更新时间
  rowLoading?: boolean;
}
