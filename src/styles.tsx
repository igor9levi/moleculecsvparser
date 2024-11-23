import styled from '@emotion/styled';

export const Container = styled.div`
  padding: 24px;
  background-color: #e6f4ff;
  min-height: 100vh;
`;

export const SearchWrapper = styled.div`
  margin: 16px 0;
`;

export const ResultsHeader = styled.div`
  margin-bottom: 16px;
`;

export const TableContainer = styled.div`
  max-width: calc(100vw - 48px);
  overflow-x: auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: calc(100vh - 400px);
  display: flex;
  flex-direction: column;

  overflow: visible;
  }
`;

export const StatsRow = styled.div`
  margin-top: 24px;
`;
