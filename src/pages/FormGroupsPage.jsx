import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Drawer,
  Empty,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import {
  AppstoreAddOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import {
  createFormGroup,
  deleteFormGroup,
  getFormGroups,
  getModuleFields,
  seedFormGroups,
  updateFormGroup,
} from '../services/formGroupsApi';
import { getModules } from '../services/modulesApi';

const { Title, Text } = Typography;

// Tab colors by index — cycles if more modules are added
const TAB_COLORS = ['#1677ff', '#52c41a', '#722ed1', '#fa8c16', '#eb2f96', '#13c2c2'];

// Build the tab list from API modules: prepend the virtual "All" tab
function buildModuleTabs(apiModules) {
  const all = { key: 'all', label: 'All', color: '#8c8c8c' };
  const rest = apiModules.map((m, i) => ({
    key: m.key,
    label: m.label,
    color: TAB_COLORS[i % TAB_COLORS.length],
  }));
  return [all, ...rest];
}

const FIELD_TYPES = [
  { label: 'Text',     value: 'text' },
  { label: 'Number',   value: 'number' },
  { label: 'Email',    value: 'email' },
  { label: 'Date',     value: 'date' },
  { label: 'Select',   value: 'select' },
  { label: 'Checkbox', value: 'checkbox' },
  { label: 'Textarea', value: 'textarea' },
];

const VALIDATION_TYPES = [
  { label: 'Required',      value: 'required', hasValue: false },
  { label: 'Min length/value', value: 'min',  hasValue: true,  valueType: 'number', placeholder: 'e.g. 2' },
  { label: 'Max length/value', value: 'max',  hasValue: true,  valueType: 'number', placeholder: 'e.g. 100' },
  { label: 'Pattern (regex)',  value: 'pattern', hasValue: true, valueType: 'text', placeholder: '^[A-Za-z]+$' },
  { label: 'Email format',  value: 'email',   hasValue: false },
  { label: 'Phone format',  value: 'phone',   hasValue: false },
];

// Returns the VALIDATION_TYPES entry for a given type key.
function validationMeta(type) {
  return VALIDATION_TYPES.find((v) => v.value === type) ?? { hasValue: false };
}

// Color tag per validation type for the table's expanded view.
const VALIDATION_TAG_COLOR = {
  required: 'red',
  min:      'orange',
  max:      'gold',
  pattern:  'purple',
  email:    'blue',
  phone:    'cyan',
};

// ── Group create / edit drawer ─────────────────────────────────────────────
function GroupDrawer({ open, editingGroup, defaultModule, moduleOptions, allGroupsByModule, onClose, onSaved }) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [formModule, setFormModule] = useState(defaultModule);

  // field-list from API, keyed by module
  const [moduleFields, setModuleFields] = useState({});
  const [fieldsLoading, setFieldsLoading] = useState(false);
  const loadedRef = useRef({});

  // Load field list for a module (cached per drawer session)
  async function ensureModuleFields(mod) {
    if (!mod || loadedRef.current[mod]) return;
    setFieldsLoading(true);
    try {
      const fields = await getModuleFields(mod);
      setModuleFields((prev) => ({ ...prev, [mod]: fields }));
      loadedRef.current[mod] = true;
    } catch {
      // silently fall back to free-text entry
    } finally {
      setFieldsLoading(false);
    }
  }

  // Reset cache when drawer closes so next open re-fetches cleanly
  useEffect(() => {
    if (!open) {
      loadedRef.current = {};
      setModuleFields({});
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const mod = editingGroup?.module ?? defaultModule;
    setFormModule(mod);
    if (editingGroup) {
      form.setFieldsValue({
        module: editingGroup.module,
        name:   editingGroup.name,
        label:  editingGroup.label,
        addRow: editingGroup.addRow ?? false,
        order:  editingGroup.order ?? 0,
        fields: (editingGroup.fields ?? []).map((f) => ({
          ...f,
          show:        f.show === 1,
          req:         f.req  === 1,
          edit:        f.edit === 1,
          formatter:   f.formatter  ?? '',
          validations: (f.validations ?? []).map((v) => ({
            type:    v.type,
            value:   v.value ?? '',
            message: v.message ?? '',
          })),
        })),
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ module: mod, addRow: false, order: 0, fields: [] });
    }
    ensureModuleFields(mod);
  }, [open, editingGroup, defaultModule, form]);

  function handleModuleChange(mod) {
    setFormModule(mod);
    ensureModuleFields(mod);
  }

  // Build the set of field keys already used in OTHER groups of the same module.
  // Fields in the group currently being edited are excluded so they remain selectable.
  function usedFieldKeys(mod) {
    const groups = allGroupsByModule[mod] ?? [];
    const used = new Set();
    groups.forEach((g) => {
      if (editingGroup && g.id === editingGroup.id) return;
      (g.fields ?? []).forEach((fld) => { if (fld.field) used.add(fld.field); });
    });
    return used;
  }

  // When a field key is picked from the dropdown, auto-fill label and type
  function handleFieldKeySelect(fieldPath, rowName) {
    const apiFields = moduleFields[formModule] ?? [];
    const match = apiFields.find((f) => f.value === fieldPath);
    if (!match) return;
    const current = form.getFieldValue(['fields', rowName]) ?? {};
    form.setFieldValue(['fields', rowName], {
      ...current,
      field: match.value,
      label: match.label,
      type:  match.type ?? 'text',
    });
  }

  function fieldOptions(mod) {
    const taken = usedFieldKeys(mod);
    return (moduleFields[mod] ?? []).map((f) => ({
      value:       f.value,
      disabled:    taken.has(f.value),
      label: (
        <span style={{ opacity: taken.has(f.value) ? 0.4 : 1 }}>
          {f.label}
          <Text type="secondary" style={{ marginLeft: 6, fontSize: 11, fontFamily: 'monospace' }}>
            {f.value}
          </Text>
          {taken.has(f.value) && (
            <Text type="secondary" style={{ marginLeft: 6, fontSize: 11, color: '#ff4d4f' }}>
              (already in another group)
            </Text>
          )}
        </span>
      ),
      searchLabel: `${f.label} ${f.value}`.toLowerCase(),
    }));
  }

  async function handleSave() {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const payload = {
        module: values.module,
        name:   values.name,
        label:  values.label,
        addRow: values.addRow ?? false,
        order:  Number(values.order ?? 0),
        fields: (values.fields ?? []).map((f) => {
          // Build the clean validations array — drop any rows where type is empty.
          const validations = (f.validations ?? [])
            .filter((v) => v?.type)
            .map((v) => {
              const meta = validationMeta(v.type);
              const rule = { type: v.type, message: v.message ?? '' };
              if (meta.hasValue && v.value !== '' && v.value !== undefined && v.value !== null) {
                rule.value = meta.valueType === 'number' ? Number(v.value) : v.value;
              }
              return rule;
            });

          return {
            label:       f.label,
            field:       f.field,
            type:        f.type ?? 'text',
            show:        f.show ? 1 : 0,
            req:         f.req  ? 1 : 0,
            edit:        f.edit ? 1 : 0,
            formatter:   f.formatter  ?? '',
            validations,
          };
        }),
      };

      if (editingGroup) {
        await updateFormGroup(editingGroup.id, payload);
        message.success('Group updated');
      } else {
        await createFormGroup(payload);
        message.success('Group created');
      }
      onSaved();
    } catch (err) {
      if (err?.errorFields) return;
      message.error(err.message || 'Could not save group');
    } finally {
      setSaving(false);
    }
  }

  const currentModule = form.getFieldValue('module') ?? defaultModule;
  const options = fieldOptions(currentModule);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={editingGroup ? 'Edit Form Group' : 'New Form Group'}
      width={580}
      footer={
        <Space style={{ float: 'right' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" loading={saving} onClick={handleSave}>
            {editingGroup ? 'Update' : 'Create'}
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        {/* Module */}
        <Form.Item
          name="module"
          label="Module"
          rules={[{ required: true, message: 'Select a module' }]}
        >
          <Select
            options={moduleOptions}
            placeholder="Select module"
            onChange={handleModuleChange}
          />
        </Form.Item>

        {/* Group label */}
        <Form.Item
          name="label"
          label="Group Label"
          rules={[{ required: true, message: 'Label is required' }]}
        >
          <Input placeholder="e.g. Work Experience" />
        </Form.Item>

        {/* Group name (key) */}
        <Form.Item
          name="name"
          label="Group Name (key)"
          rules={[
            { required: true, message: 'Name is required' },
            { pattern: /^[a-z0-9_]+$/, message: 'Lowercase letters, numbers, underscores only' },
          ]}
        >
          <Input placeholder="e.g. work_experience" />
        </Form.Item>

        <Space size={24}>
          <Form.Item name="order" label="Display Order">
            <Input type="number" min={0} style={{ width: 100 }} />
          </Form.Item>
          <Form.Item name="addRow" label="Allow Add Row" valuePropName="checked">
            <Switch checkedChildren="Yes" unCheckedChildren="No" />
          </Form.Item>
        </Space>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0 6px' }}>
          <Title level={5} style={{ margin: 0 }}>Fields</Title>
          {fieldsLoading && <Spin size="small" />}
          {!fieldsLoading && options.length > 0 && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              {options.length} fields available from API
            </Text>
          )}
        </div>

        <Form.List name="fields">
          {(fieldItems, { add, remove }) => (
            <>
              {fieldItems.map(({ key, name: rowName, ...restField }) => (
                <div
                  key={key}
                  style={{
                    border: '1px solid #e6ebf2',
                    borderRadius: 8,
                    padding: '10px 12px 6px',
                    marginBottom: 10,
                    background: '#fafbfc',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      {/* Field key — searchable Select from API, falls back to text */}
                      <Form.Item
                        {...restField}
                        name={[rowName, 'field']}
                        label="Field"
                        style={{ marginBottom: 8 }}
                        rules={[{ required: true, message: 'Required' }]}
                      >
                        {options.length > 0 ? (
                          <Select
                            showSearch
                            placeholder="Search and select field…"
                            optionFilterProp="searchLabel"
                            options={options}
                            onChange={(val) => handleFieldKeySelect(val, rowName)}
                            filterOption={(input, opt) =>
                              (opt?.searchLabel ?? '').includes(input.toLowerCase())
                            }
                          />
                        ) : (
                          <Input placeholder="fieldKey" style={{ fontFamily: 'monospace' }} />
                        )}
                      </Form.Item>

                      <Space wrap style={{ gap: 8 }}>
                        {/* Label — auto-filled on select, editable */}
                        <Form.Item
                          {...restField}
                          name={[rowName, 'label']}
                          label="Label"
                          style={{ marginBottom: 8 }}
                          rules={[{ required: true, message: 'Required' }]}
                        >
                          <Input size="small" placeholder="Display label" style={{ width: 150 }} />
                        </Form.Item>

                        {/* Type — auto-filled on select, editable */}
                        <Form.Item
                          {...restField}
                          name={[rowName, 'type']}
                          label="Type"
                          style={{ marginBottom: 8 }}
                          initialValue="text"
                        >
                          <Select size="small" style={{ width: 110 }} options={FIELD_TYPES} />
                        </Form.Item>

                        {/* Formatter (optional) */}
                        <Form.Item
                          {...restField}
                          name={[rowName, 'formatter']}
                          label="Formatter"
                          style={{ marginBottom: 8 }}
                        >
                          <Input size="small" placeholder="name / email / phone / title" style={{ width: 140 }} />
                        </Form.Item>
                      </Space>

                      {/* show / req / edit toggles */}
                      <Space size={16} style={{ marginBottom: 8 }}>
                        <Form.Item
                          {...restField}
                          name={[rowName, 'show']}
                          valuePropName="checked"
                          style={{ marginBottom: 0 }}
                          initialValue={true}
                        >
                          <Switch size="small" checkedChildren="Show" unCheckedChildren="Hide" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[rowName, 'req']}
                          valuePropName="checked"
                          style={{ marginBottom: 0 }}
                          initialValue={false}
                        >
                          <Switch size="small" checkedChildren="Req" unCheckedChildren="Opt" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[rowName, 'edit']}
                          valuePropName="checked"
                          style={{ marginBottom: 0 }}
                          initialValue={true}
                        >
                          <Switch size="small" checkedChildren="Edit" unCheckedChildren="Read" />
                        </Form.Item>
                      </Space>

                      {/* ── Validations ──────────────────────────────────── */}
                      <div style={{ borderTop: '1px dashed #e6ebf2', paddingTop: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                          <SafetyCertificateOutlined style={{ color: '#1677ff', fontSize: 13 }} />
                          <Text style={{ fontSize: 12, fontWeight: 600, color: '#444' }}>Validations</Text>
                        </div>

                        <Form.List name={[rowName, 'validations']}>
                          {(valItems, { add: addVal, remove: removeVal }) => (
                            <>
                              {valItems.map(({ key: vKey, name: vName }) => (
                                <Form.Item shouldUpdate key={vKey} style={{ marginBottom: 6 }}>
                                  {({ getFieldValue }) => {
                                    const vType = getFieldValue(['fields', rowName, 'validations', vName, 'type']);
                                    const meta  = validationMeta(vType);
                                    return (
                                      <Space align="start" size={6} style={{ display: 'flex', width: '100%' }}>
                                        {/* Type */}
                                        <Form.Item
                                          name={[vName, 'type']}
                                          style={{ marginBottom: 0 }}
                                          rules={[{ required: true, message: 'Pick type' }]}
                                        >
                                          <Select
                                            size="small"
                                            placeholder="Type"
                                            style={{ width: 148 }}
                                            options={VALIDATION_TYPES.map((v) => ({ label: v.label, value: v.value }))}
                                          />
                                        </Form.Item>

                                        {/* Value — only for min / max / pattern */}
                                        {meta.hasValue && (
                                          <Form.Item name={[vName, 'value']} style={{ marginBottom: 0 }}>
                                            <Input
                                              size="small"
                                              type={meta.valueType === 'number' ? 'number' : 'text'}
                                              placeholder={meta.placeholder}
                                              style={{ width: 100 }}
                                            />
                                          </Form.Item>
                                        )}

                                        {/* Message */}
                                        <Form.Item
                                          name={[vName, 'message']}
                                          style={{ marginBottom: 0, flex: 1 }}
                                          rules={[{ required: true, message: 'Msg required' }]}
                                        >
                                          <Input size="small" placeholder="Error message shown to user" />
                                        </Form.Item>

                                        {/* Remove */}
                                        <MinusCircleOutlined
                                          style={{ color: '#ff4d4f', marginTop: 6, cursor: 'pointer', flexShrink: 0 }}
                                          onClick={() => removeVal(vName)}
                                        />
                                      </Space>
                                    );
                                  }}
                                </Form.Item>
                              ))}

                              <Button
                                size="small"
                                type="dashed"
                                icon={<PlusOutlined />}
                                onClick={() => addVal({ type: '', value: '', message: '' })}
                                style={{ marginTop: valItems.length ? 2 : 0 }}
                              >
                                Add Validation
                              </Button>
                            </>
                          )}
                        </Form.List>
                      </div>
                    </div>

                    <Tooltip title="Remove field">
                      <MinusCircleOutlined
                        style={{ color: '#ff4d4f', marginTop: 32, cursor: 'pointer', fontSize: 16, flexShrink: 0 }}
                        onClick={() => remove(rowName)}
                      />
                    </Tooltip>
                  </div>
                </div>
              ))}

              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => add({ type: 'text', show: true, req: false, edit: true })}
                block
              >
                Add Field
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </Drawer>
  );
}

// ── Groups table for one module tab ───────────────────────────────────────
function ModuleGroupsTable({ groups, onEdit, onDelete }) {
  const columns = [
    {
      title: 'Label',
      dataIndex: 'label',
      key: 'label',
      render: (label) => <Text strong>{label}</Text>,
    },
    {
      title: 'Key',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <Text code>{name}</Text>,
    },
    {
      title: 'Add Row',
      dataIndex: 'addRow',
      key: 'addRow',
      align: 'center',
      width: 96,
      render: (val) =>
        val ? <Tag color="blue">Yes</Tag> : <Tag color="default">No</Tag>,
    },
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
      align: 'center',
      width: 72,
    },
    {
      title: 'Fields',
      dataIndex: 'fields',
      key: 'fields',
      align: 'center',
      width: 72,
      render: (fields) => (
        <Badge count={fields?.length ?? 0} showZero color="#1677ff" />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      width: 100,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit group">
            <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          </Tooltip>
          <Popconfirm
            title="Delete this group?"
            description="All field mappings inside will be removed."
            onConfirm={() => onDelete(record.id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete group">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const sorted = [...groups].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <Table
      rowKey={(r) => r.id ?? r.name}
      dataSource={sorted}
      columns={columns}
      pagination={false}
      style={{ background: '#fff', borderRadius: 10 }}
      locale={{ emptyText: <Empty description="No groups for this module yet." style={{ padding: '24px 0' }} /> }}
      expandable={{
        expandedRowRender: (record) =>
          (record.fields ?? []).length === 0 ? (
            <Text type="secondary">No fields in this group.</Text>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '4px 0' }}>
              {(record.fields ?? []).map((f) => {
                const flags = [
                  f.show === 1 && <Tag key="show" color="blue" style={{ marginRight: 4 }}>Show</Tag>,
                  f.req  === 1 && <Tag key="req"  color="red"  style={{ marginRight: 4 }}>Required</Tag>,
                  f.edit === 1 && <Tag key="edit" color="green" style={{ marginRight: 4 }}>Editable</Tag>,
                  f.formatter   && <Tag key="fmt"  color="purple" style={{ marginRight: 4 }}>fmt: {f.formatter}</Tag>,
                ].filter(Boolean);

                const validations = f.validations ?? [];

                return (
                  <div
                    key={f.field}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '6px 10px', background: '#f9fafb', borderRadius: 6, border: '1px solid #edf0f4' }}
                  >
                    {/* Field info */}
                    <div style={{ minWidth: 180 }}>
                      <Text strong style={{ fontSize: 13 }}>{f.label}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 11, fontFamily: 'monospace' }}>{f.field}</Text>
                      <Text type="secondary" style={{ fontSize: 11, marginLeft: 6 }}>({f.type})</Text>
                    </div>

                    {/* Flags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4, flex: 1 }}>
                      {flags}
                    </div>

                    {/* Validations */}
                    {validations.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
                        <CheckCircleOutlined style={{ color: '#1677ff', fontSize: 12 }} />
                        {validations.map((v, vi) => (
                          <Tooltip
                            key={vi}
                            title={
                              <span>
                                {v.value !== undefined && v.value !== '' ? `Value: ${v.value} — ` : ''}
                                {v.message}
                              </span>
                            }
                          >
                            <Tag
                              color={VALIDATION_TAG_COLOR[v.type] ?? 'default'}
                              style={{ cursor: 'default', fontFamily: 'monospace', fontSize: 11 }}
                            >
                              {v.type}
                              {v.value !== undefined && v.value !== '' ? `(${v.value})` : ''}
                            </Tag>
                          </Tooltip>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ),
        rowExpandable: () => true,
      }}
    />
  );
}

function initModuleState(tabs) {
  return Object.fromEntries(tabs.map(({ key }) => [key, { groups: [], loading: false, error: '' }]));
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function FormGroupsPage() {
  // modules loaded from API; tabs derived from them
  const [apiModules, setApiModules]       = useState([]);
  const [modulesLoading, setModulesLoading] = useState(true);
  const [moduleState, setModuleState]     = useState({});
  const [activeModule, setActiveModule]   = useState('all');
  const [drawerOpen, setDrawerOpen]       = useState(false);
  const [editingGroup, setEditingGroup]   = useState(null);
  const [seeding, setSeeding]             = useState(false);

  // Derived from API modules
  const tabs = buildModuleTabs(apiModules);
  const moduleOptions = apiModules.map((m) => ({ value: m.key, label: m.label }));

  // Load module list from API on mount
  useEffect(() => {
    getModules()
      .then((mods) => {
        setApiModules(mods);
        const built = buildModuleTabs(mods);
        setModuleState(initModuleState(built));
        // Load the first tab ('all') immediately
        loadModuleInto('all', built);
      })
      .catch(() => setApiModules([]))
      .finally(() => setModulesLoading(false));
  }, []);

  function patchModule(key, patch) {
    setModuleState((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  }

  function loadModuleInto(key, tabList) {
    // use tabList param when called before state has settled
    const currentTabs = tabList ?? tabs;
    if (!currentTabs.find((t) => t.key === key)) return;
    patchModule(key, { loading: true, error: '' });
    getFormGroups(key === 'all' ? '' : key)
      .then((data) => patchModule(key, { groups: data, loading: false }))
      .catch((err) => patchModule(key, { error: err.message || 'Could not load groups', loading: false }));
  }

  function loadModule(key) { loadModuleInto(key, null); }

  function handleTabChange(key) {
    setActiveModule(key);
    loadModule(key);
  }

  function openCreate() { setEditingGroup(null); setDrawerOpen(true); }
  function openEdit(group) { setEditingGroup(group); setDrawerOpen(true); }
  function closeDrawer() { setDrawerOpen(false); setEditingGroup(null); }

  async function handleSaved() {
    closeDrawer();
    loadModule(activeModule);
    if (activeModule !== 'all') loadModule('all');
  }

  async function handleDelete(id) {
    try {
      await deleteFormGroup(id);
      message.success('Group deleted');
      loadModule(activeModule);
      if (activeModule !== 'all') loadModule('all');
    } catch (err) {
      message.error(err.message || 'Could not delete group');
    }
  }

  async function handleSeed() {
    setSeeding(true);
    try {
      const result = await seedFormGroups();
      const seeded = result?.data?.seeded ?? [];
      message.success(seeded.length ? `Seeded: ${seeded.join(', ')}` : 'All modules already seeded');
      setModuleState(initModuleState(tabs));
      loadModule(activeModule);
      if (activeModule !== 'all') loadModule('all');
    } catch (err) {
      message.error(err.message || 'Could not seed groups');
    } finally {
      setSeeding(false);
    }
  }

  const tabItems = tabs.map(({ key, label, color }) => {
    const state = moduleState[key] ?? { groups: [], loading: false, error: '' };
    const sorted = [...state.groups].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return {
      key,
      label: (
        <Space size={6}>
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: color }} />
          {label}
          <Badge count={state.groups.length} showZero color={color} size="small" />
        </Space>
      ),
      children: (
        <div style={{ paddingTop: 12 }}>
          {state.error && <Alert type="error" showIcon message={state.error} style={{ marginBottom: 10 }} />}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => { setActiveModule(key); openCreate(); }}
              disabled={key === 'all'}
            >
              Add Group
            </Button>
          </div>
          <Spin spinning={state.loading}>
            <ModuleGroupsTable groups={sorted} onEdit={openEdit} onDelete={handleDelete} />
          </Spin>
        </div>
      ),
    };
  });

  return (
    <main style={{ minHeight: '100vh', padding: 18, background: '#f3f5f8' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Form Groups</Title>
        <Space>
          <Tooltip title="Seed default groups for all modules (skips if already seeded)">
            <Button icon={<ReloadOutlined />} loading={seeding} onClick={handleSeed}>
              Seed Defaults
            </Button>
          </Tooltip>
          <Button type="primary" icon={<AppstoreAddOutlined />} onClick={openCreate}>
            New Group
          </Button>
        </Space>
      </div>

      <Spin spinning={modulesLoading}>
        <div style={{ background: '#fff', borderRadius: 10, padding: '4px 16px 16px' }}>
          <Tabs activeKey={activeModule} onChange={handleTabChange} items={tabItems} size="middle" />
        </div>
      </Spin>

      <GroupDrawer
        open={drawerOpen}
        editingGroup={editingGroup}
        defaultModule={activeModule}
        moduleOptions={moduleOptions}
        allGroupsByModule={Object.fromEntries(
          Object.entries(moduleState)
            .filter(([k]) => k !== 'all')
            .map(([k, v]) => [k, v.groups ?? []])
        )}
        onClose={closeDrawer}
        onSaved={handleSaved}
      />
    </main>
  );
}
