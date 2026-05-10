import { useMemo, useEffect, useRef } from 'react';
import { useEtfAnalysis } from './hooks/useEtfAnalysis';
import { DragDropUploader } from './components/Uploader/DragDropUploader';
import { ReconstructedPriceChart } from './components/Charts/PriceChart';
import { TopHoldingsChart } from './components/Charts/TopHoldingsChart';
import { ConstituentsTable } from './components/Table/ConstituentsTable';
import { RotateCcw, Plus } from 'lucide-react';
import styles from './app.module.css';

export default function App() {
  const {
    data,
    isLoading,
    error,
    uploadFile,
    resetState,
    selectedIndex,
    setSelectedIndex
  } = useEtfAnalysis();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeETF = data ? data[selectedIndex] : null;

  // keyboard navigation for quick ETF switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (!data || data.length <= 1) return;

      if (e.key === 'ArrowRight') {
        setSelectedIndex(selectedIndex === data.length - 1 ? 0 : selectedIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        setSelectedIndex(selectedIndex === 0 ? data.length - 1 : selectedIndex - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, data, setSelectedIndex]);

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(Array.from(e.target.files));
      // clear value so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  const stats = useMemo(() => {
    if (!activeETF) return null;

    const timeSeries = activeETF.timeSeriesData;
    if (timeSeries.length === 0) return null;

    const firstPrice = timeSeries[0].reconstructedPrice;
    const lastPrice = timeSeries[timeSeries.length - 1].reconstructedPrice;
    const priceChange = lastPrice - firstPrice;
    const pctReturn = (priceChange / firstPrice) * 100;

    const tickerName = activeETF.filename.replace('.csv', '').split('-').pop() || 'UNKNOWN';

    return {
      tickerName,
      latestPrice: lastPrice,
      priceChange,
      percentageReturn: pctReturn,
      numConstituents: activeETF.tableData.length,
    };
  }, [activeETF]);

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div className={styles.appContainer}>
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        multiple
        style={{ display: 'none' }}
      />

      {!activeETF || !stats ? (
        <div className={styles.emptyState}>
          <div className={styles.titleArea}>
            <h1>BMO ETF Price Monitor</h1>
            <p>Upload target weights <code>csv</code> to synthesize historical metrics.</p>
          </div>
          <DragDropUploader
            onUpload={uploadFile}
            isLoading={isLoading}
            error={error}
          />
        </div>
      ) : (
        <>
          <div className={styles.topBar}>
            <div className={styles.brandTitle}>
              BMO ETF Price Monitor
            </div>
            
            <div className={styles.tabsContainer}>
              {data && data.map((etf, index) => {
                const name = etf.filename.replace('.csv', '').split('-').pop();
                return (
                  <button
                    key={index}
                    className={`${styles.tab} ${selectedIndex === index ? styles.activeTab : ''}`}
                    onClick={() => setSelectedIndex(index)}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
            
            <div className={styles.topActions}>
              {data && data.length > 1 && (
                <span className={styles.hint}>Tip: Use ← → keys</span>
              )}
              {/* Trigger the file input manually */}
              <button className={styles.actionButton} onClick={handleAddClick} disabled={isLoading}>
                <Plus size={12} />
                ADD ETF
              </button>
              <button className={styles.actionButton} onClick={resetState}>
                <RotateCcw size={12} />
                RESET
              </button>
            </div>
          </div>

          <div className={styles.kpiRow}>
            <div className={styles.kpiBlock}>
              <span className={styles.kpiLabel}>TICKER</span>
              <span className={styles.kpiValue}>{stats.tickerName}</span>
              <span className={styles.kpiSub}>Asset Class: EQUITY_ETF</span>
            </div>
            
            <div className={styles.kpiBlock}>
              <span className={styles.kpiLabel}>LAST</span>
              <span className={`${styles.kpiValue} ${stats.priceChange >= 0 ? styles.positiveText : styles.negativeText}`}>
                {currencyFormatter.format(stats.latestPrice)}
              </span>
              <span className={styles.kpiSub}>
                {stats.priceChange > 0 ? '+' : ''}{stats.priceChange.toFixed(2)}
              </span>
            </div>

            <div className={styles.kpiBlock}>
              <span className={styles.kpiLabel}>% Change</span>
              <span className={`${styles.kpiValue} ${stats.percentageReturn >= 0 ? styles.positiveText : styles.negativeText}`}>
                {stats.percentageReturn > 0 ? '+' : ''}{stats.percentageReturn.toFixed(2)}%
              </span>
              <span className={styles.kpiSub}>Period Performance</span>
            </div>

            <div className={styles.kpiBlock}>
              <span className={styles.kpiLabel}># of Constituents</span>
              <span className={styles.kpiValue}>{stats.numConstituents}</span>
              <span className={styles.kpiSub}>Indexed Constituents</span>
            </div>
          </div>

          <main className={styles.mainContent}>
            <div className={styles.chartsGrid}>
              <div className={styles.pane}>
                <ReconstructedPriceChart data={activeETF.timeSeriesData} />
              </div>
              <div className={styles.pane}>
                <TopHoldingsChart data={activeETF.topHoldings} />
              </div>
            </div>

            <div className={styles.tableSection}>
              <ConstituentsTable data={activeETF.tableData} />
            </div>
          </main>
        </>
      )}
    </div>
  );
}