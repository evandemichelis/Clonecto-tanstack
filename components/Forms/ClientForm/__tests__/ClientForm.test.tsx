import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ClientForm from "../ClientForm";
import { Client } from "@/types";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("@/lib/queries/clients", () => ({
  useAddClient: () => ({ mutateAsync: jest.fn().mockResolvedValue({}) }),
  useUpdateClient: () => ({ mutateAsync: jest.fn().mockResolvedValue({}) }),
}));

const mockClient: Client = {
  id: "1",
  name: "Acme Corp",
  email: "contact@acme.com",
  phone: "0600000000",
  address: "1 rue de la Paix",
  siret: "12345678901234",
};

describe("ClientForm", () => {
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create mode", () => {
    it("renders the create title", () => {
      render(<ClientForm onClose={onClose} />);
      expect(screen.getByText("clients.form.title")).toBeInTheDocument();
    });

    it("renders empty fields", () => {
      render(<ClientForm onClose={onClose} />);
      const nameInput = screen.getByPlaceholderText("clients.form.namePlaceholder");
      expect(nameInput).toHaveValue("");
    });

    it("renders create button", () => {
      render(<ClientForm onClose={onClose} />);
      expect(screen.getByRole("button", { name: "common.create" })).toBeInTheDocument();
    });

    it("calls onClose when cancel is clicked", async () => {
      render(<ClientForm onClose={onClose} />);
      await userEvent.click(screen.getByRole("button", { name: "common.cancel" }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("matches snapshot", () => {
      const { asFragment } = render(<ClientForm onClose={onClose} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe("edit mode", () => {
    it("renders the edit title", () => {
      render(<ClientForm onClose={onClose} client={mockClient} />);
      expect(screen.getByText("clients.form.editTitle")).toBeInTheDocument();
    });

    it("pre-fills name field with existing client data", () => {
      render(<ClientForm onClose={onClose} client={mockClient} />);
      expect(screen.getByDisplayValue("Acme Corp")).toBeInTheDocument();
    });

    it("pre-fills email field with existing client data", () => {
      render(<ClientForm onClose={onClose} client={mockClient} />);
      expect(screen.getByDisplayValue("contact@acme.com")).toBeInTheDocument();
    });

    it("renders edit button", () => {
      render(<ClientForm onClose={onClose} client={mockClient} />);
      expect(screen.getByRole("button", { name: "common.edit" })).toBeInTheDocument();
    });

    it("matches snapshot", () => {
      const { asFragment } = render(
        <ClientForm onClose={onClose} client={mockClient} />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  it("updates field value on input", async () => {
    render(<ClientForm onClose={onClose} />);
    const nameInput = screen.getByPlaceholderText("clients.form.namePlaceholder");
    await userEvent.type(nameInput, "Nouveau Client");
    expect(nameInput).toHaveValue("Nouveau Client");
  });
});
