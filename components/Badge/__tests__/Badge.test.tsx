import { render, screen } from "@testing-library/react";
import Badge, {
  invoiceStatusVariant,
  expenseStatusVariant,
} from "../Badge";

describe("Badge", () => {
  it("renders the label", () => {
    render(<Badge label="Payé" variant="green" />);
    expect(screen.getByText("Payé")).toBeInTheDocument();
  });

  it("renders with each variant without crashing", () => {
    const variants = ["gray", "blue", "green", "red", "orange", "purple"] as const;
    variants.forEach((variant) => {
      const { unmount } = render(<Badge label={variant} variant={variant} />);
      expect(screen.getByText(variant)).toBeInTheDocument();
      unmount();
    });
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<Badge label="En attente" variant="blue" />);
    expect(asFragment()).toMatchSnapshot();
  });

  describe("invoiceStatusVariant", () => {
    it("maps every invoice status to a variant", () => {
      expect(invoiceStatusVariant.to_send).toBe("gray");
      expect(invoiceStatusVariant.pending).toBe("blue");
      expect(invoiceStatusVariant.paid).toBe("green");
      expect(invoiceStatusVariant.overdue).toBe("red");
    });
  });

  describe("expenseStatusVariant", () => {
    it("maps every expense status to a variant", () => {
      expect(expenseStatusVariant.to_review).toBe("gray");
      expect(expenseStatusVariant.to_pay).toBe("orange");
      expect(expenseStatusVariant.paid).toBe("green");
    });
  });
});
