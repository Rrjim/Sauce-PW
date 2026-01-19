import { CartAction, CartState } from "../../types/inventory-item";
import { User } from "../../types/login";

export function transitionCartState(
  state: CartState,
  action: CartAction,
  user: User
): CartState {
  const next = {
    count: state.count,
    items: new Set(state.items),
  };

  switch (action.type) {
    case "ADD":
      if (user.capabilities.cart.addWorks) {
        next.items.add(action.title);
        if (user.capabilities.cart.badgeAccurate) {
          next.count++;
        }
      }
      return next;

    case "REMOVE":
      if (
        user.capabilities.cart.removeWorks &&
        next.items.has(action.title)
      ) {
        next.items.delete(action.title);
        if (user.capabilities.cart.badgeAccurate) {
          next.count--;
        }
      }
      return next;
  }
}




