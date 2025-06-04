import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { CpuType } from './types/cpu';

describe('App', () => {
  it('renders the form with initial values', () => {
    render(<App />);
    
    // Check if the form elements are rendered
    expect(screen.getByText('Server Composer')).toBeInTheDocument();
    expect(screen.getByLabelText(/CPU/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Memory Size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/GPU Accelerator Card/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  it('updates CPU type when selected', () => {
    render(<App />);
    const cpuSelect = screen.getByLabelText(/CPU/i);
    
    fireEvent.change(cpuSelect, { target: { value: CpuType.Power } });
    expect(cpuSelect).toHaveValue(CpuType.Power);
  });

  it('updates memory size when changed', () => {
    render(<App />);
    const memoryInput = screen.getByLabelText(/Memory Size/i);
    
    fireEvent.change(memoryInput, { target: { value: '4096' } });
    expect(memoryInput).toHaveValue(4096);
  });

  it('updates GPU accelerator when toggled', () => {
    render(<App />);
    const gpuCheckbox = screen.getByLabelText(/GPU Accelerator Card/i);
    
    fireEvent.click(gpuCheckbox);
    expect(gpuCheckbox).toBeChecked();
  });

  it('shows error for invalid memory size', () => {
    render(<App />);
    const memoryInput = screen.getByLabelText(/Memory Size/i);
    const submitButton = screen.getByRole('button', { name: /Submit/i });
    
    // Set invalid memory size (not a power of 2)
    fireEvent.change(memoryInput, { target: { value: '3000' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/Memory size must be a power of 2/i)).toBeInTheDocument();
  });

  it('evaluates configuration and shows results', () => {
    render(<App />);
    const cpuSelect = screen.getByLabelText(/CPU/i);
    const memoryInput = screen.getByLabelText(/Memory Size/i);
    const submitButton = screen.getByRole('button', { name: /Submit/i });
    
    // Set valid configuration
    fireEvent.change(cpuSelect, { target: { value: CpuType.Power } });
    fireEvent.change(memoryInput, { target: { value: '131072' } });
    fireEvent.click(submitButton);
    
    // Check if results are displayed
    expect(screen.getByText(/Server Model Options/i)).toBeInTheDocument();
    expect(screen.getByText(/Rules Applied/i)).toBeInTheDocument();
  });

  it('shows no options for invalid configuration', () => {
    render(<App />);
    const cpuSelect = screen.getByLabelText(/CPU/i);
    const memoryInput = screen.getByLabelText(/Memory Size/i);
    const gpuCheckbox = screen.getByLabelText(/GPU Accelerator Card/i);
    const submitButton = screen.getByRole('button', { name: /Submit/i });
    
    // Set invalid configuration (GPU with non-ARM CPU)
    fireEvent.change(cpuSelect, { target: { value: CpuType.X86 } });
    fireEvent.change(memoryInput, { target: { value: '524288' } });
    fireEvent.click(gpuCheckbox);
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/No Options/i)).toBeInTheDocument();
  });
}); 