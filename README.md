# json-rpc-mock

JSON-RPCのエラーハンドリング確認用の最小モックサーバーです。Node.js標準ライブラリのみを使うため、`npm install`は不要です。

## 起動

```bash
npm start
```

デフォルトでは `http://127.0.0.1:3000/` で待ち受けます。必要なら `PORT` と `HOST` を環境変数で変更できます。

## エンドポイント

- `POST /` JSON-RPC 2.0 リクエスト受付
- `GET /health` ヘルスチェック

## エラー再現方法

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

`mock.invalid_params` は `params.reason` に文字列を渡すと成功レスポンスになります。

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

## 疎通確認用の成功レスポンス

```bash
curl -s http://127.0.0.1:3000/ \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"mock.ok","id":1}'
```
