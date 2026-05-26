import {
  Button,
  Drawer,
  Flex,
  Form,
  Select,
  Space,
  Spin,
  Alert,
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useDropdownFields } from '../../hooks/useDropdownFields';
import { useDropdownValues } from '../../hooks/useDropdownValues';

const operatorOptions = [
  { label: 'AND', value: 'and' },
  { label: 'OR', value: 'or' },
  { label: 'Is Empty', value: 'isEmpty' },
  { label: 'Not Empty', value: 'notEmpty' },
];

const defaultFilterRow = { operator: 'and', field: undefined, values: [] };

export default function DynamicFieldFilter({
  moduleName,
  open = false,
  onClose,
  onApply,
}) {
  const [form] = Form.useForm();
  const filterRows = Form.useWatch('filters', form) ?? [];

  // Fetch field list only while drawer is open to avoid unnecessary requests
  const { fields: apiFields, loading: fieldsLoading, error: fieldsError } = useDropdownFields(
    open ? moduleName : null,
  );

  const { valuesByField, loadingFields, fetchValues } = useDropdownValues(moduleName);

  function handleReset() {
    form.setFieldsValue({ filters: [defaultFilterRow] });
  }

  function handleApply() {
    const values = form.getFieldsValue();
    onApply?.({ moduleName, filters: values.filters ?? [] });
    onClose?.();
  }

  function handleFieldChange(rowName, newField) {
    // Clear previously selected values when field changes
    const currentFilters = form.getFieldValue('filters') ?? [];
    form.setFieldValue(
      'filters',
      currentFilters.map((row, index) => (index === rowName ? { ...row, values: [] } : row)),
    );
    // Eagerly load values for the newly selected field
    if (newField) fetchValues(newField);
  }

  return (
    <Drawer
      title="Filters"
      placement="right"
      width={720}
      open={open}
      onClose={onClose}
      footer={(
        <Space>
          <Button onClick={handleReset}>Reset</Button>
          <Button type="primary" onClick={handleApply}>Apply</Button>
        </Space>
      )}
    >
      {fieldsError && (
        <Alert
          type="error"
          message="Could not load filter fields"
          description={fieldsError}
          style={{ marginBottom: 16 }}
          showIcon
        />
      )}

      <Spin spinning={fieldsLoading} tip="Loading fields…">
        <Form
          form={form}
          layout="vertical"
          initialValues={{ filters: [defaultFilterRow] }}
        >
          <Form.List name="filters">
            {(formFields, { add, remove }) => (
              <Space direction="vertical" style={{ width: '100%' }}>
                {formFields.map((formField, index) => {
                  const selectedField = filterRows[index]?.field;
                  const selectedOperator = filterRows[index]?.operator;
                  const disableValues = !selectedField
                    || selectedOperator === 'isEmpty'
                    || selectedOperator === 'notEmpty';

                  const valueOptions = valuesByField[selectedField] ?? [];
                  const valuesLoading = loadingFields.has(selectedField);

                  return (
                    <Space key={formField.key} direction="vertical" style={{ width: '100%' }}>
                      {index > 0 && (
                        <Flex justify="center">
                          <Form.Item
                            name={[formField.name, 'operator']}
                            rules={[{ required: true, message: 'Select condition' }]}
                          >
                            <Select options={operatorOptions} placeholder="Condition" />
                          </Form.Item>
                        </Flex>
                      )}

                      <Flex align="end" gap="middle" wrap>
                        <Form.Item
                          label="Field"
                          name={[formField.name, 'field']}
                          rules={[{ required: true, message: 'Select field' }]}
                          style={{ flex: 1, minWidth: 220 }}
                        >
                          <Select
                            allowClear
                            showSearch
                            placeholder="Select field"
                            options={apiFields}
                            optionFilterProp="label"
                            loading={fieldsLoading}
                            onChange={(val) => handleFieldChange(formField.name, val)}
                          />
                        </Form.Item>

                        <Form.Item
                          label="Values"
                          name={[formField.name, 'values']}
                          style={{ flex: 1, minWidth: 220 }}
                        >
                          <Select
                            allowClear
                            disabled={disableValues}
                            loading={valuesLoading}
                            mode="multiple"
                            options={valueOptions}
                            placeholder={selectedField ? 'Select values' : 'Select field first'}
                            showSearch
                            // Server-side search — disable client filter, call API on type
                            filterOption={false}
                            onSearch={(search) => {
                              if (selectedField) fetchValues(selectedField, search);
                            }}
                            // Reload full list when dropdown opens (clears any search)
                            onDropdownVisibleChange={(visible) => {
                              if (visible && selectedField) fetchValues(selectedField);
                            }}
                          />
                        </Form.Item>

                        {formFields.length > 1 && (
                          <Button
                            danger
                            htmlType="button"
                            icon={<DeleteOutlined />}
                            onClick={() => remove(formField.name)}
                          />
                        )}
                      </Flex>
                    </Space>
                  );
                })}

                <Button
                  htmlType="button"
                  icon={<PlusOutlined />}
                  onClick={() => add(defaultFilterRow)}
                >
                  Add Row
                </Button>
              </Space>
            )}
          </Form.List>
        </Form>
      </Spin>
    </Drawer>
  );
}
