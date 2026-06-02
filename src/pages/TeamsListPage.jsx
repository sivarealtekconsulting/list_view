import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Space,
  Spin,
  Switch,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import {
  ApartmentOutlined,
  EditOutlined,
  SearchOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import ParamListView from '../components/ParamListView';
import {
  getAllTeams,
  getTeamModuleFields,
  updateTeam,
  updateTeamModuleFieldConfig,
} from '../services/rolesTeamsApi';

const { Text } = Typography;

const moduleOrder = ['job', 'candidate', 'submissions'];

function moduleLabel(mod) {
  return mod[0].toUpperCase() + mod.slice(1);
}

const fieldTableStyle = { border: '1px solid #e6ebf2', borderRadius: 6, background: '#ffffff', overflow: 'hidden' };
const fieldHeadStyle = { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 100px 100px', alignItems: 'center', minHeight: 36, padding: '0 16px', borderBottom: '1px solid #dce2ea', background: '#f7f8fa', color: '#8a92a0', fontSize: 12, fontWeight: 600, position: 'sticky', top: 0, zIndex: 1 };
const fieldScrollStyle = { maxHeight: 320, overflowY: 'auto', overflowX: 'hidden' };
const fieldRowStyle = { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 100px 100px', alignItems: 'center', minHeight: 38, padding: '0 16px', borderBottom: '1px solid #edf0f4' };

export default function TeamsListPage() {
  const [teams, setTeams] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Edit modal
  const [editingTeam, setEditingTeam] = useState(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editForm] = Form.useForm();

  // Field config modal
  const [configuringTeam, setConfiguringTeam] = useState(null);
  const [activeModule, setActiveModule] = useState('job');
  const [moduleFields, setModuleFields] = useState({});
  const [fieldsLoading, setFieldsLoading] = useState(false);
  const [fieldsError, setFieldsError] = useState('');
  const [savingFieldKey, setSavingFieldKey] = useState('');
  const [fieldSearch, setFieldSearch] = useState('');

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const offset = (currentPage - 1) * pageSize;
        const result = await getAllTeams({ offset, limit: pageSize, sortBy: 'new' });
        if (!ignore) {
          setTeams(result.teams);
          setTotal(result.total);
        }
      } catch (err) {
        if (!ignore) setError(err.message || 'Could not load teams');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => { ignore = true; };
  }, [currentPage, pageSize]);

  // ─── Edit team ─────────────────────────────────────────────────────────────
  // PUT /team/edit?teamId=N  body: { team_name, team_manager (int), other_team_members ([]int) }
  // UpdateUserTeam always rewrites all four columns, so we send current values for unchanged fields.

  function openEditModal(team) {
    setEditingTeam(team);
    editForm.setFieldsValue({ teamName: team.teamName !== 'N/A' ? team.teamName : '' });
  }

  function closeEditModal() {
    setEditingTeam(null);
    editForm.resetFields();
  }

  async function saveTeam() {
    let values;
    try {
      values = await editForm.validateFields();
    } catch {
      return;
    }
    setEditSaving(true);
    try {
      // Pass current managerId and memberIds unchanged to avoid zeroing DB columns
      await updateTeam(editingTeam, {
        teamName: values.teamName,
        managerId: editingTeam.managerId,
        memberIds: editingTeam.memberIds,
      });
      message.success('Team updated');
      setTeams((prev) =>
        prev.map((t) =>
          t.key === editingTeam.key ? { ...t, teamName: values.teamName } : t
        )
      );
      closeEditModal();
    } catch (err) {
      message.error(err.message || 'Could not update team');
    } finally {
      setEditSaving(false);
    }
  }

  // ─── Field config ──────────────────────────────────────────────────────────

  async function openFieldsModal(team) {
    setConfiguringTeam(team);
    setActiveModule('job');
    setFieldsLoading(true);
    setFieldsError('');
    setModuleFields({});
    setFieldSearch('');
    try {
      const fields = await getTeamModuleFields(team);
      setModuleFields(fields);
      setActiveModule(moduleOrder.find((m) => fields[m]?.length) ?? 'job');
    } catch (err) {
      setFieldsError(err.message || 'Could not load module fields');
    } finally {
      setFieldsLoading(false);
    }
  }

  function closeFieldsModal() {
    setConfiguringTeam(null);
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
      await updateTeamModuleFieldConfig(configuringTeam, mod, next);
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
      await updateTeamModuleFieldConfig(configuringTeam, mod, next);
      message.success('Field editable updated');
    } catch (err) {
      setModuleFields((cur) => ({ ...cur, [mod]: prev }));
      message.error(err.message || 'Could not update field');
    } finally {
      setSavingFieldKey('');
    }
  }

  // ─── Table columns ─────────────────────────────────────────────────────────
  // API returns per team: teamId, teamName, reportingManager, noOfTeamMembers, teamMembers ([]string)

  const teamFields = useMemo(() => [
    {
      label: 'Team Name',
      value: 'teamName',
      width: 200,
      sorter: (a, b) => a.teamName.localeCompare(b.teamName),
      render: (_, record) => (
        <Space size={8}>
          <ApartmentOutlined style={{ color: '#1677ff', fontSize: 15 }} />
          <Text className="job-cell-link" style={{ fontWeight: 500 }}>{record.teamName}</Text>
        </Space>
      ),
    },
    {
      label: 'Manager',
      value: 'manager',
      width: 180,
      sorter: (a, b) => a.manager.localeCompare(b.manager),
      render: (_, record) => (
        <Space size={6}>
          <UserOutlined style={{ color: '#8c8c8c', fontSize: 13 }} />
          <Text className="job-cell-primary">{record.manager}</Text>
        </Space>
      ),
    },
    {
      label: 'Members',
      value: 'memberCount',
      width: 100,
      sorter: (a, b) => a.memberCount - b.memberCount,
      render: (val, record) => (
        <Tooltip title={record.members?.join(', ') || 'No members'}>
          <Tag color="geekblue" style={{ cursor: 'default' }}>
            <TeamOutlined style={{ marginRight: 4 }} />
            {val}
          </Tag>
        </Tooltip>
      ),
    },
    {
      label: 'Actions',
      value: 'action',
      width: 100,
      sorter: false,
      render: (_, record) => (
        <Space size={6}>
          <Tooltip title="Edit team name">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
          <Tooltip title="Customize module fields">
            <Button
              type="text"
              size="small"
              icon={<SettingOutlined />}
              onClick={() => openFieldsModal(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ], []);

  // ─── Field config tab items ────────────────────────────────────────────────

  const moduleItems = moduleOrder.map((mod) => {
    const query = fieldSearch.trim().toLowerCase();
    const all = moduleFields[mod] ?? [];
    const visible = query ? all.filter((f) => f.fieldName.toLowerCase().includes(query)) : all;

    return {
      key: mod,
      label: moduleLabel(mod),
      children: (
        <div style={fieldTableStyle}>
          <div style={fieldHeadStyle}>
            <span>Field Name</span>
            <span style={{ justifySelf: 'center' }}>Show / Hide</span>
            <span style={{ justifySelf: 'center' }}>Editable</span>
          </div>
          <div style={fieldScrollStyle}>
            {visible.map((field) => (
              <div style={fieldRowStyle} key={field.fieldKey}>
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
            ))}
            {!fieldsLoading && !fieldsError && !visible.length && (
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
          message="Could not load teams"
          description={error}
          style={{ marginBottom: 8 }}
        />
      )}

      <ParamListView
        listName="Teams"
        fields={teamFields}
        dataSource={teams}
        loading={loading}
        total={total}
        current={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
        rowSelection={false}
        tableClassName="job-list-table"
      />

      {/* ── Edit Team Modal ──────────────────────────────────────────────── */}
      <Modal
        open={Boolean(editingTeam)}
        onCancel={closeEditModal}
        title={
          <Space size={8}>
            <EditOutlined style={{ color: '#1677ff' }} />
            <span>Edit Team</span>
          </Space>
        }
        footer={[
          <Button key="cancel" onClick={closeEditModal}>Cancel</Button>,
          <Button key="save" type="primary" loading={editSaving} onClick={saveTeam}>Save</Button>,
        ]}
        width={420}
        destroyOnClose
      >
        {/* Read-only info row */}
        {editingTeam && (
          <Space style={{ marginBottom: 16, marginTop: 8 }} size={24}>
            <Space size={6}>
              <UserOutlined style={{ color: '#8c8c8c' }} />
              <Text className="job-cell-secondary">Manager:</Text>
              <Text className="job-cell-primary">{editingTeam.manager}</Text>
            </Space>
            <Space size={6}>
              <TeamOutlined style={{ color: '#8c8c8c' }} />
              <Text className="job-cell-secondary">Members:</Text>
              <Text className="job-cell-primary">{editingTeam.memberCount}</Text>
            </Space>
          </Space>
        )}
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="teamName"
            label="Team Name"
            rules={[{ required: true, message: 'Team name is required' }]}
          >
            <Input placeholder="Enter team name" />
          </Form.Item>
        </Form>
      </Modal>

      {/* ── Field Config Modal ─────────────────────────────────────────────── */}
      <Modal
        open={Boolean(configuringTeam)}
        onCancel={closeFieldsModal}
        footer={[<Button key="close" onClick={closeFieldsModal}>Close</Button>]}
        width={700}
        title={
          <Space direction="vertical" size={2}>
            <Text strong>Customize Module Fields</Text>
            <Text className="job-cell-secondary">Team: {configuringTeam?.teamName}</Text>
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
        <Input
          style={{ margin: '10px 0 4px', borderRadius: 7 }}
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
