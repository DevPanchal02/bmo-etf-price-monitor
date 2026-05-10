import { useState, useMemo } from 'react';
import type { TableRowData } from '../../types';
import styles from './ConstituentsTable.module.css';

interface ConstituentsTableProps {
  data: TableRowData[];
}

// extend the data model locally so we can sort by our dynamically calculated column
interface ExtendedRowData extends TableRowData {
  contribution: number;
}

type SortKey = keyof ExtendedRowData;
type SortDirection = 'asc' | 'desc';

export function ConstituentsTable({ data }: ConstituentsTableProps) {
  const[sortKey, setSortKey] = useState<SortKey>('weight');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  //  currency formatter for Last Close Price
  const currencyFormatter = useMemo(() => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }),[]);

  // compute contribution and handle sorting
  const sortedData = useMemo(() => {
    const extendedData: ExtendedRowData[] = data.map(row => ({
      ...row,
      contribution: row.weight * row.latestPrice
    }));

    return extendedData.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortDirection]);

  // click handler for column headers
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
       // Default to descending when switching columns
      setSortDirection('desc');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader}>

        <h3 className={styles.title}>CONSTITUENT DATA</h3>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr className={styles.thRow}>
              <th className={styles.th} onClick={() => handleSort('name')}>
                <div className={styles.sortHeader}>Ticker</div>
              </th>
              <th className={`${styles.th} ${styles.alignRight}`} onClick={() => handleSort('weight')}>
                <div className={`${styles.sortHeader} ${styles.justifyEnd}`}>Weight %</div>
              </th>
              <th className={`${styles.th} ${styles.alignRight}`} onClick={() => handleSort('latestPrice')}>
                <div className={`${styles.sortHeader} ${styles.justifyEnd}`}>Last Close Price</div>
              </th>
              <th className={`${styles.th} ${styles.alignRight}`} onClick={() => handleSort('contribution')}>
                <div className={`${styles.sortHeader} ${styles.justifyEnd}`}>Contribution</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr 
                key={row.name} 
                className={`${styles.tr} ${index % 2 === 0 ? styles.trEven : styles.trOdd}`}
              >
                <td className={`${styles.td} ${styles.cellTicker}`}>{row.name}</td>
                <td className={`${styles.td} ${styles.cellWeight}`}>
                  {(row.weight * 100).toFixed(3)}%
                </td>
                <td className={`${styles.td} ${styles.cellPrice}`}>
                  {currencyFormatter.format(row.latestPrice)}
                </td>
                <td className={`${styles.td} ${styles.cellContrib}`}>
                  {row.contribution.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}