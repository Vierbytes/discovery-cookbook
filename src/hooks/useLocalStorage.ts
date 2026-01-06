/**
 * useLocalStorage Hook
 *
 * A custom hook that synchronizes state with browser localStorage.
 * This allows data to persist across page refreshes and browser sessions.
 *
 * How it works:
 * - On mount: loads initial value from localStorage
 * - On update: saves new value to localStorage automatically
 * - Handles JSON serialization/deserialization
 * - Provides error handling for storage issues
 *
 * @param key - The localStorage key to store data under
 * @param initialValue - Default value if nothing is stored
 * @returns [storedValue, setValue] - Similar to useState API
 */

import { useState } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prevValue: T) => T)) => void] {
  /**
   * Initialize state with lazy initialization
   *
   * I'm using a function here because reading from localStorage
   * should only happen once on mount, not on every render.
   */
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Try to get item from localStorage
      const item = window.localStorage.getItem(key);

      // Parse stored json or return initialValue if nothing stored
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error (e.g., localStorage not available), use initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  /**
   * Custom setValue function that also updates localStorage
   *
   * This wraps setState to automatically persist changes to localStorage.
   * Accepts either a direct value or a function that receives the previous value.
   */
  const setValue = (value: T | ((prevValue: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Update state
      setStoredValue(valueToStore);

      // Save to localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // Handle errors (e.g., localStorage full, private browsing mode)
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
