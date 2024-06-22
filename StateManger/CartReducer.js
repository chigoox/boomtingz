export const initialCartState = {
   lineItems: {},
   total: 0
};

// Helper function to calculate the total
const calculateTotal = (lineItems) => {
   return Object.values(lineItems).reduce((total, item) => total + (item.price * item.Qty), 0);
};

// Inline filter function to remove an item by priceID
const filterObject = (obj, predicate) => {
   return Object.keys(obj)
      .filter(key => predicate(obj[key], key))
      .reduce((res, key) => (res[key] = obj[key], res), {});
};

export const CartReducer = (state, action) => {
   const stateQTY = state?.lineItems[action?.value?.priceID]?.Qty || 0;
   const actionQTY = action?.value?.Qty || 0;

   switch (action.type) {
      case "SAVE_CART": {
         return action.value;
      }
      case "ADD_TO_CART": {
         const updatedLineItems = {
            ...state.lineItems,
            [action.value.priceID]: {
               ...action.value,
               Qty: Number(actionQTY) + Number(stateQTY)
            }
         };
         return {
            ...state,
            lineItems: updatedLineItems,
            total: calculateTotal(updatedLineItems)
         };
      }
      case "SUB_FROM_CART": {
         const updatedQty = Math.max(stateQTY - actionQTY, 0);
         const updatedLineItems = {
            ...state.lineItems,
            [action.value.priceID]: {
               ...action.value,
               Qty: updatedQty
            }
         };
         // Remove item from lineItems if quantity is zero
         if (updatedQty === 0) {
            delete updatedLineItems[action.value.priceID];
         }
         return {
            ...state,
            lineItems: updatedLineItems,
            total: calculateTotal(updatedLineItems)
         };
      }
      case "SET_CART": {
         const updatedLineItems = {
            ...state.lineItems,
            [action.value.priceID]: {
               ...action.value,
               Qty: actionQTY
            }
         };
         return {
            ...state,
            lineItems: updatedLineItems,
            total: calculateTotal(updatedLineItems)
         };
      }
      case "REMOVE_FROM_CART": {
         const { [action.value.priceID]: removedItem, ...remainingItems } = state.lineItems;
         return {
            ...state,
            lineItems: remainingItems,
            total: calculateTotal(remainingItems)
         };
      }
      case "EMPTY_CART": {
         return {
            ...state,
            lineItems: {},
            total: 0
         };
      }
      default:
         return state;
   }
};
