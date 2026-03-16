const http = require("http");

const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 8899);

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(payload));
}

function jsonRpcError(id, code, message, data) {
  const error = { code, message };

  if (data !== undefined) {
    error.data = data;
  }

  return {
    jsonrpc: "2.0",
    id: id ?? null,
    error,
  };
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function handleRequestBody(body) {
  let payload;

  try {
    payload = JSON.parse(body);
  } catch {
    return jsonRpcError(null, -32700, "Parse Error");
  }

  if (!isPlainObject(payload)) {
    return jsonRpcError(null, -32600, "Invalid Request");
  }

  const { jsonrpc, method, params, id } = payload;

  if (jsonrpc !== "2.0" || typeof method !== "string") {
    return jsonRpcError(id, -32600, "Invalid Request");
  }

  if (method === "mock.ok") {
    return {
      jsonrpc: "2.0",
      id: id ?? null,
      result: {
        message: "ok",
      },
    };
  }

  if (method === "mock.invalid_params") {
    const hasExpectedParams =
      isPlainObject(params) && typeof params.reason === "string";

    if (!hasExpectedParams) {
      return jsonRpcError(id, -32602, "Invalid Params");
    }

    return {
      jsonrpc: "2.0",
      id: id ?? null,
      result: {
        accepted: true,
      },
    };
  }

  if (method === "mock.internal_error") {
    return jsonRpcError(id, -32603, "Internal Error", {
      details: "Simulated upstream processing failure.",
    });
  }

  if (method === "mock.rate_limit_exceeded") {
    return jsonRpcError(id, -32005, "Rate Limit Exceeded", {
      limit: "10 requests / 1 minute",
      try_again_in: 30,
    });
  }

  if (method === "mock.server_error") {
    return jsonRpcError(id, -32000, "Server Error", {
      details: "Simulated implementation-defined server error.",
    });
  }

  return jsonRpcError(id, -32601, "Method Not Found");
}

const server = http.createServer((request, response) => {
  if (request.method === "GET" && request.url === "/health") {
    sendJson(response, 200, { status: "ok" });
    return;
  }

  if (request.method !== "POST" || request.url !== "/") {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not Found");
    return;
  }

  let body = "";

  request.on("data", (chunk) => {
    body += chunk;
  });

  request.on("end", () => {
    const payload = handleRequestBody(body);
    sendJson(response, 200, payload);
  });
});

server.listen(port, host, () => {
  console.log(`JSON-RPC mock listening on http://${host}:${port}`);
});
