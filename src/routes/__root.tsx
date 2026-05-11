import { Outlet, Link, createRootRoute } from "@tanstack/react-router";
import EnableMotionPrompt from "../components/EnableMotionPrompt";

function NotFoundComponent() {
  return (
    <div className="not-found">
      <div className="not-found-card">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page not found</h2>
        <p className="not-found-text">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="not-found-button">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  return (
    <>
      <EnableMotionPrompt />
      <Outlet />
    </>
  );
}
