import { ConfigProvider } from 'antd';
import JobListView from './components/JobListView';

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        },
      }}
    >
      <JobListView />
    </ConfigProvider>
  );
}
