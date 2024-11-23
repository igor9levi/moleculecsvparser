import { groupBy, meanBy } from 'lodash';

export interface RawData {
  'Compound ID': string;
  [key: string]: string | number;
}

export interface ProcessedData {
  compoundId: string;
  [key: string]: string | number;
}

export interface Stats {
  uniqueCompounds: number;
  avgMolWeight: number;
  avgAtoms: number;
}

export const processCSV = (data: RawData[]): ProcessedData[] => {
  const grouped = groupBy(data, 'Compound ID');

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

export const getTableColumns = (processedData: ProcessedData[]) => {
  if (processedData.length === 0) return [];

  return Object.keys(processedData[0]).map((key) => ({
    title: key,
    dataIndex: key,
    key: key,
    sorter: (a: ProcessedData, b: ProcessedData) => {
      const valueA = a[key];
      const valueB = b[key];
      return typeof valueA === 'number'
        ? valueA - (valueB as number)
        : String(valueA).localeCompare(String(valueB));
    },
    filterable: true,
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
