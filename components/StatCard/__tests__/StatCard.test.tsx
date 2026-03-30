import { render, screen } from "@testing-library/react";
import StatCard from "../StatCard";

describe("StatCard", () => {
  const baseProps = {
    label: "Total encaissements",
    value: "12 450 €",
    icon: <span data-testid="icon">💰</span>,
  };

  it("renders the label", () => {
    render(<StatCard {...baseProps} />);
    expect(screen.getByText("Total encaissements")).toBeInTheDocument();
  });

  it("renders the value", () => {
    render(<StatCard {...baseProps} />);
    expect(screen.getByText("12 450 €")).toBeInTheDocument();
  });

  it("renders the icon", () => {
    render(<StatCard {...baseProps} />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders sub text when provided", () => {
    render(<StatCard {...baseProps} sub="vs mois dernier" />);
    expect(screen.getByText("vs mois dernier")).toBeInTheDocument();
  });

  it("does not render sub text when not provided", () => {
    render(<StatCard {...baseProps} />);
    expect(screen.queryByText("vs mois dernier")).not.toBeInTheDocument();
  });

  it("renders numeric value", () => {
    render(<StatCard {...baseProps} value={42} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("matches snapshot without sub", () => {
    const { asFragment } = render(<StatCard {...baseProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot with sub", () => {
    const { asFragment } = render(<StatCard {...baseProps} sub="+12% ce mois" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
