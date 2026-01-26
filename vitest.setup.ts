import "@testing-library/jest-dom";
import { vi } from "vitest";

export const navigateMock = vi.fn();
export const showToastMock = vi.fn();
export const tMock = (key: string) => key;

vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>("react-router");
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useParams: () => ({ locale: "en" }),
  };
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: tMock,
  }),
}));

vi.mock("~/routes/$locale", () => ({
  useI18n: () => ({
    t: (key: string) => key,
    locale: "en",
  }),
}));

vi.mock("~/helpers/showToast", () => ({
  showToast: showToastMock,
}));
