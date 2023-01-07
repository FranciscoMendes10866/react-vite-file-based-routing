import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  LoaderFunction,
  ActionFunction,
} from "react-router-dom";

interface IRoute {
  path: string;
  Element: JSX.Element;
  loader?: LoaderFunction;
  action?: ActionFunction;
  ErrorBoundary?: JSX.Element;
}

const pages = import.meta.glob("./pages/**/*.tsx", { eager: true });

const routes: IRoute[] = [];
for (const path of Object.keys(pages)) {
  const fileName = path.match(/\.\/pages\/(.*)\.tsx$/)?.[1];
  if (!fileName) {
    continue;
  }

  const normalizedPathName = fileName.includes("$")
    ? fileName.replace("$", ":")
    : fileName.replace(/\/index/, "");

  // @ts-ignore
  const loaderFn = pages[path]?.loader as unknown as LoaderFunction | undefined;
  // @ts-ignore
  const actionFn = pages[path]?.action as unknown as ActionFunction | undefined;
  // @ts-ignore
  const errorBoundaryElement = pages[path]?.ErrorBoundary as unknown as JSX.Element;

  routes.push({
    path: fileName === "index" ? "/" : `/${normalizedPathName.toLowerCase()}`,
    // @ts-ignore
    Element: pages[path].default,
    loader: loaderFn,
    action: actionFn,
    ErrorBoundary: errorBoundaryElement,
  });
}

const router = createBrowserRouter(
  routes.map(({ path, Element, loader, action, ErrorBoundary }) => ({
    path,
    // @ts-ignore
    element: <Element />,
    loader,
    action,
    // @ts-ignore
    ...(ErrorBoundary && { errorElement: <ErrorBoundary /> }),
  }))
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
