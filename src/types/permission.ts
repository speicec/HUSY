/**
 * 权限数据类型定义
 */

// 权限项接口
export interface Permission {
  id: number;
  roleName: string;
  permissions: string[];
  noPermission: boolean; // 是否无医生端权限
  createTime: string;
  updateTime: string;
  status: 'active' | 'inactive';
}

// 权限组接口
export interface PermissionGroup {
  label: string;
  value: string;
  children?: PermissionItem[];
}

// 权限项接口
export interface PermissionItem {
  label: string;
  value: string;
}
