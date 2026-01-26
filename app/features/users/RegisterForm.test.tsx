import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, vi } from "vitest";
import RegisterForm from "./RegisterForm";
import { navigateMock, showToastMock } from "../../../vitest.setup";
import type { CreateUserPayload } from "~/features/users/types/types";
const mutateMock = vi.fn<(payload: CreateUserPayload) => void>();

// 👇 usa el MISMO path que en RegisterForm
vi.mock("~/hooks/useCreateUser", () => ({
  useCreateUser: () => ({
    // simulamos el mutate de react-query:
    mutate: (
      payload: CreateUserPayload,
      options?: { onSuccess?: () => void; onError?: (err: unknown) => void },
    ) => {
      mutateMock(payload);
      options?.onSuccess?.();
    },
    isPending: false,
  }),
}));

describe("RegisterForm", () => {
  beforeEach(() => {
    mutateMock.mockReset();
    navigateMock.mockReset();
  });

  it("Show validation errors when form is empty", async () => {
    render(<RegisterForm />);

    const submitButton = screen.getByRole("button", { name: "auth.lestGo" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });

    expect(mutateMock).not.toHaveBeenCalled();
  });

  it("Call mutation when form data is valid ", async () => {
    render(<RegisterForm />);

    const nameInput = screen.getByPlaceholderText("auth.name");
    const emailInput = screen.getByPlaceholderText("auth.email.placeholder");
    const passwordInput = screen.getByPlaceholderText("auth.password.placeholder");
    const passwordConfirmInput = screen.getByPlaceholderText("auth.passwordConfirm");
    const phoneInput = screen.getByPlaceholderText("auth.phone");

    const submitButton = screen.getByRole("button", { name: "auth.lestGo" });

    fireEvent.change(nameInput, { target: { value: "nahuel" } });
    fireEvent.change(emailInput, { target: { value: "nahuel@mail.com" } });
    fireEvent.change(phoneInput, { target: { value: "123456789" } });
    fireEvent.change(passwordInput, { target: { value: "secret123" } });
    fireEvent.change(passwordConfirmInput, { target: { value: "secret123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledTimes(1);
    });

    const [payload] = mutateMock.mock.calls[0];

    expect(payload).toEqual({
      name: "nahuel",
      email: "nahuel@mail.com",
      phone: "123456789",
      password: "secret123",
      passwordConfirm: "secret123",
    });
    console.log("navigate calls:", navigateMock.mock.calls);
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/en/auth/login");
      expect(showToastMock).toHaveBeenCalled();
    });
  });
});
