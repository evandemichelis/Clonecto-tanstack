import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InvoiceForm from "../InvoiceForm";
import { Invoice } from "@/types";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("@/lib/queries/invoices", () => ({
  useInvoices: () => ({ data: [] }),
  useAddInvoice: () => ({ mutateAsync: jest.fn().mockResolvedValue({}) }),
  useUpdateInvoice: () => ({ mutateAsync: jest.fn().mockResolvedValue({}) }),
}));

jest.mock("@/lib/utils", () => ({
  generateInvoiceNumber: () => "FA-2026-001",
  computeAmounts: (subtotal: number, vatRate: number) => ({
    vat: (subtotal * vatRate) / 100,
    total: subtotal + (subtotal * vatRate) / 100,
  }),
  formatCurrency: (n: number) => `${n.toFixed(2)} €`,
  today: () => "2026-03-30",
  dateIn: () => "2026-04-29",
}));

const mockInvoice: Invoice = {
  id: "1",
  number: "FA-2026-001",
  clientName: "Acme Corp",
  date: "2026-03-30",
  dueDate: "2026-04-29",
  subtotal: 1000,
  vatRate: 20,
  vat: 200,
  total: 1200,
  status: "to_send",
  notes: "Projet web",
};

describe("InvoiceForm", () => {
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create mode", () => {
    it("renders the create title", () => {
      render(<InvoiceForm onClose={onClose} />);
      expect(screen.getByText("invoices.form.title")).toBeInTheDocument();
    });

    it("renders create button", () => {
      render(<InvoiceForm onClose={onClose} />);
      expect(screen.getByRole("button", { name: "common.create" })).toBeInTheDocument();
    });

    it("renders cancel button", () => {
      render(<InvoiceForm onClose={onClose} />);
      expect(screen.getByRole("button", { name: "common.cancel" })).toBeInTheDocument();
    });

    it("calls onClose when cancel is clicked", async () => {
      render(<InvoiceForm onClose={onClose} />);
      await userEvent.click(screen.getByRole("button", { name: "common.cancel" }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("matches snapshot", () => {
      const { asFragment } = render(<InvoiceForm onClose={onClose} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe("edit mode", () => {
    it("renders the edit title", () => {
      render(<InvoiceForm onClose={onClose} invoice={mockInvoice} />);
      expect(screen.getByText("invoices.form.editTitle")).toBeInTheDocument();
    });

    it("pre-fills client name", () => {
      render(<InvoiceForm onClose={onClose} invoice={mockInvoice} />);
      expect(screen.getByDisplayValue("Acme Corp")).toBeInTheDocument();
    });

    it("pre-fills subtotal", () => {
      render(<InvoiceForm onClose={onClose} invoice={mockInvoice} />);
      expect(screen.getByDisplayValue("1000")).toBeInTheDocument();
    });

    it("renders edit button", () => {
      render(<InvoiceForm onClose={onClose} invoice={mockInvoice} />);
      expect(screen.getByRole("button", { name: "common.edit" })).toBeInTheDocument();
    });

    it("matches snapshot", () => {
      const { asFragment } = render(
        <InvoiceForm onClose={onClose} invoice={mockInvoice} />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  it("updates client name field on input", async () => {
    render(<InvoiceForm onClose={onClose} />);
    const input = screen.getByPlaceholderText("invoices.form.clientPlaceholder");
    await userEvent.type(input, "Nouveau Client");
    expect(input).toHaveValue("Nouveau Client");
  });
});
