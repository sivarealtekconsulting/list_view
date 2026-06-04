import { useEffect, useMemo, useRef, useState } from 'react';
import {
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
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import {
  DownOutlined,
  FilterOutlined,
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
import CustomPagination from '../components/CustomPagination';
import JobFilters from '../components/filters';
import frameIcon from '../components/images/common/frame.svg';
import unorderedListOutlinedIcon from '../components/images/common/unorderedlistoutlined.svg';
import { getCandidate, getHeaderFields } from '../services/dropdownApi';

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

const EMPTY_VALUE = '-';
const HEADER_USER_ID = 2;
const HEADER_ROLE_ID = 5;
const HEADER_MODULE = 'Candidate';

const columnOptions = [
  { key: 'candidate', label: 'Candidates' },
  { key: 'contact', label: 'Contact' },
  { key: 'locationExp', label: 'Location / Exp' },
  { key: 'createdDate', label: 'Created Date' },
  { key: 'skills', label: 'Skills' },
  { key: 'workAuth', label: 'Work Auth' },
  { key: 'source', label: 'Source' },
];

const defaultVisibleColumnKeys = columnOptions.map(({ key }) => key);

const headerFieldColumnMap = {
  firstName: 'candidate',
  middleName: 'candidate',
  lastName: 'candidate',
  fullName: 'candidate',
  name: 'candidate',
  designation: 'candidate',
  email: 'contact',
  contactCountryCode: 'contact',
  contactNumber: 'contact',
  currentLocation: 'locationExp',
  location: 'locationExp',
  yearOfExperience: 'locationExp',
  yearsOfExperience: 'locationExp',
  createdAt: 'createdDate',
  createdDate: 'createdDate',
  skills: 'skills',
  relevantSkills: 'skills',
  workAuthorisation: 'workAuth',
  workAuthorization: 'workAuth',
  source: 'source',
  profileSource: 'source',
};

const actionsMenu = {
  items: [
    { key: 'export', label: 'Export selected' },
    { key: 'assign', label: 'Assign' },
    { key: 'delete', label: 'Delete', danger: true },
  ],
};

function displayValue(value) {
  if (value === null || value === undefined) {
    return EMPTY_VALUE;
  }

  if (typeof value === 'string' && value.trim() === '') {
    return EMPTY_VALUE;
  }

  return value;
}

function getTextValue(value) {
  const displayed = displayValue(value);
  return displayed === EMPTY_VALUE ? '' : String(displayed);
}

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

function getCandidateItems(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.applicant)) return response.applicant;
  if (Array.isArray(response?.data?.items)) return response.data.items;
  if (Array.isArray(response?.data?.applicant)) return response.data.applicant;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.candidates)) return response.candidates;
  return [];
}

function getHeaderFieldItems(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.fields)) return response.fields;
  if (Array.isArray(response?.data?.fields)) return response.data.fields;
  return [];
}

function getHeaderColumnKey(fieldConfig) {
  const field = fieldConfig?.field ?? fieldConfig?.value ?? fieldConfig?.name;
  if (!field) return null;

  const normalizedField = String(field).trim();
  return headerFieldColumnMap[normalizedField]
    ?? headerFieldColumnMap[normalizedField.split('.').at(-1)]
    ?? null;
}

function getVisibleColumnKeysFromHeaderFields(headerFields) {
  const keys = headerFields
    .filter((field) => field?.isVisible === true)
    .map(getHeaderColumnKey)
    .filter(Boolean);

  return [...new Set(keys)];
}

function getCandidateTotal(response, fallbackCount) {
  return response?.totalCount
    ?? response?.data?.totalCount
    ?? response?.count
    ?? response?.data?.count
    ?? fallbackCount;
}

function formatCount(count) {
  return Number(count || 0).toLocaleString('en-US');
}

