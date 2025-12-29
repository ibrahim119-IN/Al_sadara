'use client'

import { createContext, useContext, useReducer, useEffect, useCallback, useMemo, type ReactNode } from 'react'

// Types
export interface CartProduct {
  id: string
  name: string
  nameAr: string
  slug: string
  price: number
  compareAtPrice?: number
  images?: Array<{ image: { url: string }; alt?: string }>
  stock: number
  category?: {
    name: string
    nameAr: string
    slug: string
  }
}

export interface CartItem {
  id: string
  product: CartProduct
  quantity: number
}

interface CartState {
  items: CartItem[]
  isLoading: boolean
  isOpen: boolean
}

type CartAction =
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: { product: CartProduct; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_OPEN'; payload: boolean }

interface CartContextType extends CartState {
  totalItems: number
  totalPrice: number
  addItem: (product: CartProduct, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  getItemQuantity: (productId: string) => number
}

const CartContext = createContext<CartContextType | null>(null)

// Storage key
const CART_STORAGE_KEY = 'alsadara_cart'

// Generate unique cart item ID
const generateCartItemId = () => `cart_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload }

    case 'ADD_ITEM': {
      const { product, quantity } = action.payload
      const existingItemIndex = state.items.findIndex(
        (item) => item.product.id === product.id
      )

      if (existingItemIndex > -1) {
        // Update existing item quantity
        const updatedItems = [...state.items]
        const newQuantity = updatedItems[existingItemIndex].quantity + quantity
        // Don't exceed stock
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: Math.min(newQuantity, product.stock),
        }
        return { ...state, items: updatedItems }
      }

      // Add new item
      const newItem: CartItem = {
        id: generateCartItemId(),
        product,
        quantity: Math.min(quantity, product.stock),
      }
      return { ...state, items: [...state.items, newItem] }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== action.payload),
      }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.product.id !== productId),
        }
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.min(quantity, item.product.stock) }
            : item
        ),
      }
    }

    case 'CLEAR_CART':
      return { ...state, items: [] }

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }

    case 'SET_OPEN':
      return { ...state, isOpen: action.payload }

    default:
      return state
  }
}

// Provider
interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isLoading: true,
    isOpen: false,
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart)
        if (Array.isArray(parsedCart)) {
          dispatch({ type: 'SET_ITEMS', payload: parsedCart })
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (!state.isLoading) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items))
      } catch (error) {
        console.error('Error saving cart to localStorage:', error)
      }
    }
  }, [state.items, state.isLoading])

  // Calculate totals
  const totalItems = useMemo(
    () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items]
  )

  const totalPrice = useMemo(
    () =>
      state.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
    [state.items]
  )

  // Actions
  const addItem = useCallback((product: CartProduct, quantity = 1) => {
    if (product.stock <= 0) return
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } })
  }, [])

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId })
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  const openCart = useCallback(() => {
    dispatch({ type: 'SET_OPEN', payload: true })
  }, [])

  const closeCart = useCallback(() => {
    dispatch({ type: 'SET_OPEN', payload: false })
  }, [])

  const toggleCart = useCallback(() => {
    dispatch({ type: 'SET_OPEN', payload: !state.isOpen })
  }, [state.isOpen])

  const getItemQuantity = useCallback(
    (productId: string) => {
      const item = state.items.find((item) => item.product.id === productId)
      return item?.quantity || 0
    },
    [state.items]
  )

  const value = useMemo(
    () => ({
      ...state,
      totalItems,
      totalPrice,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
      getItemQuantity,
    }),
    [
      state,
      totalItems,
      totalPrice,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
      getItemQuantity,
    ]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Hook
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export default CartContext
