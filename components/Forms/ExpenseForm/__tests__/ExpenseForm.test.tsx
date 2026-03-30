import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExpenseForm from "../ExpenseForm";
import { Expense } from "@/types";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("@/lib/queries/expenses", () => ({
  useAddExpense: () => ({ mutateAsync: jest.fn().mockResolvedValue({}) }),
  useUpdateExpense: () => ({ mutateAsync: jest.fn().mockResolvedValue({}) }),
}));

jest.mock("@/lib/utils", () => ({
  computeAmounts: (subtotal: number, vatRate: number) => ({
    vat: (subtotal * vatRate) / 100,
    total: subtotal + (subtotal * vatRate) / 100,
  }),
  formatCurrency: (n: number) => `${n.toFixed(2)} €`,
  today: () => "2026-03-30",
}));

const mockExpense: Expense = {
  id: "1",
  supplier: "Fournisseur SA",
  date: "2026-03-30",
  subtotal: 500,
  vatRate: 20,
  vat: 100,
  total: 600,
  status: "to_review",
  notes: "Achat matériel",
};

describe("ExpenseForm", () => {
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create mode", () => {
    it("renders the create title", () => {
      render(<ExpenseForm onClose={onClose} />);
      expect(screen.getByText("expenses.form.title")).toBeInTheDocument();
    });

    it("renders create button", () => {
      render(<ExpenseForm onClose={onClose} />);
      expect(screen.getByRole("button", { name: "common.create" })).toBeInTheDocument();
    });

    it("renders cancel button", () => {
      render(<ExpenseForm onClose={onClose} />);
      expect(screen.getByRole("button", { name: "common.cancel" })).toBeInTheDocument();
    });

    it("calls onClose when cancel is clicked", async () => {
      render(<ExpenseForm onClose={onClose} />);
      await userEvent.click(screen.getByRole("button", { name: "common.cancel" }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("matches snapshot", () => {
      const { asFragment } = render(<ExpenseForm onClose={onClose} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe("edit mode", () => {
    it("renders the edit title", () => {
      render(<ExpenseForm onClose={onClose} expense={mockExpense} />);
      expect(screen.getByText("expenses.form.editTitle")).toBeInTheDocument();
    });

    it("pre-fills supplier name", () => {
      render(<ExpenseForm onClose={onClose} expense={mockExpense} />);
      expect(screen.getByDisplayValue("Fournisseur SA")).toBeInTheDocument();
    });

    it("pre-fills subtotal", () => {
      render(<ExpenseForm onClose={onClose} expense={mockExpense} />);
      expect(screen.getByDisplayValue("500")).toBeInTheDocument();
    });

    it("renders edit button", () => {
      render(<ExpenseForm onClose={onClose} expense={mockExpense} />);
      expect(screen.getByRole("button", { name: "common.edit" })).toBeInTheDocument();
    });

    it("matches snapshot", () => {
      const { asFragment } = render(
        <ExpenseForm onClose={onClose} expense={mockExpense} />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  it("updates supplier field on input", async () => {
    render(<ExpenseForm onClose={onClose} />);
    const input = screen.getByPlaceholderText("expenses.form.supplierPlaceholder");
    await userEvent.type(input, "Nouveau Fournisseur");
    expect(input).toHaveValue("Nouveau Fournisseur");
  });
});
