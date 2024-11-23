import { describe, it, expect } from 'vitest';
import {
  processCSV,
  calculateStats,
  filterData,
  getTableColumns,
} from './utils';
import { RawData, ProcessedData } from './types';

describe('processCSV', () => {
  it('should process CSV data correctly', () => {
    const mockData: RawData[] = [
      { 'Compound ID': 'C1', 'Mol Weight': '100', result_test: '10' },
      { 'Compound ID': 'C1', 'Mol Weight': '100', result_test: '20' },
    ];

    const result = processCSV(mockData);
    expect(result).toHaveLength(1);
    expect(result[0].compoundId).toBe('C1');
    expect(result[0]['result_test_avg']).toBe(15);
    expect(result[0]['result_test_min']).toBe(10);
    expect(result[0]['result_test_max']).toBe(20);
  });
});

describe('calculateStats', () => {
  it('should calculate correct statistics', () => {
    const mockData: ProcessedData[] = [
      { compoundId: 'C1', 'Mol Weight': '100', 'Num Atoms': '50' },
      { compoundId: 'C2', 'Mol Weight': '200', 'Num Atoms': '100' },
    ];

    const stats = calculateStats(mockData);
    expect(stats.uniqueCompounds).toBe(2);
    expect(stats.avgMolWeight).toBe(150);
    expect(stats.avgAtoms).toBe(75);
  });
});

describe('filterData', () => {
  it('should filter data based on search text', () => {
    const mockData: ProcessedData[] = [
      { compoundId: 'C1', value: 'test' },
      { compoundId: 'C2', value: 'other' },
    ];

    const result = filterData(mockData, 'test');
    expect(result).toHaveLength(1);
    expect(result[0].compoundId).toBe('C1');
  });

  it('should be case insensitive', () => {
    const mockData: ProcessedData[] = [
      { compoundId: 'C1', value: 'TEST' },
      { compoundId: 'C2', value: 'other' },
    ];

    const result = filterData(mockData, 'test');
    expect(result).toHaveLength(1);
    expect(result[0].compoundId).toBe('C1');
  });
});

describe('getTableColumns', () => {
  it('should generate correct column configurations', () => {
    const mockData: ProcessedData[] = [
      { compoundId: 'C1', result_test_avg: 10 },
    ];

    const columns = getTableColumns(mockData);
    expect(columns).toHaveLength(2);
    expect(columns[0].title).toBe('Compound Id');
    expect(columns[1].title).toBe('Test Avg (Average)');
  });

  it('should return empty array for empty data', () => {
    const columns = getTableColumns([]);
    expect(columns).toHaveLength(0);
  });
});
