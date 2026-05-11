import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const basepath =
  import.meta.env.BASE_URL === "/" ? "/" : import.meta.env.BASE_URL.replace(/\/$/, "");

function DefaultErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="route-error">
      <div className="route-error-card">
        <div className="route-error-code">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>
        <h1 className="route-error-title">Something went wrong</h1>
        <p className="route-error-text">An unexpected error occurred. Please try again.</p>
        {import.meta.env.DEV && error.message && (
          <pre className="route-error-pre">{error.message}</pre>
        )}
        <div className="route-error-actions">
          <button
            onClick={() => {
              window.location.reload();
              reset();
            }}
            className="route-error-button"
          >
            Try again
          </button>
          <a href="/" className="route-error-link">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    basepath,
    context: {},
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent,
  });

  return router;
};
