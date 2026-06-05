import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
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
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import {
  HolderOutlined,
  SearchOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import ParamListView from '../components/ParamListView';
import {
  getAllRoles,
  getRoleModuleFields,
  updateRoleModuleFieldConfig,
} from '../services/rolesTeamsApi';

const { Text } = Typography;

const moduleOrder = ['job', 'candidate', 'submissions'];

function moduleLabel(mod) {
  return mod[0].toUpperCase() + mod.slice(1);
}

const GRID_COLS = '28px minmax(0, 1fr) 100px 100px';
const fieldTableStyle = { border: '1px solid #e6ebf2', borderRadius: 6, background: '#ffffff', overflow: 'hidden' };
const fieldHeadStyle = { display: 'grid', gridTemplateColumns: GRID_COLS, alignItems: 'center', minHeight: 36, padding: '0 16px', borderBottom: '1px solid #dce2ea', background: '#f7f8fa', color: '#8a92a0', fontSize: 12, fontWeight: 600, position: 'sticky', top: 0, zIndex: 1 };
const fieldScrollStyle = { maxHeight: 320, overflowY: 'auto', overflowX: 'hidden' };
const fieldRowStyle = { display: 'grid', gridTemplateColumns: GRID_COLS, alignItems: 'center', minHeight: 38, padding: '0 16px', borderBottom: '1px solid #edf0f4' };

export default function RolesListPage() {
  const [roles, setRoles] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Field config modal
  const [configuringRole, setConfiguringRole] = useState(null);
  const [configType, setConfigType] = useState('listView');
  const [activeModule, setActiveModule] = useState('job');
  const [moduleFields, setModuleFields] = useState({});
  const [fieldsLoading, setFieldsLoading] = useState(false);
  const [fieldsError, setFieldsError] = useState('');
  const [savingFieldKey, setSavingFieldKey] = useState('');
  const [fieldSearch, setFieldSearch] = useState('');
  const [dragState, setDragState] = useState({ srcModule: null, srcIndex: null, hoverIndex: null });

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const result = await getAllRoles();
        if (!ignore) {
          setRoles(result.roles);
          setTotal(result.total);
        }
      } catch (err) {
        if (!ignore) setError(err.message || 'Could not load roles');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => { ignore = true; };
  }, []);

  // ─── Field config ─────────────────────────────────────────────────────────

  async function loadRoleFields(role, type) {
    setFieldsLoading(true);
    setFieldsError('');
    setModuleFields({});
    setFieldSearch('');
    try {
      const fields = await getRoleModuleFields(role, type);
      setModuleFields(fields);
      setActiveModule(moduleOrder.find((m) => fields[m]?.length) ?? 'job');
    } catch (err) {
      setFieldsError(err.message || 'Could not load module fields');
    } finally {
      setFieldsLoading(false);
    }
  }

  async function openFieldsModal(role) {
    const defaultType = 'listView';
    setConfiguringRole(role);
    setConfigType(defaultType);
    setActiveModule('job');
    await loadRoleFields(role, defaultType);
  }

  async function handleConfigTypeChange(newType) {
    setConfigType(newType);
    setSavingFieldKey('');
    await loadRoleFields(configuringRole, newType);
  }

  function closeFieldsModal() {
    setConfiguringRole(null);
    setModuleFields({});
    setFieldsError('');
  }

  async function toggleField(mod, fieldKey, checked) {
    const prev = moduleFields[mod] ?? [];
    const next = prev.map((f) => (f.fieldKey === fieldKey ? { ...f, isVisible: checked } : f));
    const saveKey = `${mod}:${fieldKey}`;
    setModuleFields((cur) => ({ ...cur, [mod]: next }));
    setSavingFieldKey(saveKey);
    try {
      await updateRoleModuleFieldConfig(configuringRole, mod, next, configType);
      message.success('Field visibility updated');
    } catch (err) {
      setModuleFields((cur) => ({ ...cur, [mod]: prev }));
      message.error(err.message || 'Could not update field visibility');
    } finally {
      setSavingFieldKey('');
    }
  }

  async function toggleFieldEditable(mod, fieldKey, checked) {
    const prev = moduleFields[mod] ?? [];
    const next = prev.map((f) => (f.fieldKey === fieldKey ? { ...f, isEditable: checked } : f));
    const saveKey = `${mod}:${fieldKey}`;
    setModuleFields((cur) => ({ ...cur, [mod]: next }));
    setSavingFieldKey(saveKey);
    try {
      await updateRoleModuleFieldConfig(configuringRole, mod, next, configType);
      message.success('Field editable updated');
    } catch (err) {
      setModuleFields((cur) => ({ ...cur, [mod]: prev }));
      message.error(err.message || 'Could not update field');
    } finally {
      setSavingFieldKey('');
    }
  }

  function handleDragStart(mod, index) {
    setDragState({ srcModule: mod, srcIndex: index, hoverIndex: null });
  }

  function handleDragOver(mod, index) {
    if (dragState.srcModule === mod && dragState.hoverIndex !== index) {
      setDragState((s) => ({ ...s, hoverIndex: index }));
    }
  }

  function handleDragEnd() {
    setDragState({ srcModule: null, srcIndex: null, hoverIndex: null });
  }

  async function handleDrop(mod, targetIndex) {
    const { srcModule, srcIndex } = dragState;
    setDragState({ srcModule: null, srcIndex: null, hoverIndex: null });
    if (srcModule !== mod || srcIndex === null || srcIndex === targetIndex) return;

    const originalFields = moduleFields[mod] ?? [];
    const next = [...originalFields];
    const [moved] = next.splice(srcIndex, 1);
    next.splice(targetIndex, 0, moved);
    const reordered = next.map((f, i) => ({ ...f, order: i }));

    setModuleFields((cur) => ({ ...cur, [mod]: reordered }));
    setSavingFieldKey(`${mod}:reorder`);
    try {
      await updateRoleModuleFieldConfig(configuringRole, mod, reordered, configType);
      message.success('Field order updated');
    } catch (err) {
      setModuleFields((cur) => ({ ...cur, [mod]: originalFields }));
      message.error(err.message || 'Could not save field order');
    } finally {
      setSavingFieldKey('');
    }
  }

  // ─── Table columns ────────────────────────────────────────────────────────
  // API returns: role_id, role_name, role_description, role_type (0=default,1=custom), user_count

  const roleFields = useMemo(() => [
    {
      label: 'Role Name',
      value: 'roleName',
      width: 220,
      sorter: (a, b) => a.roleName.localeCompare(b.roleName),
      render: (_, record) => (
        <Space size={8}>
          <TeamOutlined style={{ color: '#1677ff', fontSize: 15 }} />
          <Text className="job-cell-link" style={{ fontWeight: 500 }}>{record.roleName}</Text>
        </Space>
      ),
    },
    {
      label: 'Description',
      value: 'description',
      width: 280,
      sorter: false,
      render: (_, record) => (
        <Text className="job-cell-primary" ellipsis style={{ maxWidth: 260 }}>
          {record.description}
        </Text>
      ),
    },
    {
      label: 'Type',
      value: 'roleType',
      width: 120,
      sorter: (a, b) => a.roleType - b.roleType,
      render: (roleType) => (
        <Tag color={roleType === 0 ? 'blue' : 'purple'} style={{ minWidth: 62, textAlign: 'center' }}>
          {roleType === 0 ? 'Default' : 'Custom'}
        </Tag>
      ),
    },
    {
      label: 'Users',
      value: 'userCount',
      width: 90,
      sorter: (a, b) => a.userCount - b.userCount,
      render: (val) => (
        <Badge
          count={val}
          overflowCount={999}
          style={{ backgroundColor: val > 0 ? '#1677ff' : '#d9d9d9' }}
          showZero
        />
      ),
    },
    {
      label: 'Actions',
      value: 'action',
      width: 80,
      sorter: false,
      render: (_, record) => (
        <Tooltip title="Customize module fields">
          <Button
            type="text"
            size="small"
            icon={<SettingOutlined />}
            onClick={() => openFieldsModal(record)}
          />
        </Tooltip>
      ),
    },
  ], []);

  // ─── Field config tab items ────────────────────────────────────────────────

  const moduleItems = moduleOrder.map((mod) => {
    const query = fieldSearch.trim().toLowerCase();
    const allFields = [...(moduleFields[mod] ?? [])].sort((a, b) => a.order - b.order);
    const displayFields = query ? allFields.filter((f) => f.fieldName.toLowerCase().includes(query)) : allFields;
    const isDragging = dragState.srcModule === mod;
    const canDrag = !query && !Boolean(savingFieldKey);

    return {
      key: mod,
      label: moduleLabel(mod),
      children: (
        <div style={fieldTableStyle}>
          <div style={fieldHeadStyle}>
            <span />
            <span>Field Name</span>
            <span style={{ justifySelf: 'center' }}>Show / Hide</span>
            <span style={{ justifySelf: 'center' }}>Editable</span>
          </div>
          <div style={fieldScrollStyle}>
            {displayFields.map((field, index) => {
              const isBeingDragged = isDragging && dragState.srcIndex === index;
              const isDropTarget = isDragging && dragState.hoverIndex === index && dragState.srcIndex !== index;
              return (
                <div
                  key={field.fieldKey}
                  draggable={canDrag}
                  onDragStart={() => handleDragStart(mod, index)}
                  onDragOver={(e) => { e.preventDefault(); handleDragOver(mod, index); }}
                  onDrop={() => handleDrop(mod, index)}
                  onDragEnd={handleDragEnd}
                  style={{
                    ...fieldRowStyle,
                    opacity: isBeingDragged ? 0.4 : 1,
                    background: isBeingDragged ? '#f0f5ff' : undefined,
                    borderTop: isDropTarget ? '2px solid #1677ff' : undefined,
                    transition: 'background 0.15s',
                  }}
                >
                  <HolderOutlined style={{ color: canDrag ? '#bbb' : '#e0e0e0', fontSize: 13, cursor: canDrag ? 'grab' : 'default' }} />
                  <span style={{ fontSize: 13 }}>{field.fieldName}</span>
                  <Switch
                    size="small"
                    checked={field.isVisible}
                    loading={savingFieldKey === `${mod}:${field.fieldKey}`}
                    disabled={Boolean(savingFieldKey)}
                    onChange={(checked) => toggleField(mod, field.fieldKey, checked)}
                    style={{ justifySelf: 'center' }}
                  />
                  <Switch
                    size="small"
                    checked={field.isEditable ?? false}
                    loading={savingFieldKey === `${mod}:${field.fieldKey}`}
                    disabled={Boolean(savingFieldKey)}
                    onChange={(checked) => toggleFieldEditable(mod, field.fieldKey, checked)}
                    style={{ justifySelf: 'center' }}
                  />
                </div>
              );
            })}
            {!fieldsLoading && !fieldsError && !displayFields.length && (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={query ? `No fields matching "${fieldSearch}"` : `No ${moduleLabel(mod)} fields`}
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
          message="Could not load roles"
          description={error}
          style={{ marginBottom: 8 }}
        />
      )}

      <ParamListView
        listName="Roles"
        fields={roleFields}
        dataSource={roles}
        loading={loading}
        total={total}
        rowSelection={false}
        tableClassName="job-list-table"
      />

      {/* ── Field Config Modal ─────────────────────────────────────────────── */}
      <Modal
        open={Boolean(configuringRole)}
        onCancel={closeFieldsModal}
        footer={[<Button key="close" onClick={closeFieldsModal}>Close</Button>]}
        width={700}
        title={
          <Space direction="vertical" size={2}>
            <Text strong>Customize Module Fields</Text>
            <Text className="job-cell-secondary">
              Role: {configuringRole?.roleName}
              {configuringRole?.roleType === 0
                ? <Tag color="blue" style={{ marginLeft: 8 }}>Default</Tag>
                : <Tag color="purple" style={{ marginLeft: 8 }}>Custom</Tag>
              }
            </Text>
          </Space>
        }
        destroyOnClose
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
              { label: 'Forms List', value: 'form' },
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
