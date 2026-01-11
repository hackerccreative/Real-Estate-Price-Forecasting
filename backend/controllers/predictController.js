const { spawn } = require('child_process');
const path = require('path');

exports.predict = (req, res) => {
    const { locality, model_type, base_year } = req.body;

    if (!locality || !model_type) {
        return res.status(400).json({ error: 'Missing locality or model_type' });
    }

    const inputData = {
        task: 'predict',
        locality,
        model_type,
        base_year
    };

    // Path to the Python script
    // backend is at root/backend
    // ml is at root/ml
    const scriptPath = path.join(__dirname, '..', '..', 'ml', 'predict.py');

    // Spawn Python process
    const pythonProcess = spawn('python', [scriptPath, JSON.stringify(inputData)]);

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
            return res.status(500).json({ error: 'Prediction failed', details: errorString });
        }

        try {
            const result = JSON.parse(dataString);
            if (result.error) {
                return res.status(400).json({ error: result.error });
            }
            res.json(result);
        } catch (e) {
            console.error('Failed to parse Python output:', dataString);
            res.status(500).json({ error: 'Failed to parse prediction results' });
        }
    });
};
