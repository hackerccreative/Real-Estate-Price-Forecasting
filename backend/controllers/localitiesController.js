const { spawn } = require('child_process');
const path = require('path');

exports.getLocalities = (req, res) => {
    const inputData = {
        task: 'get_localities'
    };

    const scriptPath = path.join(__dirname, '..', '..', 'ml', 'predict.py');
    
    // Use .venv Python if available (local dev), otherwise system Python (production)
    const venvPythonPath = path.join(__dirname, '..', '..', '.venv', 'Scripts', 'python.exe');
    const pythonCommand = require('fs').existsSync(venvPythonPath) 
        ? venvPythonPath 
        : (process.platform === 'win32' ? 'python' : 'python3');
    const pythonProcess = spawn(pythonCommand, [scriptPath, JSON.stringify(inputData)]);

    let dataString = '';
    let errorString = '';

    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorString += data.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python script exited with code ${code}`);
            console.error(`Stderr: ${errorString}`);
            return res.status(500).json({ error: 'Failed to fetch localities', details: errorString });
        }

        try {
            const result = JSON.parse(dataString);
            if (result.error) {
                return res.status(400).json({ error: result.error });
            }
            res.json(result); // format: { localities: [...] }
        } catch (e) {
            console.error('Failed to parse Python output:', dataString);
            res.status(500).json({ error: 'Failed to parse localities' });
        }
    });
};
