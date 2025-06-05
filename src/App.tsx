import React, { useState } from "react";
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
  SelectChangeEvent,
} from "@mui/material";
import { ServerComposition, CpuType, ServerComposerResult } from "./types";
import { runServerComposer, validateMemorySize } from "./utils";

function App() {
  const cpuTypes: CpuType[] = ["X86", "Power", "ARM"];

  const [serverComposition, setServerComposition] = useState<ServerComposition>(
    {
      cpu: cpuTypes[0],
      memorySize: 2048,
      hasGpuAccelerator: false,
    }
  );
  const [result, setResult] = useState<ServerComposerResult | null>(null);
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateMemorySize(serverComposition.memorySize))
      setError(
        "Memory size must be a power of 2 between 2,048MB and 8,388,608MB"
      );

    const serverComposerResult = runServerComposer(serverComposition);
    setResult(serverComposerResult);
  };

  const handleMemoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    if (value === "") {
      setServerComposition({ ...serverComposition, memorySize: 0 });
    } else {
      const memorySize = parseInt(value, 10);
      if (!isNaN(memorySize)) {
        setServerComposition({ ...serverComposition, memorySize: memorySize });
      }
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
              <InputLabel id="cpu-label">CPU</InputLabel>
              <Select
                data-testid="cpu-select"
                labelId="cpu-label"
                value={serverComposition.cpu}
                label="CPU"
                onChange={(e: SelectChangeEvent<CpuType>) =>
                  setServerComposition({
                    ...serverComposition,
                    cpu: e.target.value,
                  })
                }
              >
                {cpuTypes.map((cpuType) => (
                  <MenuItem
                    key={cpuType}
                    value={cpuType}
                    data-testid={`cpu-${cpuType.toLowerCase()}`}
                  >
                    {cpuType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Memory Size"
              value={
                serverComposition.memorySize === 0
                  ? ""
                  : serverComposition.memorySize.toLocaleString()
              }
              onChange={handleMemoryChange}
              sx={{ mb: 2 }}
              helperText="Must be a power of 2 between 2,048MB and 8,388,608MB"
              slotProps={{
                input: {
                  endAdornment: (
                    <span
                      style={{
                        marginLeft: "8px",
                        color: "rgba(0, 0, 0, 0.87)",
                      }}
                    >
                      MB
                    </span>
                  ),
                },
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={serverComposition.hasGpuAccelerator}
                  onChange={(e) =>
                    setServerComposition({
                      ...serverComposition,
                      hasGpuAccelerator: e.target.checked,
                    })
                  }
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
            <List dense sx={{ listStyleType: "disc", pl: 5 }}>
              {result.models.length > 0 ? (
                result.models.map((model) => (
                  <ListItem
                    key={model}
                    sx={{ display: "list-item" }}
                    data-testid={`model-option-${model.toLowerCase().replace(/\s+/g, "")}`}
                  >
                    <ListItemText primary={model} />
                  </ListItem>
                ))
              ) : (
                <ListItem sx={{ display: "list-item" }}>
                  <ListItemText primary="No Options" data-testid="no-options" />
                </ListItem>
              )}
            </List>
            <Typography variant="body1">
              <strong>Rules Applied</strong>
            </Typography>
            <List dense sx={{ listStyleType: "disc", pl: 5 }}>
              {result.reasons.map((rule, index) => (
                <ListItem key={index} sx={{ display: "list-item" }}>
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
