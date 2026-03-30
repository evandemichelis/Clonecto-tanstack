import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Modal from "../Modal";

const defaultProps = {
  title: "Mon modal",
  onClose: jest.fn(),
  children: <p>Contenu du modal</p>,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Modal", () => {
  it("renders the title", () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText("Mon modal")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText("Contenu du modal")).toBeInTheDocument();
  });

  it("renders footer when provided", () => {
    render(
      <Modal {...defaultProps} footer={<button>Confirmer</button>} />
    );
    expect(screen.getByRole("button", { name: "Confirmer" })).toBeInTheDocument();
  });

  it("does not render footer when not provided", () => {
    render(<Modal {...defaultProps} />);
    expect(screen.queryByRole("button", { name: "Confirmer" })).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    render(<Modal {...defaultProps} />);
    await userEvent.click(screen.getByRole("button", { name: "Fermer" }));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when clicking the backdrop", () => {
    const { container } = render(<Modal {...defaultProps} />);
    const overlay = container.firstChild as HTMLElement;
    fireEvent.click(overlay, { target: overlay });
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", () => {
    render(<Modal {...defaultProps} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose on other key presses", () => {
    render(<Modal {...defaultProps} />);
    fireEvent.keyDown(document, { key: "Enter" });
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <Modal {...defaultProps} footer={<button>OK</button>} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
