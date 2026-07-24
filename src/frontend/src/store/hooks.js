import { useDispatch, useSelector } from 'react-redux'

// Re-export useDispatch and useSelector with proper typing for the app
export const useAppDispatch = () => useDispatch()
export const useAppSelector = useSelector

// Custom hooks for common selectors
export { useAppDispatch as useDispatch, useAppSelector as useSelector }