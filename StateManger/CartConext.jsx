
'use client'
import { createContext, useContext, useMemo, useReducer } from "react";
import { CartReducer, initialCartState } from "./CartReducer";
import CartManager from "./CartManager";

const CartContext = createContext()

export const CartWrapper = ({ children }) => {

    const [state, dispatch] = useReducer(CartReducer, initialCartState);

    const contextValue = useMemo(() => {
        return { state, dispatch };
    }, [state, dispatch]);

    CartManager(state, dispatch, initialCartState)
    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    )
}

export function useCartContext() {
    return useContext(CartContext);
}
