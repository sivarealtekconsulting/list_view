import { useState, useMemo, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Table, Input, Button, Space, Typography, Tooltip, Dropdown, Tabs, Badge, Card, Flex, Checkbox,
} from 'antd';
import {
  BookFilled, LinkedinFilled,
  FilterOutlined, PlusOutlined, DownOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import AssigneeAvatars from './AssigneeAvatars';
import CustomPagination from './CustomPagination';
import JobFilters from './filters';
import { SRIDHAR_JOB_LIST_SUMMARY, SRIDHAR_MOCK_JOBS } from '../data/jobs';
import eyeOutlinedIcon from './images/common/eyeoutlined.svg';
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

export default function ListView({
  jobs = SRIDHAR_MOCK_JOBS,
  dropdownFields = [],
  summary = SRIDHAR_JOB_LIST_SUMMARY,
  initialSelectedRowKeys,
}) {
  const navigate = useNavigate();
  const myJobsCount = summary.myJobsCount ?? jobs.length;
  const allJobsCount = summary.allJobsCount ?? jobs.length;
  const defaultSelectedRowKeys = initialSelectedRowKeys
    ?? jobs.slice(0, 2).map((job) => job.key);
  const [activeTab, setActiveTab] = useState('my');
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [appliedFilterRows, setAppliedFilterRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState(defaultSelectedRowKeys);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 7 });
  const columnOptions = useMemo(() => {
    if (!dropdownFields || dropdownFields.length === 0) return [];
    return dropdownFields.map(f => ({ key: f.value, label: f.label }));
  }, [dropdownFields]);

  const defaultVisibleColumnKeys = useMemo(() => {
    return columnOptions.map(({ key }) => key);
  }, [columnOptions]);

  const [visibleColumnKeys, setVisibleColumnKeys] = useState([]);
  const [columnMenuOpen, setColumnMenuOpen] = useState(false);

  useEffect(() => {
    if (visibleColumnKeys.length === 0 && defaultVisibleColumnKeys.length > 0) {
      setVisibleColumnKeys(defaultVisibleColumnKeys);
    }
  }, [defaultVisibleColumnKeys, visibleColumnKeys.length]);

  // const valueOptionsByField = useMemo(() => {
  //   const fields = [
  //     'title',
  //     'client',
  //     'location',
  //     'locationType',
  //     'experience',
  //     'employmentType',
  //     'clientRate',
  //     'status',
  //     'createdAt',
  //   ];

  //   return fields.reduce((options, field) => {
  //     const uniqueValues = [...new Set(jobs.map((job) => getComparableValue(job, field)).filter(Boolean))];

  //     return {
  //       ...options,
  //       [field]: uniqueValues.map((value) => ({ label: value, value })),
  //     };
  //   }, {});
  // }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const searchableJobs = !q || q.length < 3
      ? jobs
      : jobs.filter(
        (j) => Object.values(j).some(val => 
            val && typeof val === 'string' && val.toLowerCase().includes(q)
        )
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
  }, [appliedFilterRows, jobs, search]);

  const pagedData = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    return filtered.slice(start, start + pagination.pageSize);
  }, [filtered, pagination]);

  const columns = useMemo(() => {
    if (!dropdownFields || dropdownFields.length === 0) return [];
    return dropdownFields.map(field => {
      const dataIndex = field.value.includes('.') ? field.value.split('.') : field.value;
      return {
        title: field.label,
        dataIndex: dataIndex,
        key: field.value,
        visibilityKey: field.value,
        width: 200,
        render: (val) => {
          if (typeof val === 'object' && val !== null) {
            return <Text className="job-cell-primary">{JSON.stringify(val)}</Text>;
          }
          return <Text className="job-cell-primary">{val !== undefined && val !== null ? String(val) : '-'}</Text>;
        }
      };
    });
  }, [dropdownFields]);

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
    { key: 'my', label: tabLabel('My Jobs', myJobsCount) },
    { key: 'all', label: tabLabel('All Jobs', allJobsCount) },
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
              <Button
                className="job-toolbar-icon-button"
                icon={<FilterOutlined />}
                onClick={() => setFiltersOpen(true)}
              />
            </Tooltip>
            <Tooltip title="Add">
              <a href='/add'>
                <Button className="job-toolbar-icon-button" icon={<PlusOutlined />} />
              </a>
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

      <JobFilters
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        // valueOptionsByField={valueOptionsByField}
        onApply={({ filters }) => {
          setAppliedFilterRows(filters);
          setPagination((current) => ({ ...current, current: 1 }));
        }}
      />

    </div>
  );
}
