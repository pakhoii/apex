# Backend Documentation

## Overview
This document provides a comprehensive guide to the backend of the project, including the Python toolchain, environment setup, and workflow management. The backend leverages `uv`, a fast Python package manager, for managing dependencies and environments.

---

## Python Toolchain: `uv`

### Installation
To install `uv`, refer to the official [installation guide](https://docs.astral.sh/uv/getting-started/installation/#__tabbed_1_1).

### Command Overview
Once `uv` is installed, you can view the list of available commands by typing `uv` in the terminal. Below is a summary of the key commands:

```
uv
An extremely fast Python package manager.

Usage: uv [OPTIONS] <COMMAND>

Commands:
  run      Run a command or script
  init     Create a new project
  add      Add dependencies to the project
  remove   Remove dependencies from the project
  sync     Update the project's environment
  lock     Update the project's lockfile
  export   Export the project's lockfile to an alternate format
  tree     Display the project's dependency tree
  tool     Run and install commands provided by Python packages
  python   Manage Python versions and installations
  pip      Manage Python packages with a pip-compatible interface
  venv     Create a virtual environment
  build    Build Python packages into source distributions and wheels
  publish  Upload distributions to an index
  cache    Manage uv's cache
  self     Manage the uv executable
  version  Display uv's version
  help     Display documentation for a command
```

For detailed information on each command, use `uv help`.

### Python Version
To ensure consistency across development environments, Python 3.12 is the standard version for this project.

### Project Initialization
The project has already been initialized using the following command:

```
uv init --python 3.12
```

> **Note:** The virtual environment has already been created by `uv`. There is no need to create it again. Simply activate the environment and proceed.

### Managing Dependencies

#### Adding Dependencies
To add a new package, use the following command:

```
uv add <package_name>
```
For example, to add the `requests` package:

```
uv add requests
```
This updates the `pyproject.toml` file under the `[project]` section:

```
[project]
name = "test"
version = "0.1.0"
description = "Add your description here"
readme = "README.md"
requires-python = ">=3.12"
dependencies = [
    "requests>=2.32.5",  # Newly added package
]
```

#### Installing Dependencies
To install all dependencies listed in `pyproject.toml`, run:

```
uv sync
```
This command automatically ensures the virtual environment is up-to-date.

#### Removing Dependencies
To remove an installed package, use:

```
uv remove <package_name>
```
For example:

```
uv remove requests
```

---

## Virtual Environment

### Activation
To activate the virtual environment:

#### macOS/Linux
```
source .venv/bin/activate
```

#### Windows (PowerShell)
```
.venv\Scripts\Activate
```

> **Note:** The virtual environment is managed by `uv` and does not need to be manually created.

---

## Environment Configuration

### Setup .env file
Copy the example environment file and configure it:

```bash
cp .env.example .env
```

### Configure the following values in `.env`:

| Variable | Description |
|----------|-------------|
| `SECRET_KEY` | Generate a random key: `openssl rand -hex 32` |
| `MAIL_USERNAME` | Your Gmail address |
| `MAIL_PASSWORD` | [Gmail App Password](https://support.google.com/accounts/answer/185833) |
| `MAIL_FROM` | Your Gmail address (same as MAIL_USERNAME) |
| `OTP_SECRET_KEY` | Generate a random key: `openssl rand -hex 32` |

> **Note:** The application will run without `.env` file using default values, but email functionality will not work until you configure the mail settings.

---

## Running the Backend

### Prerequisites
1. Ensure the virtual environment is activated.
2. Start the Docker container hosting the database.

### Execution
Navigate to the `backend` directory and run the following command:

```
uvicorn app.main:app --reload
```
This will start the development server with live reloading enabled.

---

## Notes
- Always use Python 3.12 to maintain compatibility.
- Use `uv` for all package and environment management tasks to ensure consistency across the team.
