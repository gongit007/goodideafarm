import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App.jsx";
import { BrixProvider } from "./BrixContext.jsx";

export { headForPath } from "./seoHead.js";

export function render(url) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <BrixProvider>
          <App />
        </BrixProvider>
      </StaticRouter>
    </StrictMode>
  );
}
