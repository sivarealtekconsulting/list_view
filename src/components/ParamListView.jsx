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

const { Text } = Typography;

const actionsMenu = {
  items: [
    { key: 'export', label: 'Export selected' },
    { key: 'assign', label: 'Assign' },
    { key: 'delete', label: 'Delete', danger: true },
  ],
};

function getFieldLabel(field) {
  return field.label ?? field.fieldLabel ?? field.name ?? field.fieldName ?? field.value;
}

function getFieldValue(field) {
  return field.value ?? field.fieldName ?? field.name ?? field.label;
}

function getRecordValue(record, fieldKey) {
  const value = record?.[fieldKey];

  if (value === null || value === undefined) return '-';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return Object.values(value).join(' ');

  return value;
}

function tabLabel(label, count) {
  return (
    <Space size={6}>
      <span>{label}</span>
      <Badge count={count} overflowCount={9999} />
    </Space>
  );
}

export default function ParamListView({ listName = 'List', fields = [], dataSource = [] }) {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 7 });
  const [visibleColumnKeys, setVisibleColumnKeys] = useState([]);
  const [columnMenuOpen, setColumnMenuOpen] = useState(false);

  const normalizedFields = useMemo(() => (
    fields
      .map((field) => ({
        key: getFieldValue(field),
        label: getFieldLabel(field),
      }))
      .filter((field) => field.key && field.label)
  ), [fields]);

  const visibleKeys = visibleColumnKeys.length
    ? visibleColumnKeys
    : normalizedFields.map((field) => field.key);

  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    if (!q || q.length < 3) return dataSource;

    return dataSource.filter((record) => (
      normalizedFields.some((field) => (
        String(getRecordValue(record, field.key)).toLowerCase().includes(q)
      ))
    ));
  }, [dataSource, normalizedFields, search]);

  const pagedData = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    return filteredData.slice(start, start + pagination.pageSize);
  }, [filteredData, pagination]);

  const columns = useMemo(() => (
    normalizedFields
      .filter((field) => visibleKeys.includes(field.key))
      .map((field) => ({
        title: field.label,
        dataIndex: field.key,
        key: field.key,
        sorter: (a, b) => String(getRecordValue(a, field.key)).localeCompare(String(getRecordValue(b, field.key))),
        width: 180,
        ellipsis: true,
        render: (_, record) => (
          <Text className="job-cell-primary">{getRecordValue(record, field.key)}</Text>
        ),
      }))
  ), [normalizedFields, visibleKeys]);

  const allColumnsVisible = visibleKeys.length === normalizedFields.length;
  const someColumnsVisible = visibleKeys.length > 0 && !allColumnsVisible;

  const toggleColumn = (key, checked) => {
    setVisibleColumnKeys((current) => {
      const currentKeys = current.length ? current : normalizedFields.map((field) => field.key);
      if (checked) return currentKeys.includes(key) ? currentKeys : [...currentKeys, key];
      return currentKeys.filter((columnKey) => columnKey !== key);
    });
  };

  const columnVisibilityContent = (
    <div className="column-visibility-menu" onClick={(event) => event.stopPropagation()}>
      <Checkbox
        checked={allColumnsVisible}
        indeterminate={someColumnsVisible}
        onChange={(event) => {
          setVisibleColumnKeys(event.target.checked ? normalizedFields.map((field) => field.key) : []);
        }}
      >
        Select All
      </Checkbox>
      {normalizedFields.map((field) => (
        <Checkbox
          key={field.key}
          checked={visibleKeys.includes(field.key)}
          onChange={(event) => toggleColumn(field.key, event.target.checked)}
        >
          {field.label}
        </Checkbox>
      ))}
    </div>
  );

  return (
    <div className="antd dynamic-list-view">
      <Card>
        <Flex align="center" justify="space-between">
          <Tabs
            activeKey={activeTab}
            items={[{ key: 'all', label: tabLabel(listName, filteredData.length) }]}
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
        columns={columns}
        dataSource={pagedData}
        size="middle"
        scroll={{ x: 'max-content' }}
        showSorterTooltip={false}
        tableLayout="auto"
        pagination={false}
        className="job-list-table"
        rowKey={(record, index) => record.id ?? record.key ?? index}
      />

      <CustomPagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={filteredData.length}
        onChange={(page) => setPagination((current) => ({ ...current, current: page }))}
        onPageSizeChange={(size) => setPagination({ current: 1, pageSize: size })}
      />
    </div>
  );
}
