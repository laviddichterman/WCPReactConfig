import { Grid, Button } from '@mui/material';

import { useCSVReader } from 'react-papaparse';
import { ParseResult } from "papaparse";

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
          <Grid item xs={4}>
            <Button variant="contained" {...getRootProps()} color="primary">
              Browse for CSV
            </Button>
          </Grid>
          <Grid item xs={5}>
            {acceptedFile && acceptedFile.name}
          </Grid>
          <Grid item xs={3}>
            <Button disabled={!acceptedFile} variant="contained" {...getRemoveFileProps()} color="primary">
              Remove
            </Button>
          </Grid>
          <Grid item xs={12}>
            <ProgressBar />
          </Grid>
        </Grid>
      )}
    </CSVReader>
  );
};

export default GenericCsvImportComponent;
