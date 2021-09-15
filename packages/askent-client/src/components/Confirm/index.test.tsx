import React from "react";
import { cleanup, fireEvent, render } from "@testing-library/react";
import Confirm from "./index";

// Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

it("Confirm dialog render and close after Cancel clicked", () => {
  let open = true;
  const { getByText } = render(
    <Confirm
      open={open}
      title={"Title"}
      contentText={"Content"}
      cancelText={"Cancel"}
      okText={"Ok"}
      onCancel={() => (open = false)}
      onOk={() => (open = false)}
    />
  );

  expect(getByText(/Title/i)).toBeTruthy();
  expect(getByText(/Content/i)).toBeTruthy();
  expect(getByText(/Cancel/i)).toBeTruthy();
  expect(getByText(/Ok/i)).toBeTruthy();

  fireEvent.click(getByText(/Cancel/i));
  expect(open).toBeFalsy();
});
