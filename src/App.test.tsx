import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App Component', () => {
  test('renders server model composer title', () => {
    render(<App />);
    expect(screen.getByText('Server Model Composer')).toBeInTheDocument();
  });

  test('shows error for invalid memory size', async () => {
    render(<App />);
    
    const memoryInput = screen.getByLabelText('Memory Size (MB)');
    await userEvent.clear(memoryInput);
    await userEvent.type(memoryInput, '3072');
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/memory size must be a power of 2/i)).toBeInTheDocument();
  });

  test('shows correct server models for valid configuration', async () => {
    render(<App />);
    
    // Select Power CPU
    const cpuSelect = screen.getByLabelText('CPU Type');
    fireEvent.mouseDown(cpuSelect);
    fireEvent.click(screen.getByText('Power'));
    
    // Enter valid memory size
    const memoryInput = screen.getByLabelText('Memory Size (MB)');
    await userEvent.clear(memoryInput);
    await userEvent.type(memoryInput, '262144');
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);
    
    // Check results
    expect(screen.getByText(/Tower Server or 4U Rack Server or Mainframe/i)).toBeInTheDocument();
  });

  test('shows High Density Server for GPU configuration', async () => {
    render(<App />);
    
    // Select ARM CPU
    const cpuSelect = screen.getByLabelText('CPU Type');
    fireEvent.mouseDown(cpuSelect);
    fireEvent.click(screen.getByText('ARM'));
    
    // Enter valid memory size
    const memoryInput = screen.getByLabelText('Memory Size (MB)');
    await userEvent.clear(memoryInput);
    await userEvent.type(memoryInput, '524288');
    
    // Check GPU checkbox
    const gpuCheckbox = screen.getByLabelText('GPU Accelerator Card');
    fireEvent.click(gpuCheckbox);
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);
    
    // Check results
    expect(screen.getByText(/High Density Server/i)).toBeInTheDocument();
  });
}); 