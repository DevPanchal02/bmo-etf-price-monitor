import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, AlertCircle, Loader2 } from "lucide-react";
import styles from './DragDropUploader.module.css'

interface DragDropUploaderProps{
    onUpload: (files: File[]) => void
    isLoading: boolean
    error: string | null
}

export function DragDropUploader({onUpload, isLoading, error}: DragDropUploaderProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0){
            onUpload(acceptedFiles)
        }
    }, [onUpload])

    const {getRootProps, getInputProps, isDragAccept, isDragReject} = useDropzone({
        onDrop,
        accept: {'text/csv' : ['.csv']},
        disabled: isLoading,
        multiple: true
    })
    
    let dropzoneClassName = styles.dropzone
    if (isDragAccept) dropzoneClassName += ` ${styles.isDragAccept}`;
    if (isDragReject) dropzoneClassName += ` ${styles.isDragReject}`;

    return (
    <div className={styles.container}>
      <div {...getRootProps({ className: dropzoneClassName })}>
        <input {...getInputProps()} />
        
        {isLoading ? (
          <Loader2 className={`${styles.icon} animate-spin`} style={{ animation: "spin 1s linear infinite" }} />
        ) : (
          <UploadCloud className={styles.icon} />
        )}
        
        <h2 className={styles.title}>
          {isLoading ? "Reconstructing Portfolio..." : "Upload ETF Weights"}
        </h2>
        
        <p className={styles.subtitle}>
          Drag and drop multiple .csv files here, or click to browse.
        </p>
        
        <button 
          className={styles.browseButton} 
          disabled={isLoading}
          type="button"
        >
          Select Files
        </button>
      </div>

      {/* Surface invalid file drops or server errors immediately */}
      {(isDragReject || error) && (
        <div className={styles.error}>
          <AlertCircle size={20} />
          <span>{error || "Only CSV files are accepted."}</span>
        </div>
      )}
    </div>
  );
}
