import { CartAction, CartState } from "../../utils/types/inventory-item";
import { User } from "../../utils/types/login";

export function transitionCartState(
  state: CartState,
  action: CartAction,
  user: User,
): CartState {
  const next = {
    count: state.count,
    items: new Map(state.items),
  };

  switch (action.type) {
    case "ADD":
      if (user.capabilities.cart.addWorks) {
        const current = next.items.get(action.title) ?? 0;
        next.items.set(action.title, current + 1);

        if (user.capabilities.cart.badgeAccurate) {
          next.count++;
        }
      }
      return next;

    case "REMOVE":
      if (user.capabilities.cart.removeWorks && next.items.has(action.title)) {
        next.items.delete(action.title);
        if (user.capabilities.cart.badgeAccurate) {
          next.count--;
        }
      }
      return next;
  }
}
