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

import {
  Container,
  SearchWrapper,
  ResultsHeader,
  TableContainer,
  StatsRow,
} from './styles';

import { ProcessedData, RawData } from './types';
import {
  processCSV,
  getTableColumns,
  calculateStats,
  filterData,
} from './utils';

const { Title, Text, Paragraph } = Typography;

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
    <Container ref={containerRef}>
      <Title>Experiments</Title>

      <Upload.Dragger
        accept=".csv"
        beforeUpload={handleUpload}
        showUploadList={false}
        data-test-id="front-file"
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <Paragraph className="ant-upload-text">
          Click or drag CSV file to upload
        </Paragraph>
      </Upload.Dragger>

      <SearchWrapper>
        <Input.Search
          placeholder="Search data..."
          onSearch={setSearchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </SearchWrapper>

      <ResultsHeader>
        <Title level={4}>Compound Analysis Results</Title>
        <Text>
          Showing {filteredData.length} compounds
          {searchText && ` (filtered from ${processedData.length} total)`}
        </Text>
      </ResultsHeader>

      <TableContainer>
        <Table
          dataSource={filteredData}
          columns={getTableColumns(processedData)}
          scroll={{
            x: 'max-content',
            y: 'calc(100vh - 520px)',
            scrollToFirstRowOnChange: true,
          }}
          bordered
          sticky
          title={() => <Text strong>Compound Data</Text>}
          onChange={handleTableChange}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
            size: 'small',
            style: { margin: '16px 0' },
          }}
        />
      </TableContainer>

      <StatsRow>
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Unique Compounds"
                value={stats.uniqueCompounds}
              />
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
      </StatsRow>
    </Container>
  );
}

export default App;
