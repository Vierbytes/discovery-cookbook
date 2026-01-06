/**
 * ErrorMessage Component
 *
 * Displays user-friendly error messages when API calls fail.
 * Provides visual feedback and context about what went wrong.
 */

import { FaExclamationTriangle } from 'react-icons/fa';
import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
}

function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="error-container">
      <FaExclamationTriangle className="error-icon" />
      <h3>Oops! Something went wrong</h3>
      <p className="error-message">{message}</p>
      <p className="error-suggestion">Please try refreshing the page or come back later.</p>
    </div>
  );
}

export default ErrorMessage;
