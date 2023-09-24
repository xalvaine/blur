#!/bin/bash

OUTPUT="./src/backend.d.ts"
source .env

dtsgen --out "$OUTPUT" --url "$REACT_APP_BACKEND_URL/openapi.json"
prettier --write "$OUTPUT"
