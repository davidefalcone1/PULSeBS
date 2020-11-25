import React from "react";
import LoginForm from "../src/components/LoginForm";
import renderer from "react-test-renderer";

test("Fist SnapShot test ", () => {
  const tree = renderer.create(<LoginForm />).toJSON();
  expect(tree).toMatchSnapshot();
});