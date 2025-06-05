import {
  render,
  screen,
  fireEvent,
  within,
  act,
  waitFor,
} from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";

describe("App", () => {
  let memoryInput: HTMLElement;
  let submitButton: HTMLElement;
  let cpuDropdownContainer: HTMLElement;
  let cpuDropdown: HTMLElement;

  beforeEach(async () => {
    render(<App />);
    cpuDropdownContainer = await screen.findByTestId("cpu-select");
    cpuDropdown = within(cpuDropdownContainer).getByRole("combobox");
    memoryInput = screen.getByLabelText(/Memory Size/i);
    submitButton = screen.getByRole("button", { name: /Submit/i });
  });

  it("should display header, labels and submit button", () => {
    // Assert
    expect(screen.getByText("Server Composer")).toBeInTheDocument();
    expect(screen.getByLabelText(/CPU/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Memory Size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/GPU Accelerator Card/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
  });

  it("should display CPU dropdown", async () => {
    // Assert
    expect(await screen.findByRole("combobox")).toBeInTheDocument();
  });

  it("should display CPU dropdown menu items", async () => {
    // Arrange
    const cpuDropdown = within(
      await screen.findByTestId("cpu-select")
    ).getByRole("combobox");

    // Act
    userEvent.click(cpuDropdown);

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId("cpu-x86")).toBeInTheDocument();
      expect(screen.getByTestId("cpu-power")).toBeInTheDocument();
      expect(screen.getByTestId("cpu-arm")).toBeInTheDocument();
    });
  });

  it("should update CPU selection from X86 to Power when clicked", async () => {
    // Assert
    expect(within(cpuDropdownContainer).getByText("X86")).toBeInTheDocument();

    // Act
    userEvent.click(cpuDropdown);
    userEvent.click(await screen.findByTestId("cpu-power"));

    // Assert
    await waitFor(() => {
      expect(
        within(cpuDropdownContainer).getByText("Power")
      ).toBeInTheDocument();
    });
  });

  it("should show updated memory size when changed", () => {
    // Act
    act(() => {
      fireEvent.change(memoryInput, { target: { value: "4096" } });
    });

    // Assert
    expect(memoryInput).toHaveValue("4,096");
  });

  it("should show error for invalid memory size", () => {
    // Act
    act(() => {
      fireEvent.change(memoryInput, { target: { value: "3000" } });
      fireEvent.click(submitButton);
    });

    // Assert
    expect(
      screen.getByText(/Memory size must be a power of 2/i)
    ).toBeInTheDocument();
  });

  it("should evaluate composition and show results", async () => {
    // Act
    userEvent.click(cpuDropdown);
    userEvent.click(screen.getByTestId("cpu-power"));
    act(() => {
      fireEvent.change(memoryInput, { target: { value: "131072" } });
      fireEvent.click(submitButton);
    });

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/Server Model Options/i)).toBeInTheDocument();
      expect(screen.getByText(/Rules Applied/i)).toBeInTheDocument();
      expect(screen.getByTestId("model-option-mainframe")).toBeInTheDocument();
      expect(
        screen.getByTestId("model-option-4urackserver")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("model-option-towerserver")
      ).toBeInTheDocument();
      expect(screen.getByText(/Rule 2/i)).toBeInTheDocument();
      expect(screen.getByText(/Rule 3/i)).toBeInTheDocument();
    });
  });

  it("should show no options for invalid composition", async () => {
    // Act
    userEvent.click(cpuDropdown);
    userEvent.click(screen.getByTestId("cpu-power"));
    act(() => {
      fireEvent.change(memoryInput, { target: { value: "1024" } });
      fireEvent.click(submitButton);
    });

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId("no-options")).toBeInTheDocument();
    });
  });

  it("should handle multiple GPU toggles correctly", () => {
    const gpuCheckbox = screen.getByLabelText(/GPU Accelerator Card/i);

    act(() => {
      fireEvent.click(gpuCheckbox);
    });
    expect(gpuCheckbox).toBeChecked();

    act(() => {
      fireEvent.click(gpuCheckbox);
    });
    expect(gpuCheckbox).not.toBeChecked();

    act(() => {
      fireEvent.click(gpuCheckbox);
    });
    expect(gpuCheckbox).toBeChecked();
  });

  it("should show error message when submitting with invalid memory size", () => {
    act(() => {
      fireEvent.change(memoryInput, { target: { value: "3000" } });
      fireEvent.click(submitButton);
    });

    expect(
      screen.getByText(/Memory size must be a power of 2/i)
    ).toBeInTheDocument();

    act(() => {
      fireEvent.change(memoryInput, { target: { value: "4096" } });
      fireEvent.click(submitButton);
    });

    expect(
      screen.queryByText(/Memory size must be a power of 2/i)
    ).not.toBeInTheDocument();
  });
});
