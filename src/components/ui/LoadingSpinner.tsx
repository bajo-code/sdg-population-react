interface LoadingSpinnerProps {
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = "Loading Data..." }) => (
  <div className="loading-spinner-container">
    <div className="loading-spinner-circle"></div>
    <p className="loading-spinner-text">{text}</p>
  </div>
);