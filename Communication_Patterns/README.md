# Learning: Request-Response, Polling & Server-Sent Events (SSE)

This repository documents my hands-on exploration of various backend-client communication models. It includes code samples, experiments, and notes on different approaches for data transmission between the server and client.

## Topics Covered

### 1. Request-Response Model

- Traditional HTTP model where a client sends a request and waits for a server response.
- Simple, stateless, and widely used in RESTful API design.
- Example: Express.js `GET`, `POST`, `PUT`, `DELETE` routes.

### 2. Polling

#### a. Short Polling

- The client makes repeated requests to the server at regular intervals (e.g., every 5 seconds).
- The server responds immediately, regardless of whether new data is available.
- Simple to implement but can be inefficient and increase server load.

#### b. Long Polling

- The client sends a request, and the server holds the request open until new data is available.
- Once data is sent, the client immediately re-initiates the request.
- More efficient than short polling but still resource-intensive under heavy load.

### 3. Server-Sent Events (SSE)

- One-way communication: server pushes updates to the client over a single HTTP connection.
- Ideal for real-time notifications or streaming updates.
- Native support in most modern browsers using the `EventSource` interface.
- Efficient for use cases like progress updates, alerts, or server-side monitoring dashboards.
