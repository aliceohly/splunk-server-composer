import { render, screen, fireEvent, within, act } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";

describe("App", () => {
  it("should display header, labels and submit button", () => {
    render(<App />);
    expect(screen.getByText("Server Composer")).toBeInTheDocument();
    expect(screen.getByLabelText(/CPU/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Memory Size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/GPU Accelerator Card/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
  });

  it("should display CPU dropdown", async () => {
    render(<App />);
    expect(await screen.findByRole("combobox")).toBeInTheDocument();
  });

  it("should display CPU dropdown menu items", async () => {
    render(<App />);
    const cpuDropdown = within(
      await screen.findByTestId("cpu-select")
    ).getByRole("combobox");

    act(() => {
      userEvent.click(cpuDropdown);
    });

    expect(await screen.findByTestId("cpu-x86")).toBeInTheDocument();
    expect(await screen.findByTestId("cpu-power")).toBeInTheDocument();
    expect(await screen.findByTestId("cpu-arm")).toBeInTheDocument();
  });

  it("should display CPU dropdown selected value, default value is X86", async () => {
    render(<App />);
    const cpuDropdownContainer = await screen.findByTestId("cpu-select");
    expect(within(cpuDropdownContainer).getByText("X86")).toBeInTheDocument();
    const cpuDropdown = within(cpuDropdownContainer).getByRole("combobox");

    userEvent.click(cpuDropdown);
    userEvent.click(await screen.findByTestId("cpu-power"));
    expect(within(cpuDropdownContainer).getByText("Power")).toBeInTheDocument();
  });

  it("should show updated memory size when changed", () => {
    render(<App />);
    const memoryInput = screen.getByLabelText(/Memory Size/i);

    act(() => {
      fireEvent.change(memoryInput, { target: { value: "4096" } });
    });
    expect(memoryInput).toHaveValue("4,096");
  });

  it("should show updated GPU accelerator when toggled", () => {
    render(<App />);
    const gpuCheckbox = screen.getByLabelText(/GPU Accelerator Card/i);

    act(() => {
      fireEvent.click(gpuCheckbox);
    });
    expect(gpuCheckbox).toBeChecked();
  });

  it("should show error for invalid memory size", () => {
    render(<App />);
    const memoryInput = screen.getByLabelText(/Memory Size/i);
    const submitButton = screen.getByRole("button", { name: /Submit/i });

    act(() => {
      fireEvent.change(memoryInput, { target: { value: "3000" } });
      fireEvent.click(submitButton);
    });

    expect(
      screen.getByText(/Memory size must be a power of 2/i)
    ).toBeInTheDocument();
  });

  it("should evaluate configuration and show results", async () => {
    render(<App />);
    const memoryInput = screen.getByLabelText(/Memory Size/i);
    const submitButton = screen.getByRole("button", { name: /Submit/i });
    const cpuDropdownContainer = await screen.findByTestId("cpu-select");
    const cpuDropdown = within(cpuDropdownContainer).getByRole("combobox");
    userEvent.click(cpuDropdown);
    userEvent.click(screen.getByTestId("cpu-power"));

    act(() => {
      fireEvent.change(memoryInput, { target: { value: "131072" } });
      fireEvent.click(submitButton);
    });

    expect(screen.getByText(/Server Model Options/i)).toBeInTheDocument();
    expect(screen.getByText(/Rules Applied/i)).toBeInTheDocument();
  });

  it("should show no options for invalid configuration", async () => {
    render(<App />);
    const memoryInput = screen.getByLabelText(/Memory Size/i);
    const submitButton = screen.getByRole("button", { name: /Submit/i });
    const cpuDropdownContainer = await screen.findByTestId("cpu-select");
    const cpuDropdown = within(cpuDropdownContainer).getByRole("combobox");
    userEvent.click(cpuDropdown);
    userEvent.click(screen.getByTestId("cpu-power"));

    act(() => {
      fireEvent.change(memoryInput, { target: { value: "1024" } });
      fireEvent.click(submitButton);
    });

    expect(screen.getByTestId("no-options")).toBeInTheDocument();
  });
});
