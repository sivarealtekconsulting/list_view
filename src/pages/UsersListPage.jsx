import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Button,
  Empty,
  Input,
  message,
  Modal,
  Radio,
  Space,
  Spin,
  Switch,
  Tabs,
  Tooltip,
  Typography,
} from 'antd';
import {
  EditOutlined,
  HolderOutlined,
  SearchOutlined,
  SettingOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import ParamListView from '../components/ParamListView';
import {
  getAllUsers,
  getUserModuleFields,
  updateUserModuleFieldConfig,
  updateUserModuleFields,
} from '../services/usersApi';

const { Text } = Typography;

const moduleOrder = ['job', 'candidate', 'submissions'];

function valueFrom(record, keys, fallback = 'N/A') {
  const value = keys.map((key) => record?.[key]).find((item) => item !== undefined && item !== null && item !== '');
  return value ?? fallback;
}

function getFullName(record) {
  const joinedName = [record?.first_name ?? record?.firstName, record?.last_name ?? record?.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();

  return valueFrom(record, ['name', 'fullName', 'full_name', 'username', 'userName'], joinedName || 'N/A');
}

function getInitials(name) {
  if (!name || name === 'N/A') return 'US';
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function normalizeStatus(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    return !['inactive', 'disabled', 'false', '0', 'no'].includes(value.toLowerCase());
  }
  return true;
}

function normalizeUser(record, index) {
  const name = getFullName(record);
  const email = valueFrom(record, ['email', 'user_email', 'userEmail', 'mail'], '');
  const phone = valueFrom(record, ['phone', 'mobile', 'contact', 'phone_number', 'phoneNumber'], '');

  return {
    key: valueFrom(record, ['id', '_id', 'user_id', 'userId'], `user-${index}`),
    name,
    initials: getInitials(name),
    role: valueFrom(record, ['role', 'roleName', 'user_role', 'designation']),
    team: valueFrom(record, ['team', 'teamName', 'department']),
    email: email || 'N/A',
    phone: phone || 'N/A',
    location: valueFrom(record, ['location', 'city', 'country']),
    reportingManager: valueFrom(record, ['reportingManager', 'reporting_manager', 'manager', 'managerName']),
    status: normalizeStatus(valueFrom(record, ['is_active', 'isActive', 'status', 'active'], true)),
    raw: record,
  };
}

function moduleLabel(module) {
  return module[0].toUpperCase() + module.slice(1);
}

const GRID_COLS = '28px minmax(0, 1fr) 100px 100px';
const moduleFieldsTableStyle = { border: '1px solid #e6ebf2', borderRadius: 6, background: '#ffffff', overflow: 'hidden' };
const moduleFieldsHeadStyle = { display: 'grid', gridTemplateColumns: GRID_COLS, alignItems: 'center', minHeight: 36, padding: '0 16px', borderBottom: '1px solid #dce2ea', background: '#f7f8fa', color: '#8a92a0', fontSize: 12, fontWeight: 600, position: 'sticky', top: 0, zIndex: 1 };
const moduleFieldsScrollStyle = { maxHeight: 320, overflowY: 'auto', overflowX: 'hidden' };
const moduleFieldsRowStyle = { display: 'grid', gridTemplateColumns: GRID_COLS, alignItems: 'center', minHeight: 38, padding: '0 16px', borderBottom: '1px solid #edf0f4' };

export default function UsersListPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [customizingUser, setCustomizingUser] = useState(null);
  const [configType, setConfigType] = useState('listView');
  const [activeModule, setActiveModule] = useState('job');
  const [moduleFields, setModuleFields] = useState({});
  const [fieldsLoading, setFieldsLoading] = useState(false);
  const [fieldsError, setFieldsError] = useState('');
  const [fieldsSaving, setFieldsSaving] = useState(false);
  const [savingFieldKey, setSavingFieldKey] = useState('');
  const [fieldSearch, setFieldSearch] = useState('');
  const [dragState, setDragState] = useState({ srcModule: null, srcIndex: null, hoverIndex: null });

  useEffect(() => {
    let ignore = false;

    async function loadUsers() {
      setLoading(true);
      setError('');

      try {
        const offset = (currentPage - 1) * pageSize;
        const result = await getAllUsers({ offset, limit: pageSize, sortBy: 'new' });
        if (!ignore) {
          setUsers(result.users.map(normalizeUser));
          setTotal(result.total);
        }
      } catch (err) {
        if (!ignore) setError(err.message || 'Could not load users');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadUsers();
    return () => {
      ignore = true;
    };
  }, [currentPage, pageSize]);

  const userFields = useMemo(() => [
    {
      label: 'Name',
      value: 'name',
      width: 220,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, record) => (
        <Space size={12}>
          <Avatar>{record.initials}</Avatar>
          <Text className="job-cell-primary">{record.name}</Text>
        </Space>
      ),
    },
    {
      label: 'Role',
      value: 'role',
      width: 160,
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      label: 'Team',
      value: 'team',
      width: 160,
      sorter: (a, b) => a.team.localeCompare(b.team),
    },
    {
      label: 'Contact',
      value: 'email',
      width: 250,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text ellipsis style={{ maxWidth: 210 }}>{record.email}</Text>
          <Text className="job-cell-primary">{record.phone}</Text>
        </Space>
      ),
    },
    {
      label: 'Location',
      value: 'location',
      width: 160,
      sorter: (a, b) => a.location.localeCompare(b.location),
    },
    {
      label: 'Reporting Manager',
      value: 'reportingManager',
      width: 210,
      sorter: (a, b) => a.reportingManager.localeCompare(b.reportingManager),
    },
    {
      label: 'Status',
      value: 'status',
      width: 130,
      render: (status) => <Switch checked={status} size="small" />,
    },
    {
      label: 'Action',
      value: 'action',
      width: 160,
      sorter: false,
      render: (_, record) => (
        <Space size={14}>
          <Tooltip title="Edit user">
            <Button type="text" icon={<EditOutlined />} aria-label="Edit user" />
          </Tooltip>
          <Tooltip title="Assign team">
            <Button type="text" icon={<UserAddOutlined />} aria-label="Assign team" />
          </Tooltip>
          <Tooltip title="Customize module fields">
            <Button
              type="text"
              icon={<SettingOutlined />}
              aria-label="Customize module fields"
              onClick={() => openCustomizeModal(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ], []);

  async function loadModuleFields(user, type) {
    setFieldsLoading(true);
    setFieldsError('');
    setModuleFields({});
    setFieldSearch('');
    try {
      const fields = await getUserModuleFields(user, type);
      setModuleFields(fields);
      setActiveModule(moduleOrder.find((module) => fields[module]?.length) ?? 'job');
    } catch (err) {
      setFieldsError(err.message || 'Could not load module fields');
    } finally {
      setFieldsLoading(false);
    }
  }

  async function openCustomizeModal(user) {
    const defaultType = 'listView';
    setCustomizingUser(user);
    setConfigType(defaultType);
    setActiveModule('job');
    await loadModuleFields(user, defaultType);
  }

  async function handleConfigTypeChange(newType) {
    setConfigType(newType);
    setSavingFieldKey('');
    await loadModuleFields(customizingUser, newType);
  }

  function closeCustomizeModal() {
    setCustomizingUser(null);
    setModuleFields({});
    setFieldsError('');
  }

  async function saveModuleFields() {
    setFieldsSaving(true);

    try {
      await updateUserModuleFields(customizingUser, moduleFields, configType);
      message.success('Module fields updated');
      closeCustomizeModal();
    } catch (err) {
      message.error(err.message || 'Could not update module fields');
    } finally {
      setFieldsSaving(false);
    }
  }

  async function toggleField(module, fieldKey, checked) {
    const previousFields = moduleFields[module] ?? [];
    const nextFields = previousFields.map((field) => (
      field.fieldKey === fieldKey ? { ...field, isVisible: checked } : field
    ));
    const saveKey = `${module}:${fieldKey}`;

    setModuleFields((current) => ({ ...current, [module]: nextFields }));
    setSavingFieldKey(saveKey);

    try {
      await updateUserModuleFieldConfig(customizingUser, module, nextFields, configType);
      message.success('Field visibility updated');
    } catch (err) {
      setModuleFields((current) => ({ ...current, [module]: previousFields }));
      message.error(err.message || 'Could not update field visibility');
    } finally {
      setSavingFieldKey('');
    }
  }

  function handleDragStart(module, index) {
    setDragState({ srcModule: module, srcIndex: index, hoverIndex: null });
  }

  function handleDragOver(module, index) {
    if (dragState.srcModule === module && dragState.hoverIndex !== index) {
      setDragState((s) => ({ ...s, hoverIndex: index }));
    }
  }

  function handleDragEnd() {
    setDragState({ srcModule: null, srcIndex: null, hoverIndex: null });
  }

  async function handleDrop(module, targetIndex) {
    const { srcModule, srcIndex } = dragState;
    setDragState({ srcModule: null, srcIndex: null, hoverIndex: null });
    if (srcModule !== module || srcIndex === null || srcIndex === targetIndex) return;

    const originalFields = moduleFields[module] ?? [];
    const next = [...originalFields];
    const [moved] = next.splice(srcIndex, 1);
    next.splice(targetIndex, 0, moved);
    const reordered = next.map((f, i) => ({ ...f, order: i }));

    setModuleFields((cur) => ({ ...cur, [module]: reordered }));
    const saveKey = `${module}:reorder`;
    setSavingFieldKey(saveKey);
    try {
      await updateUserModuleFieldConfig(customizingUser, module, reordered, configType);
      message.success('Field order updated');
    } catch (err) {
      setModuleFields((cur) => ({ ...cur, [module]: originalFields }));
      message.error(err.message || 'Could not save field order');
    } finally {
      setSavingFieldKey('');
    }
  }

  async function toggleFieldEditable(module, fieldKey, checked) {
    const previousFields = moduleFields[module] ?? [];
    const nextFields = previousFields.map((field) => (
      field.fieldKey === fieldKey ? { ...field, isEditable: checked } : field
    ));
    const saveKey = `${module}:${fieldKey}`;

    setModuleFields((current) => ({ ...current, [module]: nextFields }));
    setSavingFieldKey(saveKey);

    try {
      await updateUserModuleFieldConfig(customizingUser, module, nextFields, configType);
      message.success('Field editable updated');
    } catch (err) {
      setModuleFields((current) => ({ ...current, [module]: previousFields }));
      message.error(err.message || 'Could not update field');
    } finally {
      setSavingFieldKey('');
    }
  }

  const moduleItems = moduleOrder.map((module) => {
    const query = fieldSearch.trim().toLowerCase();
    const allFields = [...(moduleFields[module] ?? [])].sort((a, b) => a.order - b.order);
    const displayFields = query
      ? allFields.filter((f) => f.fieldName.toLowerCase().includes(query))
      : allFields;
    const isDragging = dragState.srcModule === module;
    const canDrag = !query && !Boolean(savingFieldKey);

    return {
      key: module,
      label: moduleLabel(module),
      children: (
        <div style={moduleFieldsTableStyle}>
          <div style={moduleFieldsHeadStyle}>
            <span />
            <span>Field Name</span>
            <span style={{ justifySelf: 'center' }}>Show / Hide</span>
            <span style={{ justifySelf: 'center' }}>Editable</span>
          </div>
          <div style={moduleFieldsScrollStyle}>
            {displayFields.map((field, index) => {
              const isBeingDragged = isDragging && dragState.srcIndex === index;
              const isDropTarget = isDragging && dragState.hoverIndex === index && dragState.srcIndex !== index;
              return (
                <div
                  key={field.fieldKey}
                  draggable={canDrag}
                  onDragStart={() => handleDragStart(module, index)}
                  onDragOver={(e) => { e.preventDefault(); handleDragOver(module, index); }}
                  onDrop={() => handleDrop(module, index)}
                  onDragEnd={handleDragEnd}
                  style={{
                    ...moduleFieldsRowStyle,
                    opacity: isBeingDragged ? 0.4 : 1,
                    background: isBeingDragged ? '#f0f5ff' : undefined,
                    borderTop: isDropTarget ? '2px solid #1677ff' : undefined,
                    transition: 'background 0.15s',
                  }}
                >
                  <HolderOutlined
                    style={{
                      color: canDrag ? '#bbb' : '#e0e0e0',
                      fontSize: 13,
                      cursor: canDrag ? 'grab' : 'default',
                    }}
                  />
                  <span style={{ fontSize: 13 }}>{field.fieldName}</span>
                  <Switch
                    size="small"
                    checked={field.isVisible}
                    loading={savingFieldKey === `${module}:${field.fieldKey}`}
                    disabled={Boolean(savingFieldKey)}
                    onChange={(checked) => toggleField(module, field.fieldKey, checked)}
                    style={{ justifySelf: 'center' }}
                  />
                  <Switch
                    size="small"
                    checked={field.isEditable ?? false}
                    loading={savingFieldKey === `${module}:${field.fieldKey}`}
                    disabled={Boolean(savingFieldKey)}
                    onChange={(checked) => toggleFieldEditable(module, field.fieldKey, checked)}
                    style={{ justifySelf: 'center' }}
                  />
                </div>
              );
            })}
            {!fieldsLoading && !fieldsError && !displayFields.length && (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={query ? `No fields matching "${fieldSearch}"` : `No ${moduleLabel(module)} fields`}
                style={{ padding: '20px 0' }}
              />
            )}
          </div>
        </div>
      ),
    };
  });

  return (
    <main style={{ minHeight: '100vh', padding: 18, background: '#f3f5f8' }}>
      {error && (
        <Alert
          type="error"
          showIcon
          message="Could not load users"
          description={error}
          style={{ marginBottom: 8 }}
        />
      )}

      <ParamListView
        listName="Users"
        fields={userFields}
        dataSource={users}
        loading={loading}
        total={total}
        current={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        rowSelection={false}
        className="users-param-list"
        tableClassName="job-list-table"
      />

      <Modal
        open={Boolean(customizingUser)}
        onCancel={closeCustomizeModal}
        footer={[
          <Button key="cancel" onClick={closeCustomizeModal}>Cancel</Button>,
          <Button key="save" type="primary" loading={fieldsSaving} onClick={saveModuleFields}>Save Changes</Button>,
        ]}
        width={700}
        title={(
          <Space direction="vertical" size={2}>
            <Text strong>Customize Module Fields</Text>
            <Text className="job-cell-secondary">User: {customizingUser?.name}</Text>
          </Space>
        )}
      >
        {fieldsError && (
          <Alert
            type="error"
            showIcon
            message="Could not load module fields"
            description={fieldsError}
            style={{ marginBottom: 8 }}
          />
        )}

        <div style={{ textAlign: 'center', margin: '14px 0 10px' }}>
          <Radio.Group
            value={configType}
            onChange={(e) => handleConfigTypeChange(e.target.value)}
            optionType="button"
            buttonStyle="solid"
            disabled={fieldsLoading || Boolean(savingFieldKey)}
            options={[
              { label: 'List View Columns', value: 'listView' },
              { label: 'Filter Dropdown', value: 'filter' },
            ]}
          />
        </div>

        <Input
          style={{ margin: '0 0 4px', borderRadius: 7 }}
          placeholder="Search fields..."
          prefix={<SearchOutlined />}
          value={fieldSearch}
          onChange={(e) => setFieldSearch(e.target.value)}
          allowClear
        />
        <Spin spinning={fieldsLoading}>
          <Tabs
            activeKey={activeModule}
            onChange={(key) => { setActiveModule(key); setFieldSearch(''); }}
            items={moduleItems}
            centered
          />
        </Spin>
      </Modal>
    </main>
  );
}
