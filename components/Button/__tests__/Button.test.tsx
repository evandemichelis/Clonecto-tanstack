import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "../Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Créer</Button>);
    expect(screen.getByRole("button", { name: "Créer" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Cliquer</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Désactivé</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("renders disabled attribute", () => {
    render(<Button disabled>Désactivé</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("matches snapshot — primary (default)", () => {
    const { asFragment } = render(<Button>Créer</Button>);
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot — secondary", () => {
    const { asFragment } = render(<Button variant="secondary">Annuler</Button>);
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot — danger", () => {
    const { asFragment } = render(<Button variant="danger">Supprimer</Button>);
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot — small size", () => {
    const { asFragment } = render(<Button size="sm">Petit</Button>);
    expect(asFragment()).toMatchSnapshot();
  });
});
