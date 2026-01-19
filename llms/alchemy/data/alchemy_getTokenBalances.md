# alchemy_getTokenBalances

POST https://eth-mainnet.g.alchemy.com/v2/{apiKey}
Content-Type: application/json

Returns ERC-20 token balances for a given address.

Reference: https://alchemy.com/docs/data/token-api/token-api-endpoints/alchemy-get-token-balances

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: alchemy_getTokenBalances
  version: alchemy_getTokenBalances
paths:
  /{apiKey}:
    post:
      operationId: alchemy-get-token-balances
      summary: alchemy_getTokenBalances
      description: Returns ERC-20 token balances for a given address.
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
          description: >-
            An object containing the queried address and an array of token
            balance objects.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AlchemyGetTokenBalancesResult'
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                address:
                  type: string
                  default: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
                  description: |
                    A 20-byte wallet address.
                tokenSpec:
                  $ref: >-
                    #/components/schemas/alchemy_getTokenBalances_Param_tokenSpec
                  description: >
                    A token specification: - The string "erc20" -
                    "NATIVE_TOKEN"  - "DEFAULT_TOKENS" (deprecated) - An array
                    of token contract addresses.
                options:
                  $ref: '#/components/schemas/alchemy_getTokenBalances_Param_options'
                  description: |
                    Optional pagination options.
              required:
                - address
components:
  schemas:
    AlchemyGetTokenBalancesParamTokenSpec0:
      type: string
      enum:
        - value: erc20
        - value: DEFAULT_TOKENS
        - value: NATIVE_TOKEN
      default: erc20
    alchemy_getTokenBalances_Param_tokenSpec:
      oneOf:
        - $ref: '#/components/schemas/AlchemyGetTokenBalancesParamTokenSpec0'
        - type: array
          items:
            type: string
    alchemy_getTokenBalances_Param_options:
      type: object
      properties:
        pageKey:
          type: string
          description: Used for pagination if more results are available.
        maxCount:
          type: integer
          default: 100
          description: Maximum number of token balances to return per call (capped at 100).
    AlchemyGetTokenBalancesResultTokenBalancesItems:
      type: object
      properties:
        contractAddress:
          type: string
          description: The ERC-20 contract address.
        tokenBalance:
          type: string
          description: >-
            Hex-encoded string of the token balance, or null if error is
            present.
    AlchemyGetTokenBalancesResult:
      type: object
      properties:
        address:
          type: string
          description: Address for which token balances were returned.
        tokenBalances:
          type: array
          items:
            $ref: >-
              #/components/schemas/AlchemyGetTokenBalancesResultTokenBalancesItems
          description: >-
            Array of token balance objects. Exactly one of tokenBalance or error
            is non-null.

```

## SDK Code Examples

```python
import requests

url = "https://eth-mainnet.g.alchemy.com/v2/:apiKey"

payload = ["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", ["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"]]
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=payload, headers=headers)

print(response.json())
```

```javascript
const url = 'https://eth-mainnet.g.alchemy.com/v2/:apiKey';
const options = {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: '["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"]]'
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

	payload := strings.NewReader("[\n  \"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045\",\n  [\n    \"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48\"\n  ]\n]")

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
request.body = "[\n  \"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045\",\n  [\n    \"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48\"\n  ]\n]"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.post("https://eth-mainnet.g.alchemy.com/v2/:apiKey")
  .header("Content-Type", "application/json")
  .body("[\n  \"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045\",\n  [\n    \"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48\"\n  ]\n]")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://eth-mainnet.g.alchemy.com/v2/:apiKey', [
  'body' => '[
  "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  [
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
  ]
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
request.AddParameter("application/json", "[\n  \"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045\",\n  [\n    \"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48\"\n  ]\n]", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", ["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"]] as [String : Any]

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
