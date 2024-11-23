import { groupBy, meanBy } from 'lodash';
import type { ColumnsType } from 'antd/es/table';
import type { Key } from 'react';
import { ProcessedData, RawData, Stats } from './types';

export const processCSV = (data: RawData[]): ProcessedData[] => {
  const grouped: Record<string, RawData[]> = groupBy(data, 'Compound ID');

  return Object.entries(grouped).map(([compoundId, compounds]) => {
    const result: ProcessedData = { compoundId };

    Object.keys(compounds[0]).forEach((key) => {
      if (key === 'Compound ID') return;

      if (key.startsWith('result_')) {
        const values = compounds.map((c) => Number(c[key]));
        result[`${key}_avg`] = meanBy(values);
        result[`${key}_min`] = Math.min(...values);
        result[`${key}_max`] = Math.max(...values);
      } else {
        result[key] = compounds[0][key];
      }
    });

    return result;
  });
};

const getColumnWidth = (key: string): number => {
  const title = formatColumnTitle(key);
  // Calculate minimum width based on character count (assuming average char width)
  const charWidth = 8; // pixels per character
  const padding = 32; // pixels for padding and borders
  const minWidth = Math.max(
    title.length * charWidth + padding,
    key === 'compoundId' ? 150 : 120
  );

  return minWidth;
};

export const getTableColumns = (
  processedData: ProcessedData[]
): ColumnsType<ProcessedData> => {
  if (processedData.length === 0) return [];

  return Object.keys(processedData[0]).map((key) => ({
    title: formatColumnTitle(key),
    dataIndex: key,
    key: key,
    width: getColumnWidth(key),
    ellipsis: true,
    sorter: (a: ProcessedData, b: ProcessedData): number => {
      const valueA = a[key];
      const valueB = b[key];
      return typeof valueA === 'number'
        ? valueA - (valueB as number)
        : String(valueA).localeCompare(String(valueB));
    },
    filters: getColumnFilters(processedData, key),
    onFilter: (value: Key | boolean, record: ProcessedData): boolean =>
      String(record[key]) === String(value),
    align: typeof processedData[0][key] === 'number' ? 'right' : 'left',
  }));
};

const formatColumnTitle = (key: string): string => {
  // Format result columns with special handling
  if (key.startsWith('result_')) {
    const baseName = key
      .replace('result_', '')
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    if (key.endsWith('_avg')) return `${baseName} (Average)`;
    if (key.endsWith('_min')) return `${baseName} (Min)`;
    if (key.endsWith('_max')) return `${baseName} (Max)`;
  }

  // Format other columns: split by underscore and camelCase, capitalize each word
  return key
    .split(/(?=[A-Z])|_/)
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const getColumnFilters = (
  data: ProcessedData[],
  key: string
): { text: string; value: string }[] => {
  const uniqueValues = Array.from(
    new Set(data.map((item) => String(item[key])))
  );
  return uniqueValues.map((value) => ({
    text: value,
    value: value,
  }));
};

export const calculateStats = (processedData: ProcessedData[]): Stats => {
  return {
    uniqueCompounds: processedData.length,
    avgMolWeight: meanBy(processedData, 'molecular_weight') || 0,
    avgAtoms: meanBy(processedData, 'num_atoms') || 0,
  };
};

export const filterData = (
  data: ProcessedData[],
  searchText: string
): ProcessedData[] => {
  return data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );
};
