const { execSync } = require('child_process');

try {
  // For Windows
  if (process.platform === 'win32') {
    console.log('Attempting to kill process on port 3000 (Windows)...');
    execSync('for /f "tokens=5" %a in (\'netstat -ano ^| find ":3000" ^| find "LISTENING"\') do taskkill /f /pid %a');
  } 
  // For Unix-based systems (macOS, Linux)
  else {
    console.log('Attempting to kill process on port 3000 (Unix)...');
    execSync('lsof -i :3000 | grep LISTEN | awk \'{print $2}\' | xargs kill -9');
  }
  console.log('Successfully killed process on port 3000');
} catch (error) {
  console.log('No process found on port 3000 or failed to kill process');
}