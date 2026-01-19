# alchemy_getTokenAllowance

POST https://eth-mainnet.g.alchemy.com/v2/{apiKey}
Content-Type: application/json

Returns the token allowance by spender for a given owner.

Reference: https://alchemy.com/docs/data/token-api/token-api-endpoints/alchemy-get-token-allowance

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: alchemy_getTokenAllowance
  version: alchemy_getTokenAllowance
paths:
  /{apiKey}:
    post:
      operationId: alchemy-get-token-allowance
      summary: alchemy_getTokenAllowance
      description: Returns the token allowance by spender for a given owner.
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
          description: The amount that the spender is allowed to withdraw from the owner.
          content:
            application/json:
              schema:
                type: string
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                tokenAllowanceRequest:
                  $ref: >-
                    #/components/schemas/alchemy_getTokenAllowance_Param_tokenAllowanceRequest
                  description: >
                    An object specifying the token contract address, the owner
                    address, and the spender address.
              required:
                - tokenAllowanceRequest
components:
  schemas:
    alchemy_getTokenAllowance_Param_tokenAllowanceRequest:
      type: object
      properties:
        contract:
          type: string
          description: 20-byte token contract address.
        owner:
          type: string
          description: 20-byte address of the owner.
        spender:
          type: string
          description: 20-byte address of the spender.
      required:
        - contract
        - owner
        - spender

```

## SDK Code Examples

```python
import requests

url = "https://eth-mainnet.g.alchemy.com/v2/:apiKey"

payload = [
    {
        "contract": "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
        "owner": "0xf1a726210550c306a9964b251cbcd3fa5ecb275d",
        "spender": "0xdef1c0ded9bec7f1a1670819833240f027b25eff"
    }
]
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=payload, headers=headers)

print(response.json())
```

```javascript
const url = 'https://eth-mainnet.g.alchemy.com/v2/:apiKey';
const options = {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: '[{"contract":"0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270","owner":"0xf1a726210550c306a9964b251cbcd3fa5ecb275d","spender":"0xdef1c0ded9bec7f1a1670819833240f027b25eff"}]'
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

	payload := strings.NewReader("[\n  {\n    \"contract\": \"0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270\",\n    \"owner\": \"0xf1a726210550c306a9964b251cbcd3fa5ecb275d\",\n    \"spender\": \"0xdef1c0ded9bec7f1a1670819833240f027b25eff\"\n  }\n]")

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
request.body = "[\n  {\n    \"contract\": \"0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270\",\n    \"owner\": \"0xf1a726210550c306a9964b251cbcd3fa5ecb275d\",\n    \"spender\": \"0xdef1c0ded9bec7f1a1670819833240f027b25eff\"\n  }\n]"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.post("https://eth-mainnet.g.alchemy.com/v2/:apiKey")
  .header("Content-Type", "application/json")
  .body("[\n  {\n    \"contract\": \"0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270\",\n    \"owner\": \"0xf1a726210550c306a9964b251cbcd3fa5ecb275d\",\n    \"spender\": \"0xdef1c0ded9bec7f1a1670819833240f027b25eff\"\n  }\n]")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://eth-mainnet.g.alchemy.com/v2/:apiKey', [
  'body' => '[
  {
    "contract": "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    "owner": "0xf1a726210550c306a9964b251cbcd3fa5ecb275d",
    "spender": "0xdef1c0ded9bec7f1a1670819833240f027b25eff"
  }
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
request.AddParameter("application/json", "[\n  {\n    \"contract\": \"0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270\",\n    \"owner\": \"0xf1a726210550c306a9964b251cbcd3fa5ecb275d\",\n    \"spender\": \"0xdef1c0ded9bec7f1a1670819833240f027b25eff\"\n  }\n]", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = [
  [
    "contract": "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    "owner": "0xf1a726210550c306a9964b251cbcd3fa5ecb275d",
    "spender": "0xdef1c0ded9bec7f1a1670819833240f027b25eff"
  ]
] as [String : Any]

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
