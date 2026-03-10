import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { getDefaultValues } from "./userForm.defaults";
import UserForm from "./UserForm";
import type { User } from "./types/types";

vi.mock("~/hooks/useI18n", () => ({
  useI18n: () => ({
    t: (key: string) => key,
    locale: "en",
  }),
}));

vi.mock("~/components", async () => {
  const React = await import("react");

  return {
    FormField: ({
      label,
      htmlFor,
      error,
      children,
    }: {
      label: string;
      htmlFor?: string;
      error?: string;
      children: React.ReactNode;
    }) => (
      <div>
        <label htmlFor={htmlFor}>{label}</label>
        {children}
        {error ? <p>{error}</p> : null}
      </div>
    ),

    Input: React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
      function Input(props, ref) {
        return <input ref={ref} {...props} />;
      },
    ),

    Select: ({
      options,
      value,
      onChange,
      placeholder,
      disabled,
    }: {
      options: Array<{ value: string; label: string }>;
      value?: string;
      onChange: (value: string) => void;
      placeholder?: string;
      disabled?: boolean;
    }) => (
      <select
        aria-label={placeholder || "select"}
        value={value ?? ""}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder || "Select a position..."}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ),

    AvatarPicker: ({
      valueUrl,
      valueFile,
    }: {
      valueUrl?: string | null;
      valueFile?: File | null;
      onChange: (file: File | null) => void;
      fallbackInitials?: string;
    }) => (
      <div>
        <span data-testid="avatar-url">{valueUrl ?? ""}</span>
        <span data-testid="avatar-file">{valueFile ? valueFile.name : ""}</span>
      </div>
    ),
    Checkbox: ({
      name,
      label,
      checked,
      onChange,
    }: {
      name?: string;
      label?: string;
      checked?: boolean;
      onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }) => (
      <label>
        <input type="checkbox" name={name} checked={checked} onChange={onChange} />
        {label}
      </label>
    ),
  };
});

const buildUser = (overrides: Partial<User> = {}): User =>
  ({
    id: 1,
    name: "Nahuel",
    email: "nahuel@test.com",
    phone: "2231234567",
    primaryPosition: "GK",
    secondaryPosition: "DF",
    avatarFilename: "avatar.png",
    ...overrides,
  }) as User;

describe("getDefaultValues", () => {
  it("returns empty values when user is null", () => {
    expect(getDefaultValues(null)).toEqual({
      name: "",
      email: "",
      phone: "",
      primaryPosition: "",
      secondaryPosition: "",
      password: "",
      passwordConfirm: "",
      avatar: null,
      generatePassword: true,
    });
  });

  it("returns mapped values when user exists", () => {
    const user = buildUser();

    expect(getDefaultValues(user)).toEqual({
      name: "Nahuel",
      email: "nahuel@test.com",
      phone: "2231234567",
      primaryPosition: "GK",
      secondaryPosition: "DF",
      password: "",
      passwordConfirm: "",
      avatar: null,
    });
  });

  it("falls back to empty string when a field is missing", () => {
    const user = buildUser({
      email: undefined,
      phone: undefined,
      primaryPosition: undefined,
      secondaryPosition: undefined,
    });

    expect(getDefaultValues(user)).toEqual({
      name: "Nahuel",
      email: "",
      phone: "",
      primaryPosition: "",
      secondaryPosition: "",
      password: "",
      passwordConfirm: "",
      avatar: null,
    });
  });
});

