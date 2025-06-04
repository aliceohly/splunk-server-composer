import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  Divider,
  Alert,
} from '@mui/material';
import { CPUType, ServerConfiguration, ServerEvaluationResult } from './types/server';
import { evaluateServerConfiguration, validateMemorySize } from './reducers/serverReducer';

function App() {
  const [config, setConfig] = useState<ServerConfiguration>({
    cpu: 'X86',
    memorySize: 4096,
    hasGpuAccelerator: false,
  });
  const [result, setResult] = useState<ServerEvaluationResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate memory size
    if (!validateMemorySize(config.memorySize)) {
      setError('Memory size must be a power of 2 between 2,048MB and 8,388,608MB');
      return;
    }

    const evaluationResult = evaluateServerConfiguration(config);
    setResult(evaluationResult);
  };

  const handleMemoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value.replace(/,/g, ''), 10);
    if (!isNaN(value)) {
      setConfig({ ...config, memorySize: value });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Server Model Composer
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>CPU</InputLabel>
              <Select
                value={config.cpu}
                label="CPU"
                onChange={(e) => setConfig({ ...config, cpu: e.target.value as CPUType })}
              >
                <MenuItem value="X86">X86</MenuItem>
                <MenuItem value="Power">Power</MenuItem>
                <MenuItem value="ARM">ARM</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Memory Size (MB)"
              value={config.memorySize.toLocaleString()}
              onChange={handleMemoryChange}
              sx={{ mb: 2 }}
              helperText="Must be a power of 2 between 2,048MB and 8,388,608MB"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={config.hasGpuAccelerator}
                  onChange={(e) => setConfig({ ...config, hasGpuAccelerator: e.target.checked })}
                />
              }
              label="GPU Accelerator Card"
            />
          </Box>

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {result && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom>
              Results
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Available Models:</strong>{' '}
              {result.models.length > 0 ? result.models.join(' or ') : 'No Options'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Reason:</strong> {result.reason}
            </Typography>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default App;
