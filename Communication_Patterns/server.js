import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readFilePath = path.join(__dirname, "bigfile.txt");
const writeFilePath = path.join(__dirname, "output.txt");

const uploadDir = path.join(__dirname, "uploads");

const app = express();

app.use(express.json());
app.use(cors());

// Uploading Files
app.post("/upload", (req, res) => {
  try {
    console.log(uploadDir);
    const writeFilePath = path.join(uploadDir, `File-${Date.now()}`);
    const writeStream = fs.createWriteStream(writeFilePath);

    req.pipe(writeStream);

    writeStream.on("finish", () => {
      console.log("Upload complete:", writeFilePath);
      res.status(200).json({ success: true, filePath: writeFilePath });
    });
  } catch (error) {}
});

// Reading File

const readStream = fs.createReadStream(readFilePath, {
  encoding: "utf-8",
  highWaterMark: 1024 * 64,
});

readStream.on("data", (chunk) => {
  console.log(chunk, chunk.length);
});

readStream.on("end", () => {
  console.log("✅ Finished reading big file");
});

readStream.on("error", (err) => {
  console.error("❌ Error reading file:", err);
});

const writeStream = fs.createWriteStream(writeFilePath);
writeStream.write("hello");
writeStream.write("world");
writeStream.on("finish", () => {
  console.log("Writing file completed");
});

const messages = [
  {
    id: 1,
    message: "jdhjwdwhdw",
  },
];
let messageId = 1;

app.post("/messages", (req, res) => {
  messageId++;
  messages.push({ id: messageId, message: req.body.message });
  console.log(messages);
  res.status(200).json({
    success: true,
  });
});

const jobs = [
  {
    id: 1,
    name: "Soft Engr",
    status: 100,
  },
];

// SSE - Server Side Events

app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.write(`data: Hello from server 👋\n\n`);
  const interval = setInterval(() => {
    const now = new Date().toLocaleTimeString();
    res.write(`data: ${now}\n\n`);
  }, 1000);

  req.on("close", () => {
    clearInterval(interval);
  });
});

// Short Polling

app.post("/jobs", (req, res) => {
  console.log("Job Posting");
  try {
    const id = jobs.length + 1;
    jobs.push({
      id,
      name: req.body.name,
      status: 0,
    });

    const interval = setInterval(() => {
      const j = jobs.find((job) => job.id === id);
      if (j.status >= 100) {
        clearInterval(interval);
      } else {
        j.status += 10;
      }
    }, 1000);

    res.json({ id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/jobs/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const j = jobs.find((job) => job.id === Number(id));
    console.log(j);

    return res.json({
      status: j.status,
    });
  } catch (error) {}
});

// Long Polling
app.get("/messages", (req, res) => {
  const lastId = req.query.lastMessageId;
  console.log(lastId);
  if (!lastId) {
    return res.status(200).json({
      success: true,
      data: messages,
    });
  }

  const startDate = Date.now();

  const check = () => {
    if (messageId > lastId) {
      const newMessages = messages.filter((m) => m.id > lastId);
      return res.status(200).json({
        success: true,
        data: newMessages,
      });
    } else if (Date.now() - startDate > 2000) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    } else {
      setTimeout(check, 1000);
    }
  };

  check();
});

app.listen(9000, () => {
  console.log("Server is running in port 9000");
});
