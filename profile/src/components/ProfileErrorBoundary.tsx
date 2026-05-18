import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ProfileErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Profile render error:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="font-display text-xl font-semibold text-ink">Could not display profile</h1>
          <p className="mt-2 text-sm text-muted">Try refreshing the page.</p>
          <a href="/index.html" className="btn-primary mt-6 inline-block no-underline">
            Back to search
          </a>
        </main>
      );
    }
    return this.props.children;
  }
}
