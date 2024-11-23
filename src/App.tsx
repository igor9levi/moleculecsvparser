import { useState } from 'react';
import { Upload, Table, Input, Card, Statistic, Row, Col } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import Papa from 'papaparse';

import {
  ProcessedData,
  RawData,
  processCSV,
  getTableColumns,
  calculateStats,
  filterData,
} from './utils';

import 'antd/es/style/reset.css';

function App() {
  const [processedData, setProcessedData] = useState<ProcessedData[]>([]);
  const [searchText, setSearchText] = useState('');

  const handleUpload = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setProcessedData(processCSV(results.data as RawData[]));
      },
    });
    return false;
  };

  const filteredData = filterData(processedData, searchText);
  const stats = calculateStats(processedData);

  return (
    <div style={{ padding: '24px' }}>
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

      <Table
        dataSource={filteredData}
        columns={getTableColumns(processedData)}
        scroll={{ x: true }}
      />

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
