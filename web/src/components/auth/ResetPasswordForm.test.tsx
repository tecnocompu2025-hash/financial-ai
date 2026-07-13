import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, test, vi } from "vitest";

import ResetPasswordForm from "./ResetPasswordForm";
import { confirmPasswordReset } from "../../services/financial.service";

vi.mock("../../services/financial.service", () => ({
  confirmPasswordReset: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function renderForm(token = "a".repeat(20)) {
  return render(<MemoryRouter initialEntries={[`/reset-password?token=${token}`]}><ResetPasswordForm /></MemoryRouter>);
}

test("rejects non-matching passwords before calling the API", () => {
  renderForm();
  fireEvent.change(screen.getByPlaceholderText("Nueva contraseña"), { target: { value: "Secure123" } });
  fireEvent.change(screen.getByPlaceholderText("Confirmar contraseña"), { target: { value: "Different123" } });
  fireEvent.click(screen.getByRole("button", { name: "Restablecer contraseña" }));
  expect(screen.getByText("Las contraseñas no coinciden.")).toBeTruthy();
  expect(confirmPasswordReset).not.toHaveBeenCalled();
});

test("sends a valid token and password", async () => {
  vi.mocked(confirmPasswordReset).mockResolvedValue({ message: "Contraseña restablecida correctamente." });
  renderForm("valid-token-1234567890");
  fireEvent.change(screen.getByPlaceholderText("Nueva contraseña"), { target: { value: "Secure123" } });
  fireEvent.change(screen.getByPlaceholderText("Confirmar contraseña"), { target: { value: "Secure123" } });
  fireEvent.click(screen.getByRole("button", { name: "Restablecer contraseña" }));
  expect(await screen.findByText("Contraseña restablecida correctamente.")).toBeTruthy();
  expect(confirmPasswordReset).toHaveBeenCalledWith("valid-token-1234567890", "Secure123", "Secure123");
});
