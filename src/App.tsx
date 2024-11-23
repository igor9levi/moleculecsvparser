import { useState, useRef } from 'react';
import {
  Upload,
  Table,
  Input,
  Card,
  Statistic,
  Row,
  Col,
  Typography,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import Papa from 'papaparse';

import { ProcessedData, RawData } from './types';
import {
  processCSV,
  getTableColumns,
  calculateStats,
  filterData,
} from './utils';

// import 'antd/es/style/reset.css';

const { Title } = Typography;

// Add global style
const bodyStyle = {
  backgroundColor: '#e6f4ff', // light blue color from Ant Design's palette
  minHeight: '100vh',
};

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [processedData, setProcessedData] = useState<ProcessedData[]>([]);
  const [searchText, setSearchText] = useState('');

  const handleUpload = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setProcessedData(processCSV(results.data as RawData[]));
        containerRef.current?.scrollIntoView({ behavior: 'smooth' });
      },
    });
    return false;
  };

  const handleTableChange = () => {
    containerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredData = filterData(processedData, searchText);
  const stats = calculateStats(processedData);

  return (
    <div ref={containerRef} style={{ padding: '24px', ...bodyStyle }}>
      <Title>Experiments</Title>

      <Upload.Dragger
        accept=".csv"
        beforeUpload={handleUpload}
        showUploadList={false}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag CSV file to upload</p>
      </Upload.Dragger>

      <Input.Search
        placeholder="Search data..."
        style={{ margin: '16px 0' }}
        onSearch={setSearchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <div style={{ marginBottom: '16px' }}>
        <Title level={4}>Compound Analysis Results</Title>
        <p>
          Showing {filteredData.length} compounds
          {searchText && ` (filtered from ${processedData.length} total)`}
        </p>
      </div>

      <div
        style={{
          maxWidth: '100vw',
          overflowX: 'auto',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          height: 'calc(100vh - 400px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Table
          dataSource={filteredData}
          columns={getTableColumns(processedData)}
          scroll={{
            x: 'max-content',
            y: 'calc(100vh - 520px)', // Adjusted to ensure pagination visibility
          }}
          bordered
          sticky
          title={() => 'Compound Data'}
          onChange={handleTableChange}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
            size: 'small',
            style: {
              margin: '16px 0',
              position: 'sticky',
              bottom: 0,
              backgroundColor: '#fff',
              paddingBottom: '8px',
              zIndex: 1,
            },
          }}
        />
      </div>

      <Row gutter={16} style={{ marginTop: '24px' }}>
        <Col span={8}>
          <Card>
            <Statistic title="Unique Compounds" value={stats.uniqueCompounds} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Average Molecular Weight"
              value={stats.avgMolWeight}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Average Atoms per Compound"
              value={stats.avgAtoms}
              precision={2}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default App;
