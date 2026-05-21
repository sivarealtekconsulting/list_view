import { useState, useMemo } from 'react';
import {
  Table, Input, Button, Space, Typography, Tooltip, Dropdown, theme,
} from 'antd';
import {
  EyeOutlined, BookFilled, LinkedinFilled,
  FilterOutlined, PlusOutlined, UnorderedListOutlined, DownOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { MOCK_JOBS } from '../data/jobs';
import StatusBadge from './StatusBadge';
import AssigneeAvatars from './AssigneeAvatars';
import CustomPagination from './CustomPagination';

const { Text, Link } = Typography;
const { useToken } = theme;

const ALL_JOBS_COUNT = 2456;

const actionsMenu = {
  items: [
    { key: 'export', label: 'Export selected' },
    { key: 'assign', label: 'Assign' },
    { key: 'delete', label: 'Delete', danger: true },
  ],
};

export default function JobListView() {
  const { token } = useToken();
  const [activeTab, setActiveTab] = useState('my');
  const [search, setSearch] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 7 });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q || q.length < 3) return MOCK_JOBS;
    return MOCK_JOBS.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.status.toLowerCase().includes(q),
    );
  }, [search]);

  const pagedData = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    return filtered.slice(start, start + pagination.pageSize);
  }, [filtered, pagination]);

  const columns = [
    {
      title: 'Jobs',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      width: '22%',
      render: (title, record) => (
        <Space align="start" size={6}>
          <Space size={4} style={{ marginTop: 2, flexShrink: 0 }}>
            <Tooltip title="Preview">
              <EyeOutlined style={{ color: '#aaa', cursor: 'pointer', fontSize: 13 }} />
            </Tooltip>
            {record.hasBookmark && (
              <Tooltip title="Bookmarked">
                <BookFilled style={{ color: '#ef4444', cursor: 'pointer', fontSize: 13 }} />
              </Tooltip>
            )}
            {record.hasLinkedIn && (
              <Tooltip title="LinkedIn">
                <LinkedinFilled style={{ color: '#0077b5', cursor: 'pointer', fontSize: 13 }} />
              </Tooltip>
            )}
          </Space>
          <Space direction="vertical" size={2}>
            <Link style={{ fontSize: 13, color: '#1677ff', fontWeight: 500 }}>{title}</Link>
            <Text type="secondary" style={{ fontSize: 11 }}>{record.client}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      sorter: (a, b) => a.location.localeCompare(b.location),
      width: '10%',
      render: (loc, record) => (
        <Space direction="vertical" size={2}>
          <Text style={{ fontSize: 13 }}>{loc}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>{record.locationType}</Text>
        </Space>
      ),
    },
    {
      title: 'Experience',
      dataIndex: 'experience',
      key: 'experience',
      sorter: (a, b) => a.experience.localeCompare(b.experience),
      width: '10%',
      render: (exp, record) => (
        <Space direction="vertical" size={2}>
          <Text style={{ fontSize: 13 }}>{exp}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>{record.employmentType}</Text>
        </Space>
      ),
    },
    {
      title: 'Client Rate (hr)',
      dataIndex: 'clientRate',
      key: 'clientRate',
      sorter: (a, b) => a.clientRate - b.clientRate,
      width: '11%',
      render: (rate) => <Text style={{ fontSize: 13 }}>${rate}</Text>,
    },
    {
      title: 'Target Sub',
      dataIndex: 'targetSub',
      key: 'targetSub',
      sorter: (a, b) => a.targetSub.filled - b.targetSub.filled,
      width: '9%',
      render: (sub) => (
        <Text style={{ fontSize: 13 }}>{sub.filled} of {sub.total}</Text>
      ),
    },
    {
      title: 'Pipeline',
      dataIndex: 'pipeline',
      key: 'pipeline',
      sorter: (a, b) => a.pipeline - b.pipeline,
      align: 'center',
      width: '8%',
      render: (val) => <Text style={{ fontSize: 13 }}>{val}</Text>,
    },
    {
      title: 'Assignee',
      dataIndex: 'assignees',
      key: 'assignees',
      width: '9%',
      render: (assignees, record) => (
        <AssigneeAvatars assignees={assignees} extraAssignees={record.extraAssignees} />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      width: '13%',
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: 'Created date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      defaultSortOrder: 'descend',
      width: '11%',
      render: (date, record) => (
        <Space direction="vertical" size={2}>
          <Text style={{ fontSize: 13 }}>{date}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>{record.createdAgo}</Text>
        </Space>
      ),
    },
  ];

  const rowSelection = { selectedRowKeys, onChange: setSelectedRowKeys };

  const tabBtn = (key, label, count) => {
    const isActive = activeTab === key;
    return (
      <div
        key={key}
        role="tab"
        tabIndex={0}
        onClick={() => { setActiveTab(key); setPagination({ ...pagination, current: 1 }); }}
        onKeyDown={(e) => e.key === 'Enter' && setActiveTab(key)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          height: 46,
          padding: '0 16px 0 4px',
          boxSizing: 'border-box',
          borderBottom: isActive ? '2px solid #1677ff' : '2px solid transparent',
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: isActive ? 600 : 400,
          color: isActive ? '#1677ff' : '#595959',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          transition: 'color 0.2s, border-color 0.2s',
        }}
      >
        {label}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isActive ? '#1677ff' : '#f0f0f0',
            color: isActive ? '#fff' : '#595959',
            borderRadius: 5,
            fontSize: 11,
            fontWeight: 700,
            padding: '2px 7px',
            lineHeight: '16px',
            minWidth: 20,
          }}
        >
          {count}
        </span>
      </div>
    );
  };

  const card = {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  };

  return (
    <div style={{ padding: 24, minHeight: '100vh', background: '#f5f6fa', display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* ═══ CARD 1 — My Jobs / All Jobs tabs + Toolbar ═══ */}
      <div style={card}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          height: 52,
        }}>
          <div style={{ display: 'flex', alignItems: 'stretch', height: '100%', flexShrink: 0 }}>
            {tabBtn('my',  'My Jobs',  MOCK_JOBS.length)}
            {tabBtn('all', 'All Jobs', ALL_JOBS_COUNT.toLocaleString())}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <Input
              prefix={<SearchOutlined style={{ color: '#bbb' }} />}
              placeholder="Min 3 Chars to search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPagination({ ...pagination, current: 1 }); }}
              allowClear
              style={{ width: 220, borderRadius: 8, fontSize: 13 }}
            />
            <Tooltip title="Filter">
              <Button icon={<FilterOutlined />} style={{ borderRadius: 8, color: '#595959' }} />
            </Tooltip>
            <Tooltip title="Add">
              <Button icon={<PlusOutlined />} style={{ borderRadius: 8, color: '#595959' }} />
            </Tooltip>
            <Button type="primary" style={{ borderRadius: 8, fontWeight: 500 }}>
              View Summary
            </Button>
          </div>
        </div>
      </div>

      {/* ═══ CARD 2 — Actions / Selected toolbar ═══ */}
      <div style={card}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '6px 12px',
          minHeight: 38,
        }}>
          <Button
            type="text"
            icon={<UnorderedListOutlined />}
            size="small"
            style={{ color: '#8c8c8c', fontSize: 13 }}
          />
          <Dropdown menu={actionsMenu} trigger={['click']}>
            <Button
              type="text"
              size="small"
              style={{ color: '#8c8c8c', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Actions <DownOutlined style={{ fontSize: 10 }} />
            </Button>
          </Dropdown>
          {selectedRowKeys.length > 0 && (
            <Text style={{ color: '#1677ff', fontWeight: 500, fontSize: 13, marginLeft: 4 }}>
              Selected ({selectedRowKeys.length})
            </Text>
          )}
        </div>
      </div>

      {/* ═══ CARD 3 — Table Grid ═══ */}
      <div style={card}>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={pagedData}
          size="middle"
          scroll={{ x: 'max-content' }}
          className="job-table"
          rowClassName={(_, index) => (index % 2 === 0 ? 'row-even' : 'row-odd')}
          showSorterTooltip={false}
          tableLayout="fixed"
          pagination={false}
          style={{ borderRadius: 0 }}
        />

        {/* Custom professional pagination */}
        <CustomPagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={filtered.length}
          onChange={(page) => setPagination(p => ({ ...p, current: page }))}
          onPageSizeChange={(size) => setPagination({ current: 1, pageSize: size })}
        />
      </div>

    </div>
  );
}
