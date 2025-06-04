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
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { ServerConfiguration, ServerEvaluationResult } from './types/server';
import { CpuType } from './types/cpu';
import { evaluateServerConfiguration, validateMemorySize } from './reducers/serverReducer';

function App() {
  const [config, setConfig] = useState<ServerConfiguration>({
    cpu: CpuType.X86,
    memorySize: 2048,
    hasGpuAccelerator: false,
  });
  const [result, setResult] = useState<ServerEvaluationResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate memory size
    if (!validateMemorySize(config.memorySize)) setError('Memory size must be a power of 2 between 2,048MB and 8,388,608MB');

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
          Server Composer
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>CPU</InputLabel>
              <Select
                value={config.cpu}
                label="CPU Type"
                onChange={(e) => setConfig({ ...config, cpu: e.target.value as CpuType })}
              >
                <MenuItem value={CpuType.X86}>X86</MenuItem>
                <MenuItem value={CpuType.Power}>Power</MenuItem>
                <MenuItem value={CpuType.ARM}>ARM</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Memory Size"
              value={config.memorySize.toLocaleString()}
              onChange={handleMemoryChange}
              sx={{ mb: 2 }}
              helperText="Must be a power of 2 between 2,048MB and 8,388,608MB"
              slotProps={{
                input: {
                  endAdornment: <span style={{ marginLeft: '8px', color: 'rgba(0, 0, 0, 0.87)' }}>MB</span>,
                }
              }}
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
            <Typography variant="body1" gutterBottom>
              <strong>Server Model Options</strong>
            </Typography>
            <List dense sx={{ listStyleType: 'disc', pl: 5 }}>
              {result.models.length > 0 ? (
                result.models.map((model, index) => (
                  <ListItem key={index} sx={{ display: 'list-item' }}>
                    <ListItemText primary={model} />
                  </ListItem>
                ))
              ) : (
                <ListItem sx={{ display: 'list-item' }}>
                  <ListItemText primary="No Options" />
                </ListItem>
              )}
            </List>
            <Typography variant="body1">
              <strong>Rules Applied</strong>
            </Typography>
            <List dense sx={{ listStyleType: 'disc', pl: 5 }}>
              {result.reasons.map((rule, index) => (
                <ListItem key={index} sx={{ display: 'list-item' }}>
                  <ListItemText primary={rule} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default App;
