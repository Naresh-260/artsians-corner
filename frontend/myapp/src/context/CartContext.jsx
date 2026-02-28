// =================================================================
// Cart Context - Global state management for shopping cart
// =================================================================

import { createContext, useContext, useReducer, useEffect } from 'react';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart, getCartSummary } from '../services/cartService';

// Cart Context
const CartContext = createContext();

// Initial state
const initialState = {
  cart: null,
  summary: {
    totalItems: 0,
    subtotal: 0,
    itemCount: 0
  },
  loading: false,
  error: null
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_CART: 'SET_CART',
  SET_SUMMARY: 'SET_SUMMARY',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  RESET_ERROR: 'RESET_ERROR'
};

// Reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case actionTypes.RESET_ERROR:
      return { ...state, error: null };
    
    case actionTypes.SET_CART:
      return { ...state, cart: action.payload, loading: false };
    
    case actionTypes.SET_SUMMARY:
      return { ...state, summary: action.payload, loading: false };
    
    case actionTypes.ADD_ITEM:
      const updatedCart = {
        ...state.cart,
        items: state.cart.items.some(item => 
          item.product._id === action.payload.product._id
        ) 
          ? state.cart.items.map(item => 
              item.product._id === action.payload.product._id
                ? { ...item, quantity: item.quantity + action.payload.quantity }
                : item
            )
          : [...state.cart.items, action.payload]
      };
      return { ...state, cart: updatedCart };
    
    case actionTypes.UPDATE_ITEM:
      const updatedItems = state.cart.items.map(item =>
        item.product._id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0); // Remove items with 0 quantity
      
      return {
        ...state,
        cart: {
          ...state.cart,
          items: updatedItems
        }
      };
    
    case actionTypes.REMOVE_ITEM:
      const filteredItems = state.cart.items.filter(
        item => item.product._id !== action.payload.productId
      );
      
      return {
        ...state,
        cart: {
          ...state.cart,
          items: filteredItems
        }
      };
    
    case actionTypes.CLEAR_CART:
      return { ...state, cart: { items: [], subtotal: 0 }, summary: { totalItems: 0, subtotal: 0, itemCount: 0 } };
    
    default:
      return state;
  }
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart on component mount
  useEffect(() => {
    console.log("CartContext: Loading cart");
    const loadCart = async () => {
      if (localStorage.getItem('token')) {
        console.log("CartContext: Token found, fetching cart");
        await fetchCart();
        await fetchCartSummary();
      } else {
        console.log("CartContext: No token found");
      }
    };
    
    loadCart();
  }, []);

  // Fetch cart from API
  const fetchCart = async () => {
    try {
      console.log("CartContext: Fetching cart from API");
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      const response = await getCart();
      console.log("CartContext: Cart response:", response);
      dispatch({ type: actionTypes.SET_CART, payload: response.data });
      dispatch({ type: actionTypes.RESET_ERROR });
    } catch (error) {
      console.error("CartContext: Error fetching cart:", error);
      dispatch({ 
        type: actionTypes.SET_ERROR, 
        payload: error.response?.data?.message || error.message || 'Failed to load cart' 
      });
    }
  };

  // Fetch cart summary
  const fetchCartSummary = async () => {
    try {
      const response = await getCartSummary();
      dispatch({ type: actionTypes.SET_SUMMARY, payload: response.data });
    } catch (error) {
      console.error('Failed to load cart summary:', error);
    }
  };

  // Add item to cart
  const addItem = async (productId, quantity = 1) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      const response = await addToCart({ productId, quantity });
      dispatch({ type: actionTypes.SET_CART, payload: response.data });
      dispatch({ type: actionTypes.SET_SUMMARY, payload: await getCartSummary().then(r => r.data) });
      dispatch({ type: actionTypes.RESET_ERROR });
      return response.data;
    } catch (error) {
      dispatch({ 
        type: actionTypes.SET_ERROR, 
        payload: error.response?.data?.message || error.message || 'Failed to add item to cart' 
      });
      throw error;
    }
  };

  // Update item quantity
  const updateItem = async (productId, quantity) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      const response = await updateCartItem({ productId, quantity });
      dispatch({ type: actionTypes.SET_CART, payload: response.data });
      dispatch({ type: actionTypes.SET_SUMMARY, payload: await getCartSummary().then(r => r.data) });
      dispatch({ type: actionTypes.RESET_ERROR });
      return response.data;
    } catch (error) {
      dispatch({ 
        type: actionTypes.SET_ERROR, 
        payload: error.response?.data?.message || error.message || 'Failed to update cart item' 
      });
      throw error;
    }
  };

  // Remove item from cart
  const removeItem = async (productId) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      const response = await removeFromCart(productId);
      dispatch({ type: actionTypes.SET_CART, payload: response.data });
      dispatch({ type: actionTypes.SET_SUMMARY, payload: await getCartSummary().then(r => r.data) });
      dispatch({ type: actionTypes.RESET_ERROR });
      return response.data;
    } catch (error) {
      dispatch({ 
        type: actionTypes.SET_ERROR, 
        payload: error.response?.data?.message || error.message || 'Failed to remove item from cart' 
      });
      throw error;
    }
  };

  // Clear entire cart
  const clearCartItems = async () => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      await clearCart();
      dispatch({ type: actionTypes.CLEAR_CART });
      dispatch({ type: actionTypes.SET_SUMMARY, payload: { totalItems: 0, subtotal: 0, itemCount: 0 } });
      dispatch({ type: actionTypes.RESET_ERROR });
    } catch (error) {
      dispatch({ 
        type: actionTypes.SET_ERROR, 
        payload: error.response?.data?.message || error.message || 'Failed to clear cart' 
      });
      throw error;
    }
  };

  const contextValue = {
    ...state,
    fetchCart,
    fetchCartSummary,
    addItem,
    updateItem,
    removeItem,
    clearCartItems
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};