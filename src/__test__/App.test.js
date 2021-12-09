import { render } from "@testing-library/react";
import App from "../App";

// what to cover in tests
// when loading is true render the loader

it("Renders properly", () => {
  render(<App />);
});

// asynchronously api is called
// answer variable is assigned a value
// question is present
// user answer is empty
// submit button is disabled

// when user enters something
// if the final length of text entered is 1 or more than it, enable the button otherwise disable the button

//if the user enters something and the answer matches that, the text should contain "correct" or something
// otherwise, the text should contain "wrong"
