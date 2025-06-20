/**
 * 事件类型枚举
 * 统一管理所有组件间的事件类型，避免拼写错误并支持 IDE 自动补全
 */

export const ToolbarActions = {
  SEARCH: 'search',
  ADD: 'add',
  BATCH_DELETE: 'batch-delete',
} as const;

export const TableActions = {
  SELECT: 'selection-change',
  EDIT: 'edit',
  DELETE: 'delete',
} as const;

export const DialogActions = {
  SUBMIT: 'submit',
} as const;

export const PaginationActions = {
  CHANGE: 'pagination-change',
} as const;

// 类型定义
export type ToolbarActionType =
  (typeof ToolbarActions)[keyof typeof ToolbarActions];
export type TableActionType = (typeof TableActions)[keyof typeof TableActions];
export type DialogActionType =
  (typeof DialogActions)[keyof typeof DialogActions];
export type PaginationActionType =
  (typeof PaginationActions)[keyof typeof PaginationActions];

// 事件数据接口
export interface ActionEvent<T = any> {
  type: string;
  payload?: T;
}

export interface ToolbarActionEvent extends ActionEvent {
  type: ToolbarActionType;
}

export interface TableActionEvent extends ActionEvent {
  type: TableActionType;
}

export interface DialogActionEvent extends ActionEvent {
  type: DialogActionType;
}

export interface PaginationActionEvent extends ActionEvent {
  type: PaginationActionType;
}
