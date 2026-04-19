# json-rpc-mock

This is a minimal mock server for checking JSON-RPC error handling. It uses only the Node.js standard library, so `npm install` is not required.

## Start

```bash
npm start
```

By default, the server listens on `http://127.0.0.1:3000/`. If needed, you can change `PORT` and `HOST` with environment variables.

## Endpoints

- `POST /` Accepts JSON-RPC 2.0 requests
- `GET /health` Health check

## How to reproduce errors

### -32700 Parse Error

```bash
curl -i http://127.0.0.1:3000/ \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"mock.ok",'
```

### -32600 Invalid Request

```bash
curl -s http://127.0.0.1:3000/ \
  -H 'Content-Type: application/json' \
  -d '{"method":"mock.ok","id":1}'
```

### -32601 Method Not Found

```bash
curl -s http://127.0.0.1:3000/ \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"unknown.method","id":1}'
```

### -32602 Invalid Params

```bash
curl -s http://127.0.0.1:3000/ \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"mock.invalid_params","params":{},"id":1}'
```

`mock.invalid_params` returns a successful response when a string is passed in `params.reason`.

### -32603 Internal Error

```bash
curl -s http://127.0.0.1:3000/ \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"mock.internal_error","id":1}'
```

### -32005 Rate Limit Exceeded

```bash
curl -s http://127.0.0.1:3000/ \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"mock.rate_limit_exceeded","id":1}'
```

### -32000 Server Error

```bash
curl -s http://127.0.0.1:3000/ \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"mock.server_error","id":1}'
```

## Successful response for connectivity check

```bash
curl -s http://127.0.0.1:3000/ \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"mock.ok","id":1}'
```
