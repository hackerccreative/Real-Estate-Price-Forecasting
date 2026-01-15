const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

exports.predict = (req, res) => {
  const { locality, model_type, base_year } = req.body;

  // 1️⃣ Validate input
  if (!locality || !model_type) {
    return res.status(400).json({
      error: "Missing required fields: locality or model_type",
    });
  }

  // 2️⃣ Prepare input payload for Python
  const inputData = {
    task: "predict",
    locality,
    model_type,
    base_year,
  };

  // 3️⃣ Absolute path to ML script (repo root aware)
  // Render runs from repo root
  const scriptPath = path.join(process.cwd(), "ml", "predict.py");

  // 4️⃣ Decide Python executable
  // Local dev: use venv if exists
  // Render/Linux: always python3
  const localVenvPython = path.join(
    process.cwd(),
    ".venv",
    "Scripts",
    "python.exe"
  );

  let pythonCommand = "python3";
  if (process.platform === "win32" && fs.existsSync(localVenvPython)) {
    pythonCommand = localVenvPython;
  }

  // 5️⃣ Spawn Python process
  const pythonProcess = spawn(pythonCommand, [
    scriptPath,
    JSON.stringify(inputData),
  ]);

  let stdoutData = "";
  let stderrData = "";

  // 6️⃣ Capture output
  pythonProcess.stdout.on("data", (data) => {
    stdoutData += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    stderrData += data.toString();
  });

  // 7️⃣ Handle process end
  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      console.error("❌ Python error:", stderrData);
      return res.status(500).json({
        error: "Prediction failed",
        details: stderrData,
      });
    }

    try {
      const result = JSON.parse(stdoutData);

      if (result.error) {
        return res.status(400).json({ error: result.error });
      }

      return res.json(result);
    } catch (err) {
      console.error("❌ JSON parse error:", stdoutData);
      return res.status(500).json({
        error: "Invalid response from ML engine",
      });
    }
  });
};
