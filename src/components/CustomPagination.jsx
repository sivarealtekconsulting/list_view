import { Flex, Pagination, Select, Space, Typography } from 'antd';

const { Text } = Typography;

export default function CustomPagination({ current, pageSize, total, onChange, onPageSizeChange }) {
  const start = Math.min((current - 1) * pageSize + 1, total);
  const end = Math.min(current * pageSize, total);

  return (
    <Flex align="center" justify="space-between">
      <Space size={5} align="center">
        <Text>Show</Text>
        <Select
          value={pageSize}
          size="small"
          onChange={(val) => {
            onPageSizeChange(val);
            onChange(1);
          }}
          options={[
            { value: 7, label: '7' },
            { value: 10, label: '10' },
            { value: 25, label: '25' },
            { value: 50, label: '50' },
          ]}
        />
        <Text>/ page</Text>
      </Space>

      <Space size={16} align="center">
        <Text>{`Showing of ${start} - ${end} of 30`}</Text>
        <Pagination
          current={current}
          pageSize={pageSize}
          total={total}
          showSizeChanger={false}
          showQuickJumper={false}
          showLessItems
          onChange={onChange}
        />
      </Space>
    </Flex>
  );
}
