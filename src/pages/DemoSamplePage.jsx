import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  Dropdown,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tooltip,
  Typography,
} from 'antd';
import {
  BookFilled,
  DownOutlined,
  FilterOutlined,
  LinkedinFilled,
  PlusOutlined,
  SearchOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import StatsCards from '../components/cards/StatsCards';
import CalendarCard from '../components/cards/CalendarCard';
import { formatters, validationRules } from '../components/form/validation';
import StickyNotesCard from '../components/cards/StickyNotesCard';
import ClientSubmissionCard from '../components/cards/ClientSubmissionCard';
import OnboardingCard from '../components/cards/OnboardingCard';
import { SONY_MOCK_JOBS } from '../data/sonyMockData';
import StatusBadge from '../components/StatusBadge';
import AssigneeAvatars from '../components/AssigneeAvatars';
import CustomPagination from '../components/CustomPagination';
import JobFilters from '../components/filters';
import eyeOutlinedIcon from '../components/images/common/eyeoutlined.svg';
import frameIcon from '../components/images/common/frame.svg';
import unorderedListOutlinedIcon from '../components/images/common/unorderedlistoutlined.svg';

const { Text } = Typography;

const categoryOptions = [
  { value: 'Type A', label: 'Type A' },
  { value: 'Type B', label: 'Type B' },
  { value: 'Type C', label: 'Type C' },
];

const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Inactive', label: 'Inactive' },
];

const assigneeOptions = [
  { value: 'Sarah Wilson', label: 'Sarah Wilson' },
  { value: 'Mike Brown', label: 'Mike Brown' },
  { value: 'Emily Davis', label: 'Emily Davis' },
  { value: 'David Wilson', label: 'David Wilson' },
];

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

function getComparableValue(record, field) {
  const value = record[field];

  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'object') {
    return Object.values(value).join(' ');
  }

  return String(value);
}

function filterMatches(record, filterRow) {
  const value = getComparableValue(record, filterRow.field).trim();

  if (filterRow.operator === 'isEmpty') {
    return value.length === 0;
  }

  if (filterRow.operator === 'notEmpty') {
    return value.length > 0;
  }

  if (!filterRow.values?.length) {
    return true;
  }

  const normalizedValue = value.toLowerCase();

  return filterRow.values.some((selectedValue) => (
    normalizedValue.includes(String(selectedValue).toLowerCase())
  ));
}

