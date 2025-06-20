import type { Permission, PermissionGroup } from '@/types/permission';

export const permissionGroups: PermissionGroup[] = [
  {
    label: 'group-a',
    value: '总览',
    children: [
      { label: 'ckhzxq', value: '查看患者详情' },
      { label: 'sqfs', value: '术前访视' },
      { label: 'yjsb', value: '预警申报' },
    ],
  },
  {
    label: 'group-b',
    value: '排班',
    children: [
      { label: 'ckgrp', value: '查看个人排班' },
      { label: 'ckqkpb', value: '查看全科排班' },
    ],
  },
  {
    label: 'group-c',
    value: '访视',
    children: [
      { label: 'ckgrfs', value: '查看个人访视' },
      { label: 'ckqkfs', value: '查看全科访视' },
    ],
  },
  {
    label: 'group-d',
    value: '报警',
    children: [
      { label: 'ckbjxq', value: '查看报警详情' },
      { label: 'clbj', value: '处理报警' },
    ],
  },
  {
    label: 'group-e',
    value: '工作量统计',
    children: [
      { label: 'ckgrgzl', value: '查看个人工作量' },
      { label: 'ckqkgzl', value: '查看全科工作量' },
    ],
  },
  {
    label: 'group-f',
    value: '查看个人工作报告',
  },
];

// Generate mock data
const generateMockData = (): Permission[] => {
  const data: Permission[] = [];
  const roles = ['主治医师', '住院医师', '主任', '副主任', '实习医师', '访客'];
  const statuses: ('active' | 'inactive')[] = ['active', 'inactive'];

  for (let i = 1; i <= 50; i++) {
    const roleType = roles[Math.floor(Math.random() * roles.length)];
    const noPermission = Math.random() < 0.1; // 10% 的概率为无权限
    const permissions = noPermission
      ? []
      : permissionGroups
          .flatMap(group => group.children || [group])
          .filter(() => Math.random() > 0.3)
          .map(p => p.value);

    const createTime = new Date(
      Date.now() - Math.random() * 10000000000
    ).toISOString();
    const updateTime = new Date(
      Date.now() - Math.random() * 1000000000
    ).toISOString();

    data.push({
      id: i,
      roleName: `${roleType}${i}`,
      permissions,
      noPermission,
      createTime,
      updateTime,
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  }

  return data;
};

export const mockPermissions = generateMockData();
