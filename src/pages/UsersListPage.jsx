import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Button,
  Empty,
  Input,
  message,
  Modal,
  Space,
  Spin,
  Switch,
  Tabs,
  Tooltip,
  Typography,
} from 'antd';
import {
  EditOutlined,
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
import '../styles/UsersListPage.css';

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

export default function UsersListPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [customizingUser, setCustomizingUser] = useState(null);
  const [activeModule, setActiveModule] = useState('job');
  const [moduleFields, setModuleFields] = useState({});
  const [fieldsLoading, setFieldsLoading] = useState(false);
  const [fieldsError, setFieldsError] = useState('');
  const [fieldsSaving, setFieldsSaving] = useState(false);
  const [savingFieldKey, setSavingFieldKey] = useState('');
  const [fieldSearch, setFieldSearch] = useState('');

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
          <Avatar className="users-list-avatar">{record.initials}</Avatar>
          <Text className="users-list-name">{record.name}</Text>
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
          <Text ellipsis className="users-list-contact">{record.email}</Text>
          <Text className="users-list-phone">{record.phone}</Text>
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
        <Space size={14} className="users-list-actions">
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

  async function openCustomizeModal(user) {
    setCustomizingUser(user);
    setActiveModule('job');
    setFieldsLoading(true);
    setFieldsError('');
    setModuleFields({});
    setFieldSearch('');

    try {
      const fields = await getUserModuleFields(user);
      setModuleFields(fields);
      setActiveModule(moduleOrder.find((module) => fields[module]?.length) ?? 'job');
    } catch (err) {
      setFieldsError(err.message || 'Could not load module fields');
    } finally {
      setFieldsLoading(false);
    }
  }

  function closeCustomizeModal() {
    setCustomizingUser(null);
    setModuleFields({});
    setFieldsError('');
  }

  async function saveModuleFields() {
    setFieldsSaving(true);

    try {
      await updateUserModuleFields(customizingUser, moduleFields);
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

    setModuleFields((current) => ({
      ...current,
      [module]: nextFields,
    }));
    setSavingFieldKey(saveKey);

    try {
      await updateUserModuleFieldConfig(customizingUser, module, nextFields);
      message.success('Field visibility updated');
    } catch (err) {
      setModuleFields((current) => ({
        ...current,
        [module]: previousFields,
      }));
      message.error(err.message || 'Could not update field visibility');
    } finally {
      setSavingFieldKey('');
    }
  }

  const moduleItems = moduleOrder.map((module) => {
    const query = fieldSearch.trim().toLowerCase();
    const allFields = moduleFields[module] ?? [];
    const visibleFields = query
      ? allFields.filter((f) => f.fieldName.toLowerCase().includes(query))
      : allFields;

    return {
      key: module,
      label: moduleLabel(module),
      children: (
        <div className="module-fields-table">
          <div className="module-fields-head">
            <span>Field Name</span>
            <span>Show / Hide</span>
          </div>
          <div className="module-fields-scroll">
            {visibleFields.map((field) => (
              <div className="module-fields-row" key={field.fieldKey}>
                <span>{field.fieldName}</span>
                <Switch
                  size="small"
                  checked={field.isVisible}
                  loading={savingFieldKey === `${module}:${field.fieldKey}`}
                  disabled={Boolean(savingFieldKey)}
                  onChange={(checked) => toggleField(module, field.fieldKey, checked)}
                />
              </div>
            ))}
            {!fieldsLoading && !fieldsError && !visibleFields.length && (
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
    <main className="users-list-page">
      <section className="users-list-shell">
        {error && (
          <Alert
            type="error"
            showIcon
            message="Could not load users"
            description={error}
            className="users-list-alert"
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
          tableClassName="job-list-table users-list-table"
        />
      </section>

      <Modal
        open={Boolean(customizingUser)}
        onCancel={closeCustomizeModal}
        footer={[
          <Button key="cancel" onClick={closeCustomizeModal}>Cancel</Button>,
          <Button key="save" type="primary" loading={fieldsSaving} onClick={saveModuleFields}>Save Changes</Button>,
        ]}
        width={620}
        title={(
          <Space direction="vertical" size={2}>
            <Text strong>Customize Module Fields</Text>
            <Text className="users-list-modal-subtitle">User: {customizingUser?.name}</Text>
          </Space>
        )}
        className="users-list-modal"
      >
        {fieldsError && (
          <Alert
            type="error"
            showIcon
            message="Could not load module fields"
            description={fieldsError}
            className="users-list-fields-alert"
          />
        )}
        <Input
          className="module-fields-search"
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
