# FastAPI Project

## Overview

This project is a backend API built with **FastAPI**, a modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints.

## Features

- Fast and efficient API development
- Automatic interactive API documentation (Swagger UI and ReDoc)
- Easy request validation and serialization using Pydantic
- Asynchronous support for high performance
- Dependency injection system

## Requirements

- Python 3.7 or higher
- [FastAPI](https://fastapi.tiangolo.com/)
- [Uvicorn](https://www.uvicorn.org/) (ASGI server)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/your-fastapi-project.git
   cd your-fastapi-project

### CMD to run the api's

```bash
poetry run uvicorn main:app --reload --host 0.0.0.0 --port 8080
```