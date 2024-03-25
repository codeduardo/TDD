import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";
import userEvent from "@testing-library/user-event";
import { Form } from "./Form";

import { server } from "../mocks/serverForm";
/* import { HttpResponse, http } from "msw";
import { SERVER_ERROR_STATUS } from "./services/httpStatus"; */

let buttonForm: HTMLElement;
beforeEach(() => {
  render(<Form />);
  buttonForm = screen.getByRole("button", { name: /submit/i });
});

afterEach(() => {
  cleanup();
});
beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe("when the page loads", () => {
  it("should render form", () => {});
  it("should render form title", () => {
    expect(
      screen.getByRole("heading", { name: /store product/i })
    ).toBeDefined();
  });
});

describe("form must have the fields: name, size, type and submit button", () => {
  it("should show inputs", () => {
    expect(screen.getByLabelText(/name/i)).toBeDefined();
    expect(screen.getByLabelText(/size/i)).toBeDefined();

    expect(screen.getByLabelText(/type/i)).toBeDefined();
    expect(screen.getByText(/electronic/i)).toBeDefined();
    expect(screen.getByText(/furniture/i)).toBeDefined();
    expect(screen.getByText(/clothing/i)).toBeDefined();
  });
  it("should show button", () => {
    expect(buttonForm);
  });
});

describe("all fields should be required", () => {
  it('should show "the field is required" if user leaves empty field', async () => {
    await userEvent.click(buttonForm);

    expect(screen.getByText(/name is required/i)).toBeDefined();
    expect(screen.getByText(/size is required/i)).toBeDefined();
    expect(screen.getByText(/type is required/i)).toBeDefined();
  });
  it("field empty is blur should display the error message", () => {
    fireEvent.blur(screen.getByLabelText(/size/i));
    expect(screen.getByText(/size is required/i)).toBeDefined();

    fireEvent.blur(screen.getByLabelText(/name/i));
    expect(screen.getByText(/name is required/i)).toBeDefined();
  });
});

describe("The form must send the data to a backend", () => {
  beforeEach(async () => {
    await userEvent.type(screen.getByLabelText(/name/i), "ace");
    await userEvent.type(screen.getByLabelText(/size/i), "1kg");
    await userEvent.selectOptions(screen.getByRole("listbox"), "electronic");

    expect(buttonForm).toHaveProperty("disabled", false);
    await userEvent.click(buttonForm);
  });
  it("submit button should be disabled while fetching the data", async () => {
    expect(buttonForm).toHaveProperty("disabled", true);

    await waitFor(() => {
      expect(buttonForm).toHaveProperty("disabled", false);
    });
  });

  it('should display "product stored" message if product was save successfully', async () => {
    expect(screen.getByText(/product stored/i)).toBeDefined;

    expect(screen.getByLabelText(/name/i)).toHaveProperty("value", "");
    expect(screen.getByLabelText(/size/i)).toHaveProperty("value", "");
    expect(screen.getByLabelText(/type/i)).toHaveProperty("value", "");
  });
});
/* describe(() => {
  it('should display "unexpected error please try again" message if product was save successfully', async () => {
    await userEvent.type(screen.getByLabelText(/name/i), "ace");
    await userEvent.type(screen.getByLabelText(/size/i), "1kg");
    await userEvent.selectOptions(screen.getByRole("listbox"), "electronic");

    expect(buttonForm).toHaveProperty("disabled", false);
    await userEvent.click(buttonForm);
    server.use(
      http.post("/api/createProduct", () => {
        return new HttpResponse(null, { status: SERVER_ERROR_STATUS });
      })
    );
    screen.debug();
    expect(screen.getByText(/unexpected error please try again/i)).toBeDefined;
  });
});
 */
