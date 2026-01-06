/**
 * Spinner Component
 *
 * A loading spinner to show while data is being fetched.
 * Provides visual feedback to users that something is happening.
 */

import { FaSpinner } from 'react-icons/fa';
import './Spinner.css';

interface SpinnerProps {
  message?: string;
}

function Spinner({ message = 'Loading...' }: SpinnerProps) {
  return (
    <div className="spinner-container">
      <FaSpinner className="spinner-icon" />
      <p className="spinner-message">{message}</p>
    </div>
  );
}

export default Spinner;
