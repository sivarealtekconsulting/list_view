import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert, Badge, Breadcrumb, Button, Card, Checkbox, Col, DatePicker,
  Divider, Form, Input, InputNumber, message, Modal, Popconfirm,
  Row, Select, Skeleton, Space, Spin, Table, Tag, Typography,
} from 'antd';
import {
  DeleteOutlined, EditOutlined, PlusOutlined, SaveOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import { createSubmission, getFieldOptions, getSubmissionFormGroups } from '../services/submissionFormApi';

const { Title, Text } = Typography;

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Convert dayjs values to ISO strings recursively before submitting. */
function serializeDates(val) {
  if (!val) return val;
  if (dayjs.isDayjs(val)) return val.toISOString();
  if (Array.isArray(val)) return val.map(serializeDates);
  if (typeof val === 'object') {
    return Object.fromEntries(Object.entries(val).map(([k, v]) => [k, serializeDates(v)]));
  }
  return val;
}

/** Convert ISO strings back to dayjs when pre-filling for edit. */
function deserializeDates(fields, rowData) {
  const out = {};
  fields.forEach((f) => {
    const v = rowData[f.field];
    if (f.type === 'date' && v) {
      out[f.field] = dayjs(v).isValid() ? dayjs(v) : undefined;
    } else {
      out[f.field] = v;
    }
  });
  return out;
}

/** Ant Design Form.Item name: split dotted path into array. */
function toNamePath(fieldKey) {
  return fieldKey.includes('.') ? fieldKey.split('.') : fieldKey;
}

// ── Select with lazy-loaded options ──────────────────────────────────────────
function LazySelect({ fieldKey, disabled, ...rest }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const loaded = useRef(false);

  const load = useCallback(async (search = '') => {
    if (!search && loaded.current) return;
    setLoading(true);
    try {
      const opts = await getFieldOptions(fieldKey, search);
      setOptions(opts);
      if (!search) loaded.current = true;
    } finally {
      setLoading(false);
    }
  }, [fieldKey]);

  return (
    <Select
      showSearch
      allowClear
      style={{ width: '100%' }}
      loading={loading}
      options={options}
      onFocus={() => load()}
      onSearch={load}
      filterOption={false}
      disabled={disabled}
      {...rest}
    />
  );
}

// ── Single field renderer (used inside Form.Item) ─────────────────────────────
function FieldInput({ fieldDef, disabled = false }) {
  const isReadOnly = fieldDef.edit === 0 || disabled;
  switch (fieldDef.type) {
    case 'select':
      return <LazySelect fieldKey={fieldDef.field} disabled={isReadOnly} placeholder={`Select ${fieldDef.label}`} />;
    case 'number':
      return <InputNumber style={{ width: '100%' }} disabled={isReadOnly} />;
    case 'date':
      return <DatePicker style={{ width: '100%' }} disabled={isReadOnly} />;
    case 'email':
      return <Input type="email" disabled={isReadOnly} placeholder={fieldDef.label} />;
    case 'textarea':
      return <Input.TextArea rows={3} disabled={isReadOnly} placeholder={fieldDef.label} />;
    default:
      return <Input disabled={isReadOnly} placeholder={fieldDef.label} />;
  }
}

// ── Renders all fields for a group in a 2-col grid ───────────────────────────
function GroupFields({ fields }) {
  return (
    <Row gutter={[16, 0]}>
      {fields
        .filter((f) => f.show === 1)
        .map((f) => {
          const isCheckbox = f.type === 'checkbox';
          const rules = f.req === 1 && !isCheckbox
            ? [{ required: true, message: `${f.label} is required` }]
            : [];

          return (
            <Col xs={24} sm={12} key={f.field}>
              <Form.Item
                name={toNamePath(f.field)}
                label={!isCheckbox ? f.label : null}
                valuePropName={isCheckbox ? 'checked' : 'value'}
                rules={rules}
              >
                {isCheckbox ? <Checkbox>{f.label}</Checkbox> : <FieldInput fieldDef={f} />}
              </Form.Item>
            </Col>
          );
        })}
    </Row>
  );
}

// ── Static (non-addRow) group card ────────────────────────────────────────────
function StaticGroupCard({ group }) {
  const visibleFields = group.fields.filter((f) => f.show === 1);
  if (visibleFields.length === 0) return null;

  return (
    <Card
      style={{ marginBottom: 16, borderRadius: 10 }}
      styles={{ header: { background: '#f7f8fa' } }}
      title={
        <Space>
          <Text strong style={{ fontSize: 14 }}>{group.label}</Text>
        </Space>
      }
    >
      <GroupFields fields={visibleFields} />
    </Card>
  );
}

// ── AddRow group card ─────────────────────────────────────────────────────────
function AddRowGroupCard({ group, rows, onRowsChange }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState(null);
  const [modalForm] = Form.useForm();

  const visibleFields = group.fields.filter((f) => f.show === 1);

  // Preview columns: first 3 non-checkbox fields + actions
  const previewFields = visibleFields.filter((f) => f.type !== 'checkbox').slice(0, 3);
  const tableColumns = [
    ...previewFields.map((f) => ({
      title: f.label,
      dataIndex: f.field,
      key: f.field,
      ellipsis: true,
      render: (v) => {
        if (v == null || v === '') return <Text type="secondary">—</Text>;
        if (dayjs.isDayjs(v)) return v.format('DD MMM YYYY');
        if (typeof v === 'boolean') return v ? <Tag color="blue">Yes</Tag> : <Tag>No</Tag>;
        return String(v);
      },
    })),
    {
      key: '_actions',
      width: 80,
      align: 'right',
      render: (_, __, idx) => (
        <Space size={4}>
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => openEdit(idx)} />
          <Popconfirm title="Remove this entry?" onConfirm={() => removeRow(idx)}>
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  function openAdd() {
    setEditingIdx(null);
    modalForm.resetFields();
    setModalOpen(true);
  }

  function openEdit(idx) {
    setEditingIdx(idx);
    modalForm.setFieldsValue(deserializeDates(visibleFields, rows[idx]));
    setModalOpen(true);
  }

  async function handleOk() {
    try {
      const values = await modalForm.validateFields();
      const serialized = serializeDates(values);
      if (editingIdx !== null) {
        const updated = [...rows];
        updated[editingIdx] = serialized;
        onRowsChange(updated);
      } else {
        onRowsChange([...rows, serialized]);
      }
      setModalOpen(false);
    } catch {
      // validation errors shown inline
    }
  }

  function removeRow(idx) {
    onRowsChange(rows.filter((_, i) => i !== idx));
  }

  return (
    <Card
      style={{ marginBottom: 16, borderRadius: 10 }}
      styles={{ header: { background: '#f7f8fa' } }}
      title={
        <Space>
          <Text strong style={{ fontSize: 14 }}>{group.label}</Text>
          <Badge count={rows.length} showZero color="#1677ff" />
        </Space>
      }
      extra={
        <Button size="small" type="primary" ghost icon={<PlusOutlined />} onClick={openAdd}>
          Add
        </Button>
      }
    >
      {rows.length > 0 ? (
        <Table
          size="small"
          rowKey={(_, i) => i}
          dataSource={rows}
          columns={tableColumns}
          pagination={false}
          style={{ borderRadius: 8, overflow: 'hidden' }}
        />
      ) : (
        <Text type="secondary" style={{ fontSize: 13 }}>
          No entries yet. Click <strong>Add</strong> to add one.
        </Text>
      )}

      <Modal
        open={modalOpen}
        title={`${editingIdx !== null ? 'Edit' : 'Add'} — ${group.label}`}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
        okText={editingIdx !== null ? 'Update' : 'Add'}
        width={640}
        destroyOnClose
      >
        <Divider style={{ margin: '12px 0' }} />
        <Form form={modalForm} layout="vertical">
          <GroupFields fields={visibleFields} />
        </Form>
      </Modal>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SubmissionFormPage() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId') ?? '';

  const [form] = Form.useForm();
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [groupsError, setGroupsError] = useState('');

  // addRow data: { [groupName]: rows[] }
  const [addRowData, setAddRowData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Load form groups from API on mount
  useEffect(() => {
    getSubmissionFormGroups()
      .then((data) => {
        setGroups(data);
        // Initialise addRow buckets
        const buckets = {};
        data.filter((g) => g.addRow).forEach((g) => { buckets[g.name] = []; });
        setAddRowData(buckets);
      })
      .catch((err) => setGroupsError(err.message || 'Could not load form configuration'))
      .finally(() => setLoadingGroups(false));
  }, []);

  function setRowsForGroup(groupName, rows) {
    setAddRowData((prev) => ({ ...prev, [groupName]: rows }));
  }

  async function handleSubmit() {
    try {
      const staticValues = await form.validateFields();
      const payload = {
        ...serializeDates(staticValues),
        jobId: jobId || undefined,
      };
      // Merge addRow arrays under their group names
      Object.entries(addRowData).forEach(([groupName, rows]) => {
        if (rows.length > 0) payload[groupName] = rows;
      });

      setSubmitting(true);
      await createSubmission(payload);
      message.success('Submission created successfully');
      form.resetFields();
      const resetBuckets = {};
      groups.filter((g) => g.addRow).forEach((g) => { resetBuckets[g.name] = []; });
      setAddRowData(resetBuckets);
    } catch (err) {
      if (err?.errorFields) {
        message.error('Please fill all required fields');
        return;
      }
      message.error(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f3f5f8', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #edf0f4',
        padding: '12px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <Breadcrumb
          items={[
            { title: 'Home' },
            { title: 'Jobs' },
            { title: 'Quick Submit' },
          ]}
          style={{ marginBottom: 4 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={5} style={{ margin: 0 }}>Quick Submit</Title>
          <Space>
            <Button onClick={() => form.resetFields()} disabled={submitting}>Cancel</Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={submitting}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Space>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
        {groupsError && (
          <Alert type="error" showIcon message={groupsError} style={{ marginBottom: 16 }} />
        )}

        {loadingGroups ? (
          <Space direction="vertical" style={{ width: '100%' }} size={16}>
            {[1, 2, 3].map((i) => (
              <Card key={i} style={{ borderRadius: 10 }}>
                <Skeleton active paragraph={{ rows: 4 }} />
              </Card>
            ))}
          </Space>
        ) : (
          <Form form={form} layout="vertical" scrollToFirstError>
            {groups.map((group) =>
              group.addRow ? (
                <AddRowGroupCard
                  key={group.id ?? group.name}
                  group={group}
                  rows={addRowData[group.name] ?? []}
                  onRowsChange={(rows) => setRowsForGroup(group.name, rows)}
                />
              ) : (
                <StaticGroupCard
                  key={group.id ?? group.name}
                  group={group}
                />
              )
            )}
          </Form>
        )}

        {/* Sticky footer */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#fff',
          borderTop: '1px solid #edf0f4',
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 8,
          zIndex: 10,
        }}>
          <Text type="secondary" style={{ alignSelf: 'center', fontSize: 12 }}>
            All Unsaved Changes will be lost if you cancel and reload.
          </Text>
          <Button onClick={() => form.resetFields()} disabled={submitting}>Cancel</Button>
          <Button type="primary" loading={submitting} icon={<SaveOutlined />} onClick={handleSubmit}>
            Next
          </Button>
        </div>
      </div>
    </main>
  );
}
