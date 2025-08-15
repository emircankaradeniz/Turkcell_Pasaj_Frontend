import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";

type RenderResult = {
  container: HTMLDivElement;
  rerender: (next: React.ReactElement) => void;
  unmount: () => void;
  getAllByTestId: (id: string) => HTMLElement[];
  getByTestId: (id: string) => (HTMLElement | null);
};

/** Router'sız basit render (router kullanmayan komponentler için) */
export function render(ui: React.ReactElement): RenderResult {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => { root.render(ui); });
  return {
    container,
    rerender: (next) => act(() => root.render(next)),
    unmount: () => act(() => root.unmount()),
    getAllByTestId: (id) =>
      Array.from(container.querySelectorAll(`[data-testid="${id}"]`)),
    getByTestId: (id) =>
      container.querySelector(`[data-testid="${id}"]`) as HTMLElement | null,
  };
}

/** Router gerektiren komponentler için MemoryRouter sarmalı */
export function renderWithRouter(
  ui: React.ReactElement,
  opts?: { entries?: string[]; index?: number }
): RenderResult {
  const { entries = ["/"], index = 0 } = opts || {};
  return render(
    <MemoryRouter initialEntries={entries} initialIndex={index}>
      {ui}
    </MemoryRouter>
  );
}

export function click(el: HTMLElement) {
  el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
}

export function mouseEnter(el: HTMLElement) {
  el.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
}

export function mouseLeave(el: HTMLElement) {
  el.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
}

export async function tick(ms = 0) {
  await new Promise((r) => setTimeout(r, ms));
}

export function typeInto(input: HTMLInputElement | HTMLTextAreaElement, value: string) {
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
}
