/**
 * useFetch Hook
 *
 * A generic custom hook for fetching data from APIs.
 * Manages loading state, error state, and data state in one place.
 *
 * This hook is reusable across the entire application for any API endpoint.
 * It handles:
 * - Automatic fetching when URL changes
 * - Loading state management
 * - Error handling with user-friendly messages
 * - Cleanup to prevent memory leaks
 *
 * @param url - The API endpoint to fetch from (null to skip fetching)
 * @returns Object containing data, loading state, and error state
 */

import { useState, useEffect } from 'react';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(url: string | null): UseFetchResult<T> {
  // State for storing fetched data
  const [data, setData] = useState<T | null>(null);

  // State for tracking loading status
  const [loading, setLoading] = useState<boolean>(false);

  // State for storing error messages
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip fetch if no URL provided
    if (!url) {
      return;
    }

    /**
     * AbortController for cleanup
     *
     * This is important! It allows us to cancel the fetch request
     * if the component unmounts or the URL changes before the
     * request completes. This prevents memory leaks and errors.
     */
    const abortController = new AbortController();

    /**
     * Async function to fetch data
     *
     * I'm defining this inside the effect so it has access to
     * all the state setters and the abort signal.
     */
    const fetchData = async () => {
      // Reset states before fetching
      setLoading(true);
      setError(null);

      try {
        // Fetch data with abort signal
        const response = await fetch(url, {
          signal: abortController.signal,
        });

        // Check if response is OK (status 200-299)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse JSON response
        const result = await response.json();

        // Update data state with result
        setData(result);
      } catch (err) {
        // Only set error if not aborted
        // (abort errors are expected during cleanup)
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch data');
          console.error('Fetch error:', err);
        }
      } finally {
        // Always stop loading when done
        setLoading(false);
      }
    };

    // Execute the fetch
    fetchData();

    /**
     * Cleanup function
     *
     * This runs when:
     * - Component unmounts
     * - URL changes (before next effect runs)
     * - Dependencies change
     *
     * We abort the fetch to prevent state updates on unmounted components.
     */
    return () => {
      abortController.abort();
    };
  }, [url]); // Re-run effect when URL changes

  return { data, loading, error };
}
