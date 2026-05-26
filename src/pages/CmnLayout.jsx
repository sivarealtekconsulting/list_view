import {
    Table, Input, Button, Space, Typography, Tooltip, Dropdown, Tabs, Badge, Card, Flex, Checkbox,
    Row,
    Col,
    Statistic,
    Form,
} from 'antd';
import React, { useMemo, useState } from "react"
import CalendarCard from "../components/cards/CalendarCard";
import { MOCK_JOBS } from '../data/jobs';
import {
    BookFilled, LinkedinFilled,
    FilterOutlined, PlusOutlined, DownOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import eyeOutlinedIcon from '../components/images/common/eyeoutlined.svg';
import { Link } from "react-router-dom";
import StatusBadge from '../components/StatusBadge';
import AssigneeAvatars from '../components/AssigneeAvatars';
import { validationRules } from '../components/form/validation';
import JobFilters from '../components/filters';

const { Text } = Typography;
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
const MY_JOBS_COUNT = 6;
const ALL_JOBS_COUNT = 2456;
export default function CmnLayout() {

    const [activeTab, setActiveTab] = useState('my');
    const [search, setSearch] = useState('');
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [appliedFilterRows, setAppliedFilterRows] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 7 });
    const [visibleColumnKeys, setVisibleColumnKeys] = useState(defaultVisibleColumnKeys);
    const [columnMenuOpen, setColumnMenuOpen] = useState(false);

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
    //     const uniqueValues = [...new Set(MOCK_JOBS.map((job) => getComparableValue(job, field)).filter(Boolean))];

    //     return {
    //       ...options,
    //       [field]: uniqueValues.map((value) => ({ label: value, value })),
    //     };
    //   }, {});
    // }, []);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        const searchableJobs = !q || q.length < 3
            ? MOCK_JOBS
            : MOCK_JOBS.filter(
                (j) =>
                    j.title.toLowerCase().includes(q) ||
                    j.location.toLowerCase().includes(q) ||
                    j.status.toLowerCase().includes(q),
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
        {
            title: 'Jobs Title',
            dataIndex: 'title',
            key: 'title',
            visibilityKey: 'jobsGroup',
            sorter: (a, b) => a.title.localeCompare(b.title),
            width: 190,
            render: (title, record) => (
                <Space align="start" size={6} className="job-title-cell">
                    <Space direction="vertical" size={2}>
                        <Link className="job-cell-link">{title}</Link>
                        {/* <Text type="secondary" className="job-cell-secondary">{record.client}</Text> */}
                    </Space>
                </Space>
            ),
        },
        {
            title: 'Job Location',
            dataIndex: 'location',
            key: 'location',
            sorter: (a, b) => a.location.localeCompare(b.location),
            width: '100%',
            render: (loc, record) => (
                <Space direction="vertical" size={2}>
                    <Text className="job-cell-primary">{loc}</Text>
                </Space>
            ),
        },
        {
            title: 'Client',
            dataIndex: 'experience',
            key: 'experience',
            sorter: (a, b) => a.experience.localeCompare(b.experience),
            width: '100%',
            render: (exp, record) => (
                <Space direction="vertical" size={2}>
                    <Text className="job-cell-primary">{record.client}</Text>
                </Space>
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
        }

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
    const stats = [
        { label: 'Total Jobs', value: 1697 },
        { label: 'Active Jobs', value: 1685 },
        { label: 'My Jobs', value: 600 },
    ];
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log("Form Values:", values);
    };
    return (
        <>
            <Card>
                <Row gutter={[12, 12]}>
                    {stats.map(s => (
                        <Col key={s.label} xs={24} sm={24} md={8} lg={8} xl={8}>
                            <Card className="stats-inner-card">
                                <Space align="center">
                                    <Text>{s.label}</Text>
                                </Space>
                                <Statistic value={s.value} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Card>
            <div>
                <Card>
                    <Row>
                        <Col lg={12}>
                            <CalendarCard />
                        </Col>
                        <Col lg={12}>
                            <Card className="">
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={onFinish}
                                    autoComplete="off"
                                >
                                    <Row gutter={16}>
                                        {/* EMAIL */}
                                        <Col span={12}>
                                            <Form.Item
                                                label="Email"
                                                name="email"
                                                rules={[
                                                    validationRules.required("Email"),
                                                    validationRules.email(),
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>

                                        {/* PHONE */}
                                        <Col span={12}>
                                            <Form.Item
                                                label="Phone Number"
                                                name="phone"
                                                rules={[
                                                    validationRules.required("Phone Number"),
                                                    validationRules.phone(),
                                                ]}
                                                validateTrigger={["onBlur", "onChange"]}
                                            >
                                                <Input
                                                    maxLength={10}
                                                    onChange={(e) => {
                                                        form.setFieldsValue({
                                                            phone: formatters.phoneFormatter(
                                                                e.target.value
                                                            ),
                                                        });
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>


                                        {/* FULL NAME */}
                                        <Col span={12}>
                                            <Form.Item
                                                label="Full Name"
                                                name="fullName"
                                                rules={[
                                                    validationRules.required("Full Name"),
                                                    validationRules.alphabets(),
                                                    validationRules.firstNameMinLength(),
                                                    validationRules.firstNameMaxLength(),
                                                ]}
                                            >
                                                <Input
                                                    onChange={(e) => {
                                                        form.setFieldsValue({
                                                            fullName: formatters.firstNameFormatter(
                                                                e.target.value
                                                            ),
                                                        });
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>


                                        {/* WEBSITE URL */}
                                        <Col span={12}>
                                            <Form.Item
                                                label="Website URL"
                                                name="website"
                                                rules={[
                                                    validationRules.required("Website URL"),
                                                    validationRules.url(),
                                                ]}
                                            >
                                                <Input
                                                    onChange={(e) => {
                                                        form.setFieldsValue({
                                                            website:
                                                                formatters.removeExtraSpaces(
                                                                    e.target.value
                                                                ),
                                                        });
                                                    }} />
                                            </Form.Item>
                                        </Col>
                                        {/* MSP Req ID */}
                                        <Col span={12}>
                                            <Form.Item
                                                label="MSP Req ID"
                                                name="mspreqID"
                                                rules={[
                                                    validationRules.required("MSP Req ID"),
                                                    validationRules.candidateId("MSP Req ID"),
                                                ]}
                                            >
                                                <Input
                                                    onChange={(e) => {
                                                        form.setFieldsValue({
                                                            mspreqID:
                                                                formatters.removeExtraSpaces(
                                                                    e.target.value
                                                                ),
                                                        });
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        {/* CANDIDATE ID */}
                                        <Col span={12}>
                                            <Form.Item
                                                label="Candidate ID"
                                                name="candidateId"
                                                rules={[
                                                    validationRules.required("Candidate ID"),
                                                    validationRules.candidateId("Candidate ID"),
                                                ]}
                                            >
                                                <Input
                                                    onChange={(e) => {
                                                        form.setFieldsValue({
                                                            candidateId:
                                                                formatters.removeExtraSpaces(
                                                                    e.target.value
                                                                ),
                                                        });
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>

                                        {/* DESIGNATION */}
                                        <Col span={12}>
                                            <Form.Item
                                                label="Designation"
                                                name="designation"
                                                rules={[
                                                    validationRules.required("Designation"),
                                                    validationRules.designation(),
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>


                                        {/* COMPANY NAME */}
                                        <Col span={12}>
                                            <Form.Item
                                                label="Company Name"
                                                name="companyName"
                                                rules={[
                                                    validationRules.required("Company Name"),
                                                    validationRules.companyName(),
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    {/* SUBMIT BUTTON */}
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">
                                            Submit
                                        </Button>

                                        <Button
                                            style={{ marginLeft: 10 }}
                                            onClick={() => form.resetFields()}
                                        >
                                            Reset
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </Card>
            </div>
            <div>
                <Tooltip title="Filter">
                    <Button
                        className="job-toolbar-icon-button"
                        icon={<FilterOutlined />}
                        onClick={() => setFiltersOpen(true)}
                    />
                </Tooltip>
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
            </div>
            <JobFilters
                open={filtersOpen}
                onClose={() => setFiltersOpen(false)}
                // valueOptionsByField={valueOptionsByField}
                onApply={({ filters }) => {
                    setAppliedFilterRows(filters);
                    setPagination((current) => ({ ...current, current: 1 }));
                }}
            />
        </>
    )
}