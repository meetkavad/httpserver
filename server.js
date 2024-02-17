const http = require("http");
const url = require("url");

let dataStore = {};

// Creating Server :
const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);
  const path = reqUrl.pathname;
  const method = req.method;

  // Helper function to send response
  const sendResponse = (message, statusCode, body) => {
    res.writeHead(statusCode, {
      "Content-Type": "application/json",
    });
    res.write(message);
    res.end(JSON.stringify(body));
  };

  // Routes handling
  if (path === "/data" && method === "GET") {
    sendResponse("Data from Server : ", 200, dataStore);
  } else if (path === "/data" && method === "HEAD") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end();
  } else if (path === "/data" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString(); // Accumulate the JSON data
    });
    req.on("end", () => {
      try {
        const newData = JSON.parse(body); // Parse JSON data
        console.log(newData);
        dataStore = newData; // Assign the parsed JSON data to dataStore
        sendResponse("Data Sent to Server !", 201, {
          message: "Data created successfully",
        });
      } catch (error) {
        sendResponse("Failure sending Data to Server!", 400, {
          error: "Invalid JSON format",
        });
      }
    });
  } else if (method === "PUT" && path === "/data") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString(); // Accumulate the JSON data
    });
    req.on("end", () => {
      try {
        const newData = JSON.parse(body); // Parse JSON data
        dataStore = newData; // Assign the parsed JSON data to dataStore
        sendResponse("replacing data : ", 200, {
          message: "Data updated successfully",
        });
      } catch (error) {
        sendResponse("request failed ! ", 400, {
          error: "Invalid JSON format",
        });
      }
    });
  } else if (method === "PATCH") {
    if (path === "/data") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString(); // Accumulate the JSON data
      });
      req.on("end", () => {
        try {
          const newData = JSON.parse(body); // Parse JSON data
          Object.assign(dataStore, newData); // Merge the parsed JSON data with existing dataStore
          sendResponse("updating data : ", 200, {
            message: "Data patched successfully",
          });
        } catch (error) {
          sendResponse("request failed ! ", 400, {
            error: "Invalid JSON format",
          });
        }
      });
    } else {
      sendResponse(404, { error: "Not Found" });
    }
  } else if (path === "/data" && method === "DELETE") {
    dataStore = {};
    sendResponse("Deleting data from server ", 204, { message: "No content" });
  } else if (path === "/redirect" && method === "GET") {
    res.writeHead(302, { Location: "/data" });
    res.end();
  } else if (path === "/unauthorized" && method === "GET") {
    sendResponse("", 401, { error: "Unauthorized" });
  } else if (path === "/forbidden" && method === "GET") {
    sendResponse("", 403, { error: "Forbidden" });
  } else if (path === "/notfound" && method === "GET") {
    sendResponse("", 404, { error: "Not Found" });
  } else if (path === "/servererror" && method === "GET") {
    sendResponse("", 500, { error: "Internal Server Error" });
  } else if (path === "/notimplemented" && method === "GET") {
    sendResponse("", 501, { error: "Not Implemented" });
  } else if (path === "/serviceunavailable" && method === "GET") {
    sendResponse("", 503, { error: "Service Unavailable" });
  } else {
    sendResponse(404, { error: "Not Found" });
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
