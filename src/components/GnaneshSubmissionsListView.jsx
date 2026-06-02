import { useState, useCallback, useEffect } from 'react';
import {
  Alert,
  Button,
} from 'antd';
import { getSubmissions, login } from '../services/dropdownApi';
import DynamicListView from './DynamicListView';

const PAGE_SIZE = 10;

export default function GnaneshSubmissionsListView() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubmissions = useCallback(async (offset = 0) => {
    setLoading(true);
    setError(null);

    try {
      if (!localStorage.getItem('authToken')) {
        await login();
      }

      const result = await getSubmissions({ offset, limit: PAGE_SIZE });

      console.log('SUBMISSIONS RESULT:', result);
      console.log('SUBMISSIONS ARRAY:', result?.submissions);

      setSubmissions(result?.submissions || []);
    } catch (err) {
      setError(err.message ?? 'Failed to load submissions. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions(0);
  }, [fetchSubmissions]);

  return (
    <div data-testid="submissions-list-view">
      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          style={{ margin: '8px 0' }}
          action={
            <Button size="small" onClick={() => fetchSubmissions(0)}>
              Retry
            </Button>
          }
        />
      )}

      <DynamicListView
        moduleName="submissions"
        dataSource={submissions}
      />
    </div>
  );
}