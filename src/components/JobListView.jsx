import { useState, useMemo } from 'react';
import {
  Table, Input, Button, Space, Typography, Tooltip, Dropdown, Tabs, Badge, Card, Flex, Checkbox,
} from 'antd';
import {
  BookFilled, LinkedinFilled,
  FilterOutlined, PlusOutlined, DownOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { MOCK_JOBS } from '../data/jobs';
import StatusBadge from './StatusBadge';
import AssigneeAvatars from './AssigneeAvatars';
import CustomPagination from './CustomPagination';
import eyeOutlinedIcon from './images/common/eyeoutlined.svg';
import frameIcon from './images/common/frame.svg';
import unorderedListOutlinedIcon from './images/common/unorderedlistoutlined.svg';

const { Text, Link } = Typography;

const MY_JOBS_COUNT = 6;
const ALL_JOBS_COUNT = 2456;

const columnOptions = [
  { key: 'createdAt', label: 'Created Date' },
  { key: 'jobsGroup', label: 'Jobs' },
  { key: 'location', label: 'Location' },
  { key: 'experience', label: 'Experience' },
  { key: 'clientRate', label: 'Client Rate' },
  { key: 'status', label: 'Status' },
  { key: 'targetSub', label: 'Target Sub' },
  { key: 'pipeline', label: 'Pipeline' },
];

const defaultVisibleColumnKeys = columnOptions.map(({ key }) => key);

const actionsMenu = {
  items: [
    { key: 'export', label: 'Export selected' },
    { key: 'assign', label: 'Assign' },
    { key: 'delete', label: 'Delete', danger: true },
  ],
};

export default function JobListView() {
  const [activeTab, setActiveTab] = useState('my');
  const [search, setSearch] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState(['1', '2']);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 7 });
  const [visibleColumnKeys, setVisibleColumnKeys] = useState(defaultVisibleColumnKeys);
  const [columnMenuOpen, setColumnMenuOpen] = useState(false);

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
      dataIndex: 'icons',
      key: 'icons',
      visibilityKey: 'jobsGroup',
      //width: '100%',
      width: 60,
      render: (title, record) => (
        <Space size={4} className="job-row-icons">
          <Tooltip title="Preview">
            <img src={eyeOutlinedIcon} alt="Preview" className="job-row-eye-icon" />
          </Tooltip>
          {record.hasBookmark && (
            <Tooltip title="Bookmarked">
              <BookFilled className="job-row-bookmark-icon" />
            </Tooltip>
          )}
          {record.hasLinkedIn && (
            <Tooltip title="LinkedIn">
              <LinkedinFilled className="job-row-linkedin-icon" />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: 'Jobs',
      dataIndex: 'title',
      key: 'title',
      visibilityKey: 'jobsGroup',
      sorter: (a, b) => a.title.localeCompare(b.title),
      width: 190,
      render: (title, record) => (
        <Space align="start" size={6} className="job-title-cell">
          <Space direction="vertical" size={2}>
            <Link className="job-cell-link">{title}</Link>
            <Text type="secondary" className="job-cell-secondary">{record.client}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      sorter: (a, b) => a.location.localeCompare(b.location),
      width: '100%',
      render: (loc, record) => (
        <Space direction="vertical" size={2}>
          <Text className="job-cell-primary">{loc}</Text>
          <Text type="secondary" className="job-cell-secondary">{record.locationType}</Text>
        </Space>
      ),
    },
    {
      title: 'Experience',
      dataIndex: 'experience',
      key: 'experience',
      sorter: (a, b) => a.experience.localeCompare(b.experience),
      width: '100%',
      render: (exp, record) => (
        <Space direction="vertical" size={2}>
          <Text className="job-cell-primary">{exp}</Text>
          <Text type="secondary" className="job-cell-secondary">{record.employmentType}</Text>
        </Space>
      ),
    },
    {
      title: 'Client Rate (hr)',
      dataIndex: 'clientRate',
      key: 'clientRate',
      sorter: (a, b) => a.clientRate - b.clientRate,
      onHeaderCell: () => ({ className: 'col-header-left' }),
      width: '100%',
      render: (rate) => <Text className="job-cell-primary">${rate}</Text>,
    },
    {
      title: 'Target Sub',
      dataIndex: 'targetSub',
      key: 'targetSub',
      sorter: (a, b) => a.targetSub.filled - b.targetSub.filled,
      onHeaderCell: () => ({ className: 'col-header-left' }),
      width: '100%',
      render: (sub) => (
        <Text className="job-cell-primary">{sub.filled} of {sub.total}</Text>
      ),
    },
    {
      title: 'Pipeline',
      dataIndex: 'pipeline',
      key: 'pipeline',
      sorter: (a, b) => a.pipeline - b.pipeline,
      width: '100%',
      render: (val) => <Text className="job-cell-primary">{val}</Text>,
    },
    {
      title: 'Assignee',
      dataIndex: 'assignees',
      key: 'assignees',
      width: '100%',
      render: (assignees, record) => (
        <AssigneeAvatars assignees={assignees} extraAssignees={record.extraAssignees} />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      onHeaderCell: () => ({ className: 'col-header-left' }),
      width: '100%',
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: 'Created date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      width: '100%',
      render: (date, record) => (
        <Space direction="vertical" size={2}>
          <Text className="job-cell-primary">{date}</Text>
          <Text type="secondary" className="job-cell-secondary">{record.createdAgo}</Text>
        </Space>
      ),
    },
  ];

  const visibleColumns = useMemo(
    () => columns.filter((column) => visibleColumnKeys.includes(column.visibilityKey || column.key)),
    [columns, visibleColumnKeys],
  );

  const allColumnsVisible = visibleColumnKeys.length === defaultVisibleColumnKeys.length;
  const someColumnsVisible = visibleColumnKeys.length > 0 && !allColumnsVisible;

  const toggleColumn = (key, checked) => {
    setVisibleColumnKeys((current) => {
      if (checked) {
        return current.includes(key) ? current : [...current, key];
      }

      return current.filter((columnKey) => columnKey !== key);
    });
  };

  const columnVisibilityContent = (
    <div className="column-visibility-menu" onClick={(event) => event.stopPropagation()}>
      <Checkbox
        checked={allColumnsVisible}
        indeterminate={someColumnsVisible}
        onChange={(event) => {
          setVisibleColumnKeys(event.target.checked ? defaultVisibleColumnKeys : []);
        }}
      >
        Select All
      </Checkbox>
      {columnOptions.map((column) => (
        <Checkbox
          key={column.key}
          checked={visibleColumnKeys.includes(column.key)}
          onChange={(event) => toggleColumn(column.key, event.target.checked)}
        >
          {column.label}
        </Checkbox>
      ))}
    </div>
  );

  const rowSelection = {
    type: 'checkbox',
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  const tabLabel = (label, count) => (
    <Space size={6}>
      <span>{label}</span>
      <Badge count={count} overflowCount={9999} />
    </Space>
  );

  const tabItems = [
    { key: 'my', label: tabLabel('My Jobs', MY_JOBS_COUNT) },
    { key: 'all', label: tabLabel('All Jobs', ALL_JOBS_COUNT) },
  ];

  return (
    <div className="antd">

      {/* Top toolbar */}
      <Card>
        <Flex align="center" justify="space-between">
          <Tabs
            activeKey={activeTab}
            items={tabItems}
            onChange={(key) => {
              setActiveTab(key);
              setPagination({ ...pagination, current: 1 });
            }}
          />
          <Flex align="center" gap={8}>
            <Input
              prefix={<SearchOutlined className="job-search-icon" />}
              placeholder="Min 3 Chars to search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPagination({ ...pagination, current: 1 }); }}
              allowClear
              className="job-search-input"
            />
            <Tooltip title="Filter">
              <Button className="job-toolbar-icon-button" icon={<FilterOutlined />} />
            </Tooltip>
            <Tooltip title="Add">
              <Button className="job-toolbar-icon-button" icon={<PlusOutlined />} />
            </Tooltip>
            <Button type="primary" className="job-summary-button">
              View Summary
            </Button>
          </Flex>
        </Flex>
      </Card>

      {/* Actions toolbar */}
      <Card>
        <Flex align="center" gap={3}>
          <Dropdown
            open={columnMenuOpen}
            onOpenChange={setColumnMenuOpen}
            trigger={['click']}
            dropdownRender={() => columnVisibilityContent}
            placement="bottomLeft"
            overlayClassName="column-visibility-dropdown"
          >
            <Button
              type="text"
              icon={<img src={unorderedListOutlinedIcon} alt="" className="job-action-list-icon" />}
              size="small"
              className="job-actions-button"
            />
          </Dropdown>
          <Dropdown menu={actionsMenu} trigger={['click']}>
            <Button
              type="text"
              size="small"
              className="job-actions-button job-actions-menu-button"
            >
              <img src={frameIcon} alt="" className="job-actions-frame-icon" />
              Actions <DownOutlined className="job-actions-caret" />
            </Button>
          </Dropdown>
          {selectedRowKeys.length > 0 && (
            <Text className="job-selected-count">
              Selected ({selectedRowKeys.length})
            </Text>
          )}
        </Flex>
      </Card>

      {/* Table grid */}
      <Table
        rowSelection={rowSelection}
        columns={visibleColumns}
        dataSource={pagedData}
        size="middle"
        scroll={{ x: '100%' }}
        showSorterTooltip={false}
        tableLayout="fixed"
        pagination={false}
        className="job-list-table"
      />

      {/* Pagination */}
      <CustomPagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={filtered.length}
        onChange={(page) => setPagination(p => ({ ...p, current: page }))}
        onPageSizeChange={(size) => setPagination({ current: 1, pageSize: size })}
      />

    </div>
  );
}