function VenkateshListView() {
  const [activeTab, setActiveTab] = useState('my');
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [appliedFilterRows, setAppliedFilterRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [visibleColumnKeys, setVisibleColumnKeys] = useState(defaultVisibleColumnKeys);
  const [columnMenuOpen, setColumnMenuOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const searchableJobs = !q || q.length < 3
      ? SONY_MOCK_JOBS
      : SONY_MOCK_JOBS.filter(
        (job) => (
          job.title.toLowerCase().includes(q)
          || job.location.toLowerCase().includes(q)
          || job.status.toLowerCase().includes(q)
        ),
      );

    const validFilterRows = appliedFilterRows.filter((row) => row.field);

    if (!validFilterRows.length) {
      return searchableJobs;
    }

    return searchableJobs.filter((job) => (
      validFilterRows.reduce((matches, row, index) => {
        const rowMatches = filterMatches(job, row);

        if (index === 0 || row.operator === 'and') {
          return matches && rowMatches;
        }

        if (row.operator === 'or') {
          return matches || rowMatches;
        }

        return matches && rowMatches;
      }, true)
    ));
  }, [appliedFilterRows, search]);

  const pagedData = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    return filtered.slice(start, start + pagination.pageSize);
  }, [filtered, pagination]);

  const columns = useMemo(() => [
    {
      dataIndex: 'icons',
      key: 'icons',
      visibilityKey: 'jobsGroup',
      width: 60,
      render: (_, record) => (
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
            <RouterLink className="job-cell-link" to={`/Venkatesh-detailview/${record.id}`}>
              {title}
            </RouterLink>
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
      render: (location, record) => (
        <Space direction="vertical" size={2}>
          <Text className="job-cell-primary">{location}</Text>
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
      render: (experience, record) => (
        <Space direction="vertical" size={2}>
          <Text className="job-cell-primary">{experience}</Text>
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
      render: (targetSub) => (
        <Text className="job-cell-primary">{targetSub.filled} of {targetSub.total}</Text>
      ),
    },
    {
      title: 'Pipeline',
      dataIndex: 'pipeline',
      key: 'pipeline',
      sorter: (a, b) => a.pipeline - b.pipeline,
      width: '100%',
      render: (pipeline) => <Text className="job-cell-primary">{pipeline}</Text>,
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
  ], []);

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
              onChange={(event) => {
                setSearch(event.target.value);
                setPagination({ ...pagination, current: 1 });
              }}
              allowClear
              className="job-search-input"
            />
            <Tooltip title="Filter">
              <Button
                className="job-toolbar-icon-button"
                icon={<FilterOutlined />}
                onClick={() => setFiltersOpen(true)}
              />
            </Tooltip>
            <Tooltip title="Add">
              <a href="/add">
                <Button className="job-toolbar-icon-button" icon={<PlusOutlined />} />
              </a>
            </Tooltip>
            <Button type="primary" className="job-summary-button">
              View Summary
            </Button>
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

      <CustomPagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={filtered.length}
        onChange={(page) => setPagination((current) => ({ ...current, current: page }))}
        onPageSizeChange={(size) => setPagination({ current: 1, pageSize: size })}
      />

      <JobFilters
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        onApply={({ filters }) => {
          setAppliedFilterRows(filters);
          setPagination((current) => ({ ...current, current: 1 }));
        }}
      />
    </div>
  );
}

export default function DemoSamplePage() {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    console.log('Demo sample form values:', values);
  };
  return (
    <div className="dashboard-wrapper">

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={24}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <StatsCards />

            </Col>

            <Col xs={24} xl={10}>
              <CalendarCard />
            </Col>
            <Col xs={24} xl={14}>
              <Card title="Add / Edit Personality">
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Personality Name"
                        name="personalityName"
                        rules={[
                          validationRules.required('Personality Name'),
                          validationRules.alphabets(),
                          validationRules.firstNameMinLength(),
                          validationRules.firstNameMaxLength(),
                        ]}
                      >
                        <Input
                          placeholder="Enter personality name"
                          onChange={(event) => {
                            form.setFieldsValue({
                              personalityName: formatters.fullNameFormatter(event.target.value),
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                          validationRules.remarks(),
                          validationRules.remarksMaxLength(),
                        ]}
                      >
                        <Input.TextArea placeholder="Enter description" rows={3} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Category"
                        name="category"
                        rules={[validationRules.required('Category')]}
                      >
                        <Select placeholder="Select category" options={categoryOptions} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Assigned To"
                        name="assignedTo"
                      >
                        <Select placeholder="Select user" options={assigneeOptions} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Status"
                        name="status"
                        rules={[validationRules.required('Status')]}
                      >
                        <Select placeholder="Select status" options={statusOptions} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Date of Birth"
                        name="dob"
                        rules={[validationRules.dob(false)]}
                      >
                        <Input
                          placeholder="MM/DD/YYYY"
                          maxLength={10}
                          onChange={(event) => {
                            form.setFieldsValue({
                              dob: formatters.dobFormatter(event.target.value),
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row justify="end" gutter={12}>
                    <Col><Button onClick={() => form.resetFields()}>Cancel</Button></Col>
                    <Col><Button type="primary" htmlType="submit">Save</Button></Col>
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col>
          <StickyNotesCard />
        </Col>
        <Col xs={24} md={12}>
          <OnboardingCard />
        </Col>

        <Col xs={24} md={12}>
          <ClientSubmissionCard />
        </Col>

        <Col xs={24} md={24}>
          <Card
            title={(
              <Flex align="center" justify="space-between">
                <Space>
                  <TeamOutlined />
                  <Text strong>Personality List</Text>
                </Space>
                {/* <Space>
                  <Button type="text"  icon={<FilterOutlined />} onClick={() => setFiltersOpen(true)} />
                  <Button icon={<PlusOutlined />} />
                </Space> */}
              </Flex>
            )}
          >
            <VenkateshListView />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