describe("UserForm", () => {
  it("shows user data in edit mode", async () => {
    const user = buildUser();

    render(<UserForm id="user-form" user={user} onSubmit={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByLabelText("user.name")).toHaveValue("Nahuel");
      expect(screen.getByLabelText("auth.email.label")).toHaveValue("nahuel@test.com");
      expect(screen.getByLabelText("user.phone")).toHaveValue("2231234567");
    });

    const selects = screen.getAllByRole("combobox");
    expect(selects[0]).toHaveValue("GK");
    expect(selects[1]).toHaveValue("DF");

    expect(screen.getByTestId("avatar-url")).toHaveTextContent("avatar.png");
  });

  it("updates form values when user prop changes", async () => {
    const firstUser = buildUser({
      id: 1,
      name: "Nahuel",
      email: "nahuel@test.com",
      phone: "111111",
      primaryPosition: "GK",
      secondaryPosition: "DF",
      avatarFilename: "avatar-1.png",
    });

    const secondUser = buildUser({
      id: 2,
      name: "Juan",
      email: "juan@test.com",
      phone: "222222",
      primaryPosition: "MD",
      secondaryPosition: "FW",
      avatarFilename: "avatar-2.png",
    });

    const { rerender } = render(<UserForm id="user-form" user={firstUser} onSubmit={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByLabelText("user.name")).toHaveValue("Nahuel");
    });

    rerender(<UserForm id="user-form" user={secondUser} onSubmit={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByLabelText("user.name")).toHaveValue("Juan");
      expect(screen.getByLabelText("auth.email.label")).toHaveValue("juan@test.com");
      expect(screen.getByLabelText("user.phone")).toHaveValue("222222");
    });

    const selects = screen.getAllByRole("combobox");
    expect(selects[0]).toHaveValue("MD");
    expect(selects[1]).toHaveValue("FW");

    expect(screen.getByTestId("avatar-url")).toHaveTextContent("avatar-2.png");
  });

  it("shows password fields when generatePassword is unchecked", async () => {
    render(<UserForm id="user-form" user={null} onSubmit={vi.fn()} />);

    const checkbox = screen.getByLabelText("user.generatePassword");
    fireEvent.click(checkbox);

    expect(screen.getByLabelText("auth.password.label")).toBeInTheDocument();
    expect(screen.getByLabelText("auth.passwordConfirm")).toBeInTheDocument();
  });

  it("submits correct payload when form is submitted", async () => {
    const onSubmit = vi.fn();

    render(<UserForm id="user-form" user={null} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("user.name"), {
      target: { value: "Nahuel" },
    });

    fireEvent.change(screen.getByLabelText("auth.email.label"), {
      target: { value: "nahuel@test.com" },
    });

    fireEvent.change(screen.getByLabelText("user.phone"), {
      target: { value: "2231234567" },
    });

    fireEvent.change(screen.getAllByRole("combobox")[0], {
      target: { value: "GK" },
    });

    fireEvent.change(screen.getAllByRole("combobox")[1], {
      target: { value: "DF" },
    });

    fireEvent.submit(document.getElementById("user-form")!);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        {
          name: "Nahuel",
          email: "nahuel@test.com",
          phone: "2231234567",
          primaryPosition: "GK",
          secondaryPosition: "DF",
          password: "",
          passwordConfirm: "",
          avatar: null,
          generatePassword: true,
        },
        expect.anything(),
      );
    });
  });

  it("submits manual passwords when generatePassword is unchecked", async () => {
    const onSubmit = vi.fn();

    render(<UserForm id="user-form" user={null} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("user.name"), {
      target: { value: "Nahuel" },
    });

    fireEvent.change(screen.getByLabelText("auth.email.label"), {
      target: { value: "nahuel@test.com" },
    });

    fireEvent.change(screen.getByLabelText("user.phone"), {
      target: { value: "2231234567" },
    });

    fireEvent.change(screen.getAllByRole("combobox")[0], {
      target: { value: "GK" },
    });

    fireEvent.change(screen.getAllByRole("combobox")[1], {
      target: { value: "DF" },
    });

    fireEvent.click(screen.getByLabelText("user.generatePassword"));

    fireEvent.change(screen.getByLabelText("auth.password.label"), {
      target: { value: "secret123" },
    });

    fireEvent.change(screen.getByLabelText("auth.passwordConfirm"), {
      target: { value: "secret123" },
    });

    fireEvent.submit(document.getElementById("user-form")!);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        {
          name: "Nahuel",
          email: "nahuel@test.com",
          phone: "2231234567",
          primaryPosition: "GK",
          secondaryPosition: "DF",
          password: "secret123",
          passwordConfirm: "secret123",
          avatar: null,
          generatePassword: false,
        },
        expect.anything(),
      );
    });
  });
});
