import chalk from "chalk";
import detect from "detect-port";

export const frontendPort = process.env.PORT;
export const backendPort = process.env.VITE_BACKEND_PORT;

// Get the API base URL for both development and production
export const getApiBaseUrl = () => {
  if (process.env.NODE_ENV === "production") {
    // In production, use relative URLs since frontend and backend are on the same domain
    return "";
  }
  // In development, use localhost with the backend port
  return `http://localhost:${backendPort}`;
};

export const getBackendPort = async () => {
  return detect(Number(backendPort))
    .then((_port) => {
      if (Number(backendPort) === _port) {
        console.log(chalk.green(`Backend server running at http://localhost:${backendPort}`));
        return Number(backendPort);
      }

      console.log(
        chalk.red(
          `Failed to start the backend server on port ${backendPort}. \n Starting the backend server on port ${_port}. \n Please update VITE_BACKEND_PORT in the .env file and 'apiUrl' in cypress.json to ${_port}.`
        )
      );
      return _port;
    })
    .catch((err) => {
      console.log(chalk.red(err));
    });
};
