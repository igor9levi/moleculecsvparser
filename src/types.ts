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
