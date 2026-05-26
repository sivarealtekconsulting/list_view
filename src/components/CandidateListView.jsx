import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Dropdown,
  Flex,
  Input,
  Space,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import {
  DownOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import CustomPagination from './CustomPagination';
import frameIcon from './images/common/frame.svg';
import unorderedListOutlinedIcon from './images/common/unorderedlistoutlined.svg';

const { Text, Link } = Typography;

const MOCK_CANDIDATES = [
  {
    key: '1',
    name: 'Jayaprakash A',
    designation: 'DevOps Engineer',
    location: 'San Jose, CA',
    experience: '6 years',
    workAuth: 'H1B',
    rate: 80,
    status: 'Submitted',
    source: 'LinkedIn',
    createdAt: 'Mar 23, 2026',
    createdAgo: '2 months ago',
    skills: ['AWS', 'Docker', 'Kubernetes'],
  },
  {
    key: '2',
    name: 'Kiran Kumar',
    designation: 'Full Stack Developer',
    location: 'Texas',
    experience: '5 years',
    workAuth: 'GC EAD',
    rate: 75,
    status: 'Shortlisted',
    source: 'Referral',
    createdAt: 'Mar 20, 2026',
    createdAgo: '2 months ago',
    skills: ['React', 'Node', 'SQL'],
  },
  {
    key: '3',
    name: 'Sano S',
    designation: 'Java Developer',
    location: 'Chennai',
    experience: '7 years',
    workAuth: 'L2 EAD',
    rate: 70,
    status: 'Pipeline',
    source: 'Email',
    createdAt: 'Mar 18, 2026',
    createdAgo: '2 months ago',
    skills: ['Java', 'Spring', 'AWS'],
  },
];

const columnOptions = [
  { key: 'createdAt', label: 'Created Date' },
  { key: 'candidate', label: 'Candidate' },
  { key: 'location', label: 'Location' },
  { key: 'experience', label: 'Experience' },
  { key: 'workAuth', label: 'Work Auth' },
  { key: 'rate', label: 'Rate' },
  { key: 'status', label: 'Status' },
  { key: 'source', label: 'Source' },
];

const defaultVisibleColumnKeys = columnOptions.map(({ key }) => key);

const actionsMenu = {
  items: [
    { key: 'email', label: 'Email selected' },
    { key: 'submit', label: 'Submit to job' },
    { key: 'delete', label: 'Delete', danger: true },
  ],
};

function candidateStatusColor(status) {
  if (status === 'Submitted') return 'processing';
  if (status === 'Shortlisted') return 'warning';
  return 'default';
}

export default function CandidateListView() {
  const [activeTab, setActiveTab] = useState('submitted');
  const [search, setSearch] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 7 });
  const [visibleColumnKeys, setVisibleColumnKeys] = useState(defaultVisibleColumnKeys);
  const [columnMenuOpen, setColumnMenuOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q || q.length < 3) return MOCK_CANDIDATES;

    return MOCK_CANDIDATES.filter((candidate) => (
      candidate.name.toLowerCase().includes(q) ||
      candidate.designation.toLowerCase().includes(q) ||
      candidate.location.toLowerCase().includes(q) ||
      candidate.status.toLowerCase().includes(q)
    ));
  }, [search]);

  const pagedData = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    return filtered.slice(start, start + pagination.pageSize);
  }, [filtered, pagination]);

  const columns = useMemo(() => [
    {
      title: 'Candidate',
      dataIndex: 'name',
      key: 'name',
      visibilityKey: 'candidate',
      sorter: (a, b) => a.name.localeCompare(b.name),
      width: 190,
      render: (name, record) => (
        <Space align="start" size={6} className="job-title-cell">
          <Space direction="vertical" size={2}>
            <Link className="job-cell-link">{name}</Link>
            <Text type="secondary" className="job-cell-secondary">{record.designation}</Text>
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
      render: (location, record) => (
        <Space direction="vertical" size={2}>
          <Text className="job-cell-primary">{location}</Text>
          <Text type="secondary" className="job-cell-secondary">{record.source}</Text>
        </Space>
      ),
    },
    {
      title: 'Experience',
      dataIndex: 'experience',
      key: 'experience',
      sorter: (a, b) => a.experience.localeCompare(b.experience),
      width: '100%',
      render: (experience, record) => (
        <Space direction="vertical" size={2}>
          <Text className="job-cell-primary">{experience}</Text>
          <Text type="secondary" className="job-cell-secondary">{record.skills.join(', ')}</Text>
        </Space>
      ),
    },
    {
      title: 'Work Auth',
      dataIndex: 'workAuth',
      key: 'workAuth',
      sorter: (a, b) => a.workAuth.localeCompare(b.workAuth),
      width: '100%',
      render: (workAuth) => <Text className="job-cell-primary">{workAuth}</Text>,
    },
    {
      title: 'Rate (hr)',
      dataIndex: 'rate',
      key: 'rate',
      sorter: (a, b) => a.rate - b.rate,
      onHeaderCell: () => ({ className: 'col-header-left' }),
      width: '100%',
      render: (rate) => <Text className="job-cell-primary">${rate}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      onHeaderCell: () => ({ className: 'col-header-left' }),
      width: '100%',
      render: (status) => <Tag color={candidateStatusColor(status)}>{status}</Tag>,
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
  ], []);

  const visibleColumns = useMemo(
    () => columns.filter((column) => visibleColumnKeys.includes(column.visibilityKey || column.key)),
    [columns, visibleColumnKeys],
  );

  const allColumnsVisible = visibleColumnKeys.length === defaultVisibleColumnKeys.length;
  const someColumnsVisible = visibleColumnKeys.length > 0 && !allColumnsVisible;

  const toggleColumn = (key, checked) => {
    setVisibleColumnKeys((current) => {
      if (checked) return current.includes(key) ? current : [...current, key];
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

  const tabLabel = (label, count) => (
    <Space size={6}>
      <span>{label}</span>
      <Badge count={count} overflowCount={9999} />
    </Space>
  );

  return (
    <div className="antd">
      <Card>
        <Flex align="center" justify="space-between">
          <Tabs
            activeKey={activeTab}
            items={[
              { key: 'submitted', label: tabLabel('Submitted', 1) },
              { key: 'pipeline', label: tabLabel('Pipeline', 2) },
            ]}
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
          </Flex>
        </Flex>
      </Card>

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

      <Table
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        columns={visibleColumns}
        dataSource={pagedData}
        size="middle"
        scroll={{ x: '100%' }}
        showSorterTooltip={false}
        tableLayout="fixed"
        pagination={false}
        className="job-list-table"
      />

      <CustomPagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={filtered.length}
        onChange={(page) => setPagination((current) => ({ ...current, current: page }))}
        onPageSizeChange={(size) => setPagination({ current: 1, pageSize: size })}
      />
    </div>
  );
}