function formatCandidateDate(value) {
  if (!value) return EMPTY_VALUE;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

function getCandidateName(candidate) {
  const fullName = [
    candidate.firstName,
    candidate.middleName,
    candidate.lastName,
  ].filter(Boolean).join(' ');

  return candidate.name
    ?? candidate.candidateName
    ?? candidate.fullName
    ?? (fullName || undefined)
    ?? EMPTY_VALUE;
}

function cleanApiValue(value) {
  if (value === null || value === undefined) return EMPTY_VALUE;
  if (typeof value === 'string' && value.trim() === '') return EMPTY_VALUE;
  return value;
}

function formatExperience(value) {
  const cleaned = cleanApiValue(value);
  if (cleaned === EMPTY_VALUE) return EMPTY_VALUE;

  const text = String(cleaned);
  return /year/i.test(text) ? text : `${text} Years`;
}

function formatSource(value) {
  const cleaned = cleanApiValue(value);
  if (cleaned === EMPTY_VALUE) return EMPTY_VALUE;

  return String(cleaned)
    .split('_')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function normalizeCandidate(candidate, index) {
  const skills = candidate.skills ?? candidate.skillSet ?? candidate.primarySkills ?? [];
  const normalizedSkills = Array.isArray(skills)
    ? skills.map((skill) => (
      typeof skill === 'string' ? skill : skill.name ?? skill.skillName ?? String(skill)
    ))
    : String(skills).split(',').map((skill) => skill.trim()).filter(Boolean);

  return {
    key: candidate.key ?? candidate.id ?? candidate._id ?? String(index + 1),
    name: getCandidateName(candidate),
    role: cleanApiValue(candidate.role ?? candidate.designation ?? candidate.jobTitle ?? candidate.title),
    email: cleanApiValue(candidate.email ?? candidate.emailId ?? candidate.primaryEmail),
    phone: candidate.phone
      || [candidate.contactCountryCode, candidate.contactNumber].filter(Boolean).join(' ')
      || candidate.mobileNumber
      || candidate.primaryPhone
      || EMPTY_VALUE,
    location: cleanApiValue(candidate.location ?? candidate.currentLocation ?? candidate.city),
    experience: formatExperience(candidate.experience
      ?? candidate.totalExperience
      ?? candidate.yearsOfExperience
      ?? candidate.yearOfExperience),
    createdDate: formatCandidateDate(candidate.createdDate ?? candidate.createdAt ?? candidate.createdOn),
    skills: normalizedSkills,
    skillsExtra: candidate.skillsExtra ?? candidate.extraSkillsCount ?? 0,
    workAuth: cleanApiValue(candidate.workAuth
      ?? candidate.workAuthorization
      ?? candidate.workAuthorisation
      ?? candidate.visaStatus),
    source: formatSource(candidate.source ?? candidate.candidateSource ?? candidate.createdSource),
  };
}

function VenkateshListView() {
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [candidateHeaderFields, setCandidateHeaderFields] = useState(null);
  const [candidateRows, setCandidateRows] = useState([]);
  const [candidateTotal, setCandidateTotal] = useState(0);
  const hasFetchedCandidateHeaderFields = useRef(false);
  const [appliedFilterRows, setAppliedFilterRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [visibleColumnKeys, setVisibleColumnKeys] = useState(null);
  const [columnMenuOpen, setColumnMenuOpen] = useState(false);
  const { current, pageSize } = pagination;

  useEffect(() => {
    let cancelled = false;

    async function fetchCandidateHeaderFields() {
      try {
        const fields = await getHeaderFields(HEADER_USER_ID, HEADER_ROLE_ID, HEADER_MODULE);

        if (!cancelled) {
          setCandidateHeaderFields(getHeaderFieldItems(fields));
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Error fetching Candidate header fields:', error);
        }
      }
    }

    async function fetchCandidateList() {
      try {
        const offset = (current - 1) * pageSize;
        const response = await getCandidate({
          offset,
          limit: pageSize,
          sortBy: 'createdAt',
        });
        const candidates = getCandidateItems(response).map(normalizeCandidate);
        const total = getCandidateTotal(response, candidates.length);

        if (!cancelled) {
          setCandidateRows(candidates);
          setCandidateTotal(total);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Error fetching Candidate list:', error);
          setCandidateRows([]);
          setCandidateTotal(0);
        }
      }
    }

    if (!hasFetchedCandidateHeaderFields.current) {
      hasFetchedCandidateHeaderFields.current = true;
      fetchCandidateHeaderFields();
    }

    fetchCandidateList();

    return () => {
      cancelled = true;
    };
  }, [current, pageSize]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const searchableCandidates = !q || q.length < 3
      ? candidateRows
      : candidateRows.filter(
        (candidate) => (
          getTextValue(candidate.name).toLowerCase().includes(q)
          || getTextValue(candidate.email).toLowerCase().includes(q)
          || getTextValue(candidate.phone).toLowerCase().includes(q)
          || getTextValue(candidate.location).toLowerCase().includes(q)
          || getTextValue(candidate.source).toLowerCase().includes(q)
          || candidate.skills.some((skill) => skill.toLowerCase().includes(q))
        ),
      );

    const validFilterRows = appliedFilterRows.filter((row) => row.field);

    if (!validFilterRows.length) {
      return searchableCandidates;
    }

    return searchableCandidates.filter((candidate) => (
      validFilterRows.reduce((matches, row, index) => {
        const rowMatches = filterMatches(candidate, row);

        if (index === 0 || row.operator === 'and') {
          return matches && rowMatches;
        }

        if (row.operator === 'or') {
          return matches || rowMatches;
        }

        return matches && rowMatches;
      }, true)
    ));
  }, [appliedFilterRows, candidateRows, search]);

  const hasLocalFilters = search.length >= 3 || appliedFilterRows.some((row) => row.field);

  const pagedData = useMemo(() => {
    if (!hasLocalFilters && candidateTotal > candidateRows.length) {
      return filtered;
    }

    const start = (current - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [candidateRows.length, candidateTotal, current, filtered, hasLocalFilters, pageSize]);

  const columns = useMemo(() => [
    {
      title: 'Candidates',
      dataIndex: 'name',
      key: 'candidate',
      sorter: (a, b) => getTextValue(a.name).localeCompare(getTextValue(b.name)),
      render: (name, record) => (
        <Space direction="vertical" size={2}>
          <Text className="job-cell-link">{displayValue(name)}</Text>
          <Text type="secondary" className="job-cell-primary">
            {displayValue(record.role)}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Contact',
      dataIndex: 'email',
      key: 'contact',
      sorter: (a, b) => getTextValue(a.email).localeCompare(getTextValue(b.email)),
      render: (email, record) => (
        <Space direction="vertical" size={2}>
          <Text className="job-cell-link">{displayValue(email)}</Text>
          <Text className="job-cell-link">{displayValue(record.phone)}</Text>
        </Space>
      ),
    },
    {
      title: 'Location / Exp',
      dataIndex: 'location',
      key: 'locationExp',
      sorter: (a, b) => getTextValue(a.location).localeCompare(getTextValue(b.location)),
      render: (location, record) => (
        <Space direction="vertical" size={2}>
          <Text className="job-cell-primary">{displayValue(location)}</Text>
          <Text type="secondary" className="job-cell-secondary">
            {displayValue(record.experience)}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      sorter: (a, b) => new Date(getTextValue(a.createdDate)) - new Date(getTextValue(b.createdDate)),
      render: (date) => <Text type="secondary" className="job-cell-secondary">{displayValue(date)}</Text>,
    },
    {
      title: 'Skills',
      dataIndex: 'skills',
      key: 'skills',
      sorter: (a, b) => getTextValue(a.skills).localeCompare(getTextValue(b.skills)),
      render: (skills = [], record) => {
        const visibleSkills = skills.slice(0, 2);
        const extraSkillsCount = Math.max(
          skills.length - visibleSkills.length,
          Number(record.skillsExtra) || 0,
        );

        if (!visibleSkills.length) {
          return <Text>{EMPTY_VALUE}</Text>;
        }

        return (
          <Space size={[2, 2]} wrap>
            {visibleSkills.map((skill) => (
              <Tag key={skill} color="default">
                {skill}
              </Tag>
            ))}
            {extraSkillsCount > 0 && (
              <Text className="job-cell-link">
                +{extraSkillsCount}
              </Text>
            )}
          </Space>
        );
      },
    },
    {
      title: 'Work Auth',
      dataIndex: 'workAuth',
      key: 'workAuth',
      sorter: (a, b) => getTextValue(a.workAuth).localeCompare(getTextValue(b.workAuth)),
      render: (workAuth) => <Text type="secondary" className="job-cell-secondary">{displayValue(workAuth)}</Text>,
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      sorter: (a, b) => getTextValue(a.source).localeCompare(getTextValue(b.source)),
      render: (source) => <Text type="secondary" className="job-cell-secondary">{displayValue(source)}</Text>,
    },
  ], []);

  const apiVisibleColumnKeys = useMemo(() => {
    if (!candidateHeaderFields) {
      return defaultVisibleColumnKeys;
    }

    return getVisibleColumnKeysFromHeaderFields(candidateHeaderFields);
  }, [candidateHeaderFields]);

  const availableColumnOptions = useMemo(
    () => columnOptions.filter((column) => apiVisibleColumnKeys.includes(column.key)),
    [apiVisibleColumnKeys],
  );

  const currentVisibleColumnKeys = visibleColumnKeys ?? apiVisibleColumnKeys;

  const visibleColumns = useMemo(
    () => columns.filter((column) => currentVisibleColumnKeys.includes(column.visibilityKey || column.key)),
    [columns, currentVisibleColumnKeys],
  );

  const allColumnsVisible = currentVisibleColumnKeys.length === apiVisibleColumnKeys.length;
  const someColumnsVisible = currentVisibleColumnKeys.length > 0 && !allColumnsVisible;

  const toggleColumn = (key, checked) => {
    setVisibleColumnKeys((current) => {
      const currentKeys = current ?? apiVisibleColumnKeys;

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
          setVisibleColumnKeys(event.target.checked ? apiVisibleColumnKeys : []);
        }}
      >
        Select All
      </Checkbox>
      {availableColumnOptions.map((column) => (
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

  return (
    <div className="antd">
      <Card>
        <Flex align="center" justify="space-between">
          <Text strong>All Candidate ({formatCount(candidateTotal)})</Text>
          <Flex align="center" gap={8}>
            <Input
              prefix={<SearchOutlined className="job-search-icon" />}
              placeholder="Search by candidate, source, job title, location..."
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
        // scroll={{ x: 1280 }}
        showSorterTooltip={false}
        tableLayout="fixed"
        pagination={false}
        className="job-list-table"
      />

      <CustomPagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={hasLocalFilters ? filtered.length : candidateTotal}
        onChange={(page) => setPagination((current) => ({ ...current, current: page }))}
        onPageSizeChange={(size) => setPagination({ current: 1, pageSize: size })}
      />

      <JobFilters
        moduleName="Candidate"
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
                  <Text strong>Candidate List</Text>
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
