import {
  handleCreateLetter,
  handleDeleteLetter,
  handleListLetters,
  handlePatchLetter,
} from "./lettersHandlers.js";

function parsePath(url) {
  const clean = (url || "").split("?")[0];
  const match = clean.match(/^\/api\/letters(?:\/([^/]+))?$/);
  if (!match) return null;
  return { id: match[1] || "" };
}

export async function handleLettersApi(req, res) {
  const route = parsePath(req.url);
  if (!route) return false;

  const method = req.method || "GET";

  if (method === "POST" && !route.id) {
    await handleCreateLetter(req, res);
    return true;
  }

  if (method === "GET" && !route.id) {
    await handleListLetters(req, res);
    return true;
  }

  if (method === "PATCH" && route.id) {
    await handlePatchLetter(req, res, route.id);
    return true;
  }

  if (method === "DELETE" && route.id) {
    await handleDeleteLetter(req, res, route.id);
    return true;
  }

  res.statusCode = 405;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ ok: false, error: "허용되지 않은 요청입니다." }));
  return true;
}

export function lettersApiPlugin() {
  const middleware = (req, res, next) => {
    handleLettersApi(req, res)
      .then((handled) => {
        if (!handled) next();
      })
      .catch(() => {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(JSON.stringify({ ok: false, error: "서버 오류가 발생했습니다." }));
      });
  };

  return {
    name: "farm-letters-api",
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}
