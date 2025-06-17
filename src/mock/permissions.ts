export interface Permission {
  id: number;
  roleName: string;
  permissions: string[];
  createTime: string;
  updateTime: string;
  status: 'active' | 'inactive';
}

export const permissionGroups = [
  {
    label: '总览',
    value: 'group-a',
    children: [
      { label: '查看患者详情', value: 'ckhzxq' },
      { label: '术前访视', value: 'sqfs' },
      { label: '预警申报', value: 'yjsb' }
    ]
  },
  {
    label: '排班',
    value: 'group-b',
    children: [
      { label: '查看个人排班', value: 'ckgrpb' },
      { label: '查看全科排班', value: 'ckqkpb' }
    ]
  },
  {
    label: '访视',
    value: 'group-c',
    children: [
      { label: '查看个人访视', value: 'ckgrfs' },
      { label: '查看全科访视', value: 'ckqkfs' }
    ]
  },
  {
    label: '预警',
    value: 'group-d',
    children: [
      { label: '查看报警详情', value: 'ckbjxq' },
      { label: '处理报警', value: 'clbj' }
    ]
  },
  {
    label: '工作量统计',
    value: 'group-e',
    children: [
      { label: '查看个人工作量', value: 'ckgrgzl' },
      { label: '查看全科工作量', value: 'ckqkgzl' }
    ]
  },
  {
    label: '查看个人工作报告',
    value: 'group-f'
  }
];

// Generate mock data
const generateMockData = (): Permission[] => {
  const data: Permission[] = [];
  const roles = ['主治医师', '住院医师', '主任', '副主任', '实习医师','访客'];
  const statuses: ('active' | 'inactive')[] = ['active', 'inactive'];
  
  for (let i = 1; i <= 50; i++) {
    const roleType = roles[Math.floor(Math.random() * roles.length)];
    const permissions = permissionGroups
      .flatMap(group => group.children || [group])
      .filter(() => Math.random() > 0.3)
      .map(p => p.value);
    
    const createTime = new Date(Date.now() - Math.random() * 10000000000).toISOString();
    const updateTime = new Date(Date.now() - Math.random() * 1000000000).toISOString();
    
    data.push({
      id: i,
      roleName: `${roleType}${i}`,
      permissions,
      createTime,
      updateTime,
      status: statuses[Math.floor(Math.random() * statuses.length)]
    });
  }
  
  return data;
};

export const mockPermissions = generateMockData(); 