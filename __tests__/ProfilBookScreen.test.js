// describe('ProfilBookScreen', () => {
//   it('btn', () => {
//     expect(true).toBe(true);
//   });
// });

import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react-native";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user";
import App from "./App";

const dummyUserData = { nickname: "Romain Reigns" };

it("Nickname on PlacesScreen", async () => {
  const store = configureStore({ reducer: { user } });
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  // Navigate to MapScreen
  const input = await screen.findByPlaceholderText(/Nickname/i);
  const mapButton = await screen.findByText(/Go to map/i);

  fireEvent.changeText(input, dummyUserData.nickname);
  fireEvent.press(mapButton);

  // Navigate to PlacesScreen
  const placesItemMenu = await screen.findByText(/Places/i);

  fireEvent.press(placesItemMenu);

  await screen.findByText(dummyUserData.nickname, {
    exact: false,
    matchCase: false,
  });
});
