import { type ParseResult } from "papaparse";
import { useCSVReader } from 'react-papaparse';

import { Button, Grid } from '@mui/material';

interface CSVReaderProps<T> { 
  onAccepted: (data: ParseResult<T>) => void;
};

function GenericCsvImportComponent<T>({ onAccepted }: CSVReaderProps<T>) {
  const { CSVReader } = useCSVReader();
  return (
    <CSVReader
      onUploadAccepted={onAccepted}
      config={{ header: true }}
    >
      {({
        getRootProps,
        acceptedFile,
        ProgressBar,
        getRemoveFileProps,
      }: any) => (
        <Grid container>
          <Grid size={4}>
            <Button variant="contained" {...getRootProps()} color="primary">
              Browse for CSV
            </Button>
          </Grid>
          <Grid size={5}>
            {acceptedFile && acceptedFile.name}
          </Grid>
          <Grid size={3}>
            <Button disabled={!acceptedFile} variant="contained" {...getRemoveFileProps()} color="primary">
              Remove
            </Button>
          </Grid>
          <Grid size={12}>
            <ProgressBar />
          </Grid>
        </Grid>
      )}
    </CSVReader>
  );
};

export default GenericCsvImportComponent;
