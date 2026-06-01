import { useState, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Table, Input, Button, Space, Typography, Tooltip, Dropdown, Tabs, Badge, Card, Flex, Checkbox,
} from 'antd';
import {
  FilterOutlined, PlusOutlined, DownOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import StatusBadge from './StatusBadge';
import AssigneeAvatars from './AssigneeAvatars';
import CustomPagination from './CustomPagination';
import JobFilters from './filters';
import { SRIDHAR_JOB_LIST_SUMMARY, SRIDHAR_MOCK_JOBS } from '../data/jobs';
import eyeOutlinedIcon from './images/common/eyeoutlined.svg';
import frameIcon from './images/common/frame.svg';
import unorderedListOutlinedIcon from './images/common/unorderedlistoutlined.svg';

const { Text } = Typography;
const ASSIGNEE_COLORS = ['#e6f0ff', '#f3e8ff', '#dbeafe', '#ecfdf5', '#fef3c7'];

function titleCase(value) {
  if (!value) return '';
  return String(value)
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getRecordKey(record, index = 0) {
  return record.key ?? record._id ?? record.id ?? record.clientJobReferenceId ?? index;
}

function compareField(a, b, field) {
  return getComparableValue(a, field).localeCompare(getComparableValue(b, field), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

function formatRemoteStatus(record) {
  const remoteStatus = record.jobRemoteStatus ?? record.locationType;
  if (Array.isArray(remoteStatus)) {
    return remoteStatus.map(titleCase).join(', ');
  }
  return titleCase(remoteStatus);
}

function formatEmploymentType(record) {
  return titleCase(record.employmentType);
}

function formatExperience(record) {
  if (typeof record.experience === 'string') return record.experience;

  const { from, to, unit } = record.experience ?? {};
  const normalizedUnit = unit || 'yrs';

  if (from && to) return `${from} - ${to} ${normalizedUnit}`;
  if (from) return `${from} ${normalizedUnit}`;
  if (to) return `${to} ${normalizedUnit}`;

  return '-';
}

function formatClientRate(record) {
  if (record.clientRate !== undefined && record.clientRate !== null) {
    return String(record.clientRate).startsWith('$') ? record.clientRate : `$${record.clientRate}`;
  }

  const payDetails = record.jobPayDetails ?? {};
  const start = payDetails.clientBudgetStart;
  const end = payDetails.clientBudgetEnd;
  const symbol = payDetails.clientBudgetCurrencySymbol || '';
  const unitLabel = String(payDetails.clientBudgetUnit || '').toLowerCase() === 'hour'
    ? 'hr'
    : payDetails.clientBudgetUnit;
  const unit = unitLabel ? `/${unitLabel}` : '';

  if (start && end) return `${symbol}${start} - ${end}${unit}`;
  if (start) return `${symbol}${start}${unit}`;
  if (end) return `${symbol}${end}${unit}`;

  return '-';
}

function getPipeline(record) {
  return record.pipeline ?? record.hiringProgress?.pipeline ?? '-';
}

function getStatus(record) {
  const status = record.status ?? record.jobStatus ?? record.recruitmentStatus;
  if (String(status).toLowerCase() === 'active') return 'Open';
  if (String(status).toLowerCase() === 'inactive') return 'Closed';
  return titleCase(status) || '-';
}

function getPriority(record) {
  return titleCase(record.priority) || '-';
}

function getClientLabel(record) {
  const clientName = record.client ?? record.clientInfo?.clientName ?? '-';
  const referenceId = record.clientJobReferenceId ?? record.mspreqId ?? record.clientInfo?.clientReferenceId;
  return referenceId ? `${clientName} - ${referenceId}` : clientName;
}

function getNestedValue(record, field) {
  if (!field) return undefined;
  return String(field)
    .split('.')
    .reduce((value, key) => value?.[key], record);
}

function formatOwner(record) {
  const owner = record.jobOwnerName ?? record.ownerName ?? record.jobOwnerId;
  if (owner) return owner;

  const recruiterNames = record.recruiterData
    ?.map((recruiter) => recruiter.recruiterName)
    .filter(Boolean);

  return recruiterNames?.length ? recruiterNames.join(', ') : '-';
}

function getInitials(name) {
  const words = String(name || '').match(/[A-Za-z0-9]+/g) ?? [];
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words.slice(0, 2).map((word) => word[0]).join('').toUpperCase();
}

function getAssignees(record) {
  const recruiters = Array.isArray(record.recruiterData) ? record.recruiterData : [];
  return recruiters.map((recruiter, index) => ({
    initials: getInitials(recruiter.recruiterName ?? recruiter.recruiterEmail ?? recruiter.recruiterId),
    color: ASSIGNEE_COLORS[index % ASSIGNEE_COLORS.length],
  }));
}

function formatCellValue(value) {
  if (value === null || value === undefined || value === '') return '-';
  if (Array.isArray(value)) return value.length ? value.map(formatCellValue).join(', ') : '-';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function getComparableValue(record, field) {
  const value = getFieldValue(record, field);

  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'object') {
    return Object.values(value).join(' ');
  }

  return String(value);
}

function getFieldValue(record, field) {
  switch (field) {
    case 'jobTitle':
    case 'jobs':
      return `${record.jobTitle ?? record.title ?? ''} ${getClientLabel(record)}`;
    case 'jobLocation':
    case 'location':
      return `${record.jobLocation ?? record.location ?? ''} ${formatRemoteStatus(record)}`;
    case 'experience':
      return `${formatExperience(record)} ${formatEmploymentType(record)}`;
    case 'clientRate':
      return formatClientRate(record);
    case 'status':
      return getStatus(record);
    case 'priority':
      return getPriority(record);
    case 'pipeline':
      return getPipeline(record);
    case 'jobOwnerId':
      return formatOwner(record);
    case 'numberOfPosition':
      return record.targetSubmission?? record.targetSubmission ?? '-';
    default:
      return getNestedValue(record, field);
  }
}

const actionsMenu = {
  items: [
    { key: 'export', label: 'Export selected' },
    { key: 'assign', label: 'Assign' },
    { key: 'delete', label: 'Delete', danger: true },
  ],
};

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
  tabs,
  activeTab: controlledActiveTab,
  current,
  pageSize,
  total,
  onTabChange,
  onPageChange,
  onPageSizeChange,
}) {
  const myJobsCount = summary.myJobsCount ?? jobs.length;
  const allJobsCount = summary.allJobsCount ?? jobs.length;
  const defaultSelectedRowKeys = initialSelectedRowKeys
    ?? jobs.slice(0, 2).map(getRecordKey);
  const [activeTab, setActiveTab] = useState('1');
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [appliedFilterRows, setAppliedFilterRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState(defaultSelectedRowKeys);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 7 });
  const tableActiveTab = controlledActiveTab ?? activeTab;
  const tableCurrent = current ?? pagination.current;
  const tablePageSize = pageSize ?? pagination.pageSize;
  const hasServerPagination = Boolean(onPageChange || onPageSizeChange || total !== undefined);
  const columnOptions = useMemo(() => {
    if (!dropdownFields || dropdownFields.length === 0) return [];
    return dropdownFields.map(f => ({ key: f.value, label: f.label }));
  }, [dropdownFields]);

  const defaultVisibleColumnKeys = useMemo(() => {
    return columnOptions.map(({ key }) => key);
  }, [columnOptions]);

  const [visibleColumnKeys, setVisibleColumnKeys] = useState(null);
  const [columnMenuOpen, setColumnMenuOpen] = useState(false);
  const currentVisibleColumnKeys = visibleColumnKeys ?? defaultVisibleColumnKeys;

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
        (job) => dropdownFields.some((field) => getComparableValue(job, field.value).toLowerCase().includes(q))
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
  }, [appliedFilterRows, dropdownFields, jobs, search]);

  const pagedData = useMemo(() => {
    if (hasServerPagination) return filtered;

    const start = (pagination.current - 1) * pagination.pageSize;
    return filtered.slice(start, start + pagination.pageSize);
  }, [filtered, hasServerPagination, pagination]);

  const columns = useMemo(() => {
    if (!dropdownFields || dropdownFields.length === 0) return [];
    return dropdownFields.map(field => {
      const baseColumn = {
        title: field.label,
        dataIndex: field.value,
        key: field.value,
        visibilityKey: field.value,
        width: 200,
        sorter: (a, b) => compareField(a, b, field.value),
      };

      switch (field.value) {
        case 'createdAt':
          return {
            ...baseColumn,
            render: (_, record) => (
              <Space direction="vertical" size={2}>
                <Text className="job-cell-primary">{record.createdAt ?? '-'}</Text>
                {record.createdAgo && (
                  <Text type="secondary" className="job-cell-secondary">{record.createdAgo}</Text>
                )}
              </Space>
            ),
          };

        case 'jobTitle':
        case 'jobs':
          return {
            ...baseColumn,
            width: 240,
            render: (_, record) => (
              <Space direction="vertical" size={2}>
                <RouterLink className="job-cell-link" to={`/sri-detailview/${record._id ?? record.id ?? record.key}`}>
                  {record.jobTitle ?? record.title ?? '-'}
                </RouterLink>
                <Text type="secondary" className="job-cell-secondary">{getClientLabel(record)}</Text>
              </Space>
            ),
          };

        case 'jobLocation':
        case 'location':
          return {
            ...baseColumn,
            render: (_, record) => (
              <Space direction="vertical" size={2}>
                <Text className="job-cell-primary">{record.jobLocation ?? record.location ?? '-'}</Text>
                <Text type="secondary" className="job-cell-secondary">{formatRemoteStatus(record) || '-'}</Text>
              </Space>
            ),
          };

        case 'experience':
          return {
            ...baseColumn,
            render: (_, record) => (
              <Space direction="vertical" size={2}>
                <Text className="job-cell-primary">{formatExperience(record)}</Text>
                <Text type="secondary" className="job-cell-secondary">{formatEmploymentType(record) || '-'}</Text>
              </Space>
            ),
          };

        case 'clientRate':
          return {
            ...baseColumn,
            render: (_, record) => <Text className="job-cell-primary">{formatClientRate(record)}</Text>,
          };

        case 'status':
          return {
            ...baseColumn,
            render: (_, record) => <StatusBadge status={getStatus(record)} />,
          };

        case 'priority':
          return {
            ...baseColumn,
            render: (_, record) => <Text className="job-cell-primary">{getPriority(record)}</Text>,
          };

        case 'jobOwnerId':
          return {
            ...baseColumn,
            render: (_, record) => {
              const assignees = getAssignees(record);

              return assignees.length > 0
                ? <AssigneeAvatars assignees={assignees.slice(0, 3)} extraAssignees={Math.max(0, assignees.length - 3)} />
                : <Text className="job-cell-primary">{formatOwner(record)}</Text>;
            },
          };

        case 'numberOfPosition':
          return {
            ...baseColumn,
            render: (_, record) => (
              <Text className="job-cell-primary">
                {record.targetSubmission ?? record.targetSubmissions ?? '-'}
              </Text>
            ),
          };

        case 'pipeline':
          return {
            ...baseColumn,
            render: (_, record) => <Text className="job-cell-primary">{getPipeline(record)}</Text>,
          };

        default:
          return {
            ...baseColumn,
            render: (_, record) => (
              <Text className="job-cell-primary">{formatCellValue(getFieldValue(record, field.value))}</Text>
            )
          };
      }
    });
  }, [dropdownFields]);

  const visibleColumns = useMemo(
    () => columns.filter((column) => currentVisibleColumnKeys.includes(column.visibilityKey || column.key)),
    [columns, currentVisibleColumnKeys],
  );

  const tableColumns = useMemo(() => [
    {
      dataIndex: 'rowFrameAction',
      key: 'rowFrameAction',
      width: 36,
      render: () => (
        <Tooltip title="Actions">
          <img src={frameIcon} alt="Actions" className="job-actions-frame-icon" />
        </Tooltip>
      ),
    },
    {
      dataIndex: 'rowPreviewAction',
      key: 'rowPreviewAction',
      width: 36,
      render: () => (
        <Tooltip title="Preview">
          <img src={eyeOutlinedIcon} alt="Preview" className="job-row-eye-icon" />
        </Tooltip>
      ),
    },
    ...visibleColumns,
  ], [visibleColumns]);

  const allColumnsVisible = currentVisibleColumnKeys.length === defaultVisibleColumnKeys.length;
  const someColumnsVisible = currentVisibleColumnKeys.length > 0 && !allColumnsVisible;

  const toggleColumn = (key, checked) => {
    setVisibleColumnKeys((current) => {
      const currentKeys = current ?? defaultVisibleColumnKeys;

      if (checked) {
        return currentKeys.includes(key) ? currentKeys : [...currentKeys, key];
      }

      return currentKeys.filter((columnKey) => columnKey !== key);
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
          checked={currentVisibleColumnKeys.includes(column.key)}
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

  const tabItems = tabs?.length
    ? tabs.map((tab) => ({ key: String(tab.key), label: tabLabel(tab.title, tab.count) }))
    : [
      { key: '1', label: tabLabel('My Jobs', myJobsCount) },
      { key: '4', label: tabLabel('All Jobs', allJobsCount) },
    ];

  return (
    <div className="antd">

      {/* Top toolbar */}
      <Card>
        <Flex align="center" justify="space-between">
          <Tabs
            activeKey={tableActiveTab}
            items={tabItems}
            onChange={(key) => {
              if (onTabChange) {
                onTabChange(key);
              } else {
                setActiveTab(key);
                setPagination({ ...pagination, current: 1 });
              }
            }}
          />
          <Flex align="center" gap={8}>
            <Input
              prefix={<SearchOutlined className="job-search-icon" />}
              placeholder="Min 3 Chars to search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (!hasServerPagination) setPagination({ ...pagination, current: 1 });
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
        columns={tableColumns}
        dataSource={pagedData}
        rowKey={getRecordKey}
        size="middle"
        scroll={{ x: '100%' }}
        showSorterTooltip={false}
        tableLayout="fixed"
        pagination={false}
        className="job-list-table"
      />

      {/* Pagination */}
      <CustomPagination
        current={tableCurrent}
        pageSize={tablePageSize}
        total={total ?? filtered.length}
        onChange={(page) => {
          if (onPageChange) {
            onPageChange(page);
          } else {
            setPagination(p => ({ ...p, current: page }));
          }
        }}
        onPageSizeChange={(size) => {
          if (onPageSizeChange) {
            onPageSizeChange(size);
          } else {
            setPagination({ current: 1, pageSize: size });
          }
        }}
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
