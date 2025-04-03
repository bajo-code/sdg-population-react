interface ErrorDisplayProps {
    message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
  <div className="error-display" role="alert">
    <strong>Error!</strong>
    <span>{message}</span>
  </div>
);