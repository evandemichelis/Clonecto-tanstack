import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Sidebar from "../Sidebar";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("@/i18n/navigation", () => ({
  Link: ({
    children,
    href,
    onClick,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    onClick?: () => void;
    className?: string;
  }) => (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  ),
  usePathname: () => "/dashboard",
}));

describe("Sidebar", () => {
  it("renders the brand name", () => {
    render(<Sidebar />);
    expect(screen.getByText("Clonecto")).toBeInTheDocument();
  });

  it("renders all nav items", () => {
    render(<Sidebar />);
    expect(screen.getByText("nav.dashboard")).toBeInTheDocument();
    expect(screen.getByText("nav.invoices")).toBeInTheDocument();
    expect(screen.getByText("nav.expenses")).toBeInTheDocument();
    expect(screen.getByText("nav.clients")).toBeInTheDocument();
    expect(screen.getByText("nav.settings")).toBeInTheDocument();
  });

  it("logo link points to /dashboard", () => {
    render(<Sidebar />);
    const logoLink = screen.getByText("Clonecto").closest("a");
    expect(logoLink).toHaveAttribute("href", "/dashboard");
  });

  it("renders the mobile toggle button", () => {
    render(<Sidebar />);
    expect(
      screen.getByRole("button", { name: "Toggle menu" })
    ).toBeInTheDocument();
  });

  it("toggles mobile menu open and closed", async () => {
    render(<Sidebar />);
    const toggleBtn = screen.getByRole("button", { name: "Toggle menu" });
    await userEvent.click(toggleBtn);
    await userEvent.click(toggleBtn);
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<Sidebar />);
    expect(asFragment()).toMatchSnapshot();
  });
});
