# alchemy_getTokenMetadata

POST https://eth-mainnet.g.alchemy.com/v2/{apiKey}
Content-Type: application/json

Returns metadata for a given token contract (name, symbol, decimals, logo).

Reference: https://alchemy.com/docs/data/token-api/token-api-endpoints/alchemy-get-token-metadata

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: alchemy_getTokenMetadata
  version: alchemy_getTokenMetadata
paths:
  /{apiKey}:
    post:
      operationId: alchemy-get-token-metadata
      summary: alchemy_getTokenMetadata
      description: >-
        Returns metadata for a given token contract (name, symbol, decimals,
        logo).
      tags:
        - []
      parameters:
        - name: apiKey
          in: path
          required: true
          schema:
            type: string
            default: docs-demo
      responses:
        '200':
          description: Object with name, symbol, decimals, and an optional logo URL.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AlchemyGetTokenMetadataResult'
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                contractAddress:
                  type: string
                  description: A single 20-byte token contract address.
              required:
                - contractAddress
components:
  schemas:
    AlchemyGetTokenMetadataResult:
      type: object
      properties:
        name:
          type: string
          description: Token's name, or null if not found.
        symbol:
          type: string
          description: Token's symbol, or null if not found.
        decimals:
          type: number
          format: double
          description: Number of decimals the token uses, or null if not found.
        logo:
          type: string
          description: URL of the token's logo image, or null if none available.

```

## SDK Code Examples

```python
import requests

url = "https://eth-mainnet.g.alchemy.com/v2/:apiKey"

payload = ["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"]
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=payload, headers=headers)

print(response.json())
```

```javascript
const url = 'https://eth-mainnet.g.alchemy.com/v2/:apiKey';
const options = {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: '["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"]'
};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}
```

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://eth-mainnet.g.alchemy.com/v2/:apiKey"

	payload := strings.NewReader("[\n  \"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48\"\n]")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("Content-Type", "application/json")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

```ruby
require 'uri'
require 'net/http'

url = URI("https://eth-mainnet.g.alchemy.com/v2/:apiKey")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'application/json'
request.body = "[\n  \"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48\"\n]"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.post("https://eth-mainnet.g.alchemy.com/v2/:apiKey")
  .header("Content-Type", "application/json")
  .body("[\n  \"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48\"\n]")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://eth-mainnet.g.alchemy.com/v2/:apiKey', [
  'body' => '[
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
]',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://eth-mainnet.g.alchemy.com/v2/:apiKey");
var request = new RestRequest(Method.POST);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "[\n  \"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48\"\n]", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://eth-mainnet.g.alchemy.com/v2/:apiKey")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```
