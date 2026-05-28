import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  Card,
  Checkbox,
  Dropdown,
  Flex,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import CustomPagination from './CustomPagination';
import JobFilters from './filters';
import frameIcon from './images/common/frame.svg';
import unorderedListOutlinedIcon from './images/common/unorderedlistoutlined.svg';
import { PERSONALITIES, PERSONALITY_STATUS_COLORS } from '../data/personalities';

const { Text } = Typography;

const columnOptions = [
  { key: 'serial', label: 'S.no' },
  { key: 'code', label: 'ID' },
  { key: 'name', label: 'Personality Name' },
  { key: 'category', label: 'Category' },
  { key: 'contact', label: 'Contact' },
  { key: 'location', label: 'Location' },
  { key: 'status', label: 'Status' },
  { key: 'priority', label: 'Priority' },
  { key: 'assignedTo', label: 'Assigned To' },
  { key: 'completion', label: 'Completion' },
  { key: 'lastUpdated', label: 'Last Updated' },
];

const defaultVisibleColumnKeys = columnOptions.map(({ key }) => key);

const actionsMenu = {
  items: [
    { key: 'export', label: 'Export selected' },
    { key: 'assign', label: 'Assign' },
    { key: 'delete', label: 'Delete', danger: true },
  ],
};

export default function VenkateshListView({ filtersOpen = false, onCloseFilters }) {
  const [selectedRowKeys, setSelectedRowKeys] = useState(['1', '2']);
  const [columnMenuOpen, setColumnMenuOpen] = useState(false);
  const [visibleColumnKeys, setVisibleColumnKeys] = useState(defaultVisibleColumnKeys);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const columns = useMemo(() => [
    {
      title: 'S.no',
      dataIndex: 'key',
      key: 'serial',
      width: 70,
      sorter: (a, b) => Number(a.key) - Number(b.key),
    },
    {
      title: 'ID',
      dataIndex: 'code',
      key: 'code',
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: 'Personality Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name, record) => (
        <Space align="start" size={8} className="job-title-cell">
          <Space direction="vertical" size={2}>
            <RouterLink className="job-cell-link" to={`/Venkatesh-detailview/${record.key}`}>
              {name}
            </RouterLink>
            <Text type="secondary" className="job-cell-secondary">{record.role}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: 'Contact',
      dataIndex: 'email',
      key: 'contact',
      sorter: (a, b) => a.email.localeCompare(b.email),
      render: (email, record) => (
        <Space direction="vertical" size={2}>
          <Text className="job-cell-primary">{email}</Text>
          <Text type="secondary" className="job-cell-secondary">{record.phone}</Text>
        </Space>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      sorter: (a, b) => a.location.localeCompare(b.location),
      render: (location, record) => (
        <Space direction="vertical" size={2}>
          <Text className="job-cell-primary">{location}</Text>
          <Text type="secondary" className="job-cell-secondary">{record.department}</Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => <Tag color={PERSONALITY_STATUS_COLORS[status]}>{status}</Tag>,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      sorter: (a, b) => a.priority.localeCompare(b.priority),
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      sorter: (a, b) => a.assignedTo.localeCompare(b.assignedTo),
    },
    {
      title: 'Completion',
      dataIndex: 'completion',
      key: 'completion',
      sorter: (a, b) => Number(a.completion.replace('%', '')) - Number(b.completion.replace('%', '')),
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      sorter: (a, b) => new Date(a.lastUpdated) - new Date(b.lastUpdated),
    },
  ], []);

  const visibleColumns = useMemo(
    () => columns.filter((column) => visibleColumnKeys.includes(column.key)),
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

  return (
    <div className="antd">
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
        className="job-list-table"
        rowSelection={rowSelection}
        columns={visibleColumns}
        dataSource={PERSONALITIES}
        size="middle"
        showSorterTooltip={false}
        tableLayout="fixed"
        pagination={false}
        scroll={{ x: '100%' }}
      />

      <CustomPagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={PERSONALITIES.length}
        onChange={(page) =>
          setPagination((current) => ({
            ...current,
            current: page,
          }))
        }
        onPageSizeChange={(pageSize) =>
          setPagination({
            current: 1,
            pageSize,
          })
        }
      />

      <JobFilters
        open={filtersOpen}
        onClose={onCloseFilters}
        onApply={onCloseFilters}
      />
    </div>
  );
}
