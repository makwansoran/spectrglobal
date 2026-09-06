import "./form-success.css";

type FormSuccessProps = {
  tone?: "dark" | "light";
  message?: string;
};

export function FormSuccess({
  tone = "dark",
  message = "We will be in touch soon.",
}: FormSuccessProps) {
  return (
    <div
      className={`form-success form-success--${tone}`}
      role="status"
      aria-live="polite"
    >
      <svg className="form-success__mark" viewBox="0 0 52 52" aria-hidden="true">
        <circle className="form-success__circle" cx="26" cy="26" r="25" fill="none" />
        <path
          className="form-success__check"
          fill="none"
          d="M14.1 27.2l7.1 7.2 16.7-16.8"
        />
      </svg>
      <p className="form-success__message">{message}</p>
    </div>
  );
}
