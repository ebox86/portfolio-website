#!/usr/bin/env bash
set -euo pipefail

# Update Cloud Run service env vars from a local env file.
# Defaults can be overridden via env: SERVICE, REGION, PROJECT, ENV_FILE.

SERVICE="${SERVICE:-portfolio}"
REGION="${REGION:-us-east4}"
PROJECT="${PROJECT:-portfolio-website-403402}"
ENV_FILE="${ENV_FILE:-.env}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Env file not found: $ENV_FILE. Copy .env.example to $ENV_FILE and fill in values." >&2
  exit 1
fi

echo "Updating Cloud Run service '$SERVICE' in project '$PROJECT' (region: $REGION) using env file: $ENV_FILE"
gcloud run services update "$SERVICE" \
  --project "$PROJECT" \
  --region "$REGION" \
  --platform managed \
  --env-vars-file "$ENV_FILE"
