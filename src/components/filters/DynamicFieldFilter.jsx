import { useMemo } from 'react';
import {
  Button,
  Drawer,
  Flex,
  Form,
  Select,
  Space,
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const fieldResponses = {
  jobs: {
    status: true,
    data: [
      { label: 'Job Title', value: 'title', type: 'text' },
      { label: 'Client', value: 'client', type: 'text' },
      { label: 'Job Location', value: 'location', type: 'text' },
      { label: 'Remote Status', value: 'locationType', type: 'text' },
      { label: 'Experience', value: 'experience', type: 'text' },
      { label: 'Employment Type', value: 'employmentType', type: 'text' },
      { label: 'Client Rate', value: 'clientRate', type: 'text' },
      { label: 'Job Status', value: 'status', type: 'text' },
      { label: 'Created Date', value: 'createdAt', type: 'text' },
    ],
  },
};

const operatorOptions = [
  { label: 'AND', value: 'and' },
  { label: 'OR', value: 'or' },
  { label: 'Is Empty', value: 'isEmpty' },
  { label: 'Not Empty', value: 'notEmpty' },
];

const defaultFilterRow = {
  operator: 'and',
  field: undefined,
  values: [],
};

export default function DynamicFieldFilter({
  moduleName,
  open = false,
  onClose,
  onApply,
  valueOptionsByField = {},
}) {
  const [form] = Form.useForm();
  const filterRows = Form.useWatch('filters', form) ?? [];

  const fieldOptions = fieldResponses[moduleName]?.data ?? [];

  const fallbackValueOptions = useMemo(() => (
    Object.values(valueOptionsByField)
      .flat()
      .filter((option, index, options) => (
        options.findIndex((item) => item.value === option.value) === index
      ))
  ), [valueOptionsByField]);

  function getValueOptions(fieldName) {
    return valueOptionsByField[fieldName] ?? fallbackValueOptions;
  }

  function handleReset() {
    form.setFieldsValue({ filters: [defaultFilterRow] });
  }

  function handleApply() {
    const values = form.getFieldsValue();
    onApply?.({
      moduleName,
      filters: values.filters ?? [],
    });
    onClose?.();
  }

  function handleFieldChange(rowName) {
    const currentFilters = form.getFieldValue('filters') ?? [];
    form.setFieldValue(
      'filters',
      currentFilters.map((row, index) => (
        index === rowName ? { ...row, values: [] } : row
      )),
    );
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
      <Form
        form={form}
        layout="vertical"
        initialValues={{ filters: [defaultFilterRow] }}
      >
        <Form.List name="filters">
          {(fields, { add, remove }) => (
            <Space direction="vertical" style={{ width: '100%' }}>
              {fields.map((field, index) => {
                const selectedField = filterRows[index]?.field;
                const selectedOperator = filterRows[index]?.operator;
                const disableValues = !selectedField || selectedOperator === 'isEmpty' || selectedOperator === 'notEmpty';

                return (
                  <Space key={field.key} direction="vertical" style={{ width: '100%' }}>
                    {index > 0 && (
                      <Flex justify="center">
                        <Form.Item
                          name={[field.name, 'operator']}
                          rules={[{ required: true, message: 'Select condition' }]}
                        >
                          <Select
                            options={operatorOptions}
                            placeholder="Condition"
                          />
                        </Form.Item>
                      </Flex>
                    )}

                    <Flex align="end" gap="middle" wrap>
                      <Form.Item
                        label="Field"
                        name={[field.name, 'field']}
                        rules={[{ required: true, message: 'Select field' }]}
                        style={{ flex: 1, minWidth: 220 }}
                      >
                        <Select
                          allowClear
                          showSearch
                          placeholder="Select field"
                          options={fieldOptions}
                          optionFilterProp="label"
                          onChange={() => handleFieldChange(field.name)}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Values"
                        name={[field.name, 'values']}
                        style={{ flex: 1, minWidth: 220 }}
                      >
                        <Select
                          allowClear
                          disabled={disableValues}
                          mode="multiple"
                          optionFilterProp="label"
                          options={getValueOptions(selectedField)}
                          placeholder={selectedField ? 'Select values' : 'Select field first'}
                          showSearch
                        />
                      </Form.Item>

                      {fields.length > 1 && (
                        <Button
                          danger
                          htmlType="button"
                          icon={<DeleteOutlined />}
                          onClick={() => remove(field.name)}
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
    </Drawer>
  );
}
