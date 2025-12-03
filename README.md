# ebox86 Portfolio/Blog

![img](/public/ss.png)

# Setup
## Environment variables
- Build-time (public): `NEXT_PUBLIC_CAPTCHA_KEY`
- Runtime (secret): `CAT_API_KEY`, `MJ_APIKEY_PUBLIC`, `MJ_APIKEY_PRIVATE`, `CAPTCHA_SECRET` (and also set `NEXT_PUBLIC_CAPTCHA_KEY` so the app sees it at runtime).

### Local development
1. Copy `.env.example` to `.env.local` and fill in values.
2. Run `npm run dev` (Next.js loads `.env.local` automatically).

---
## Deploying to Google Cloud Run (GCP)
1. Build the image (inject only the public key):  
   `docker build --build-arg NEXT_PUBLIC_CAPTCHA_KEY=... -t ghcr.io/ebox86/portfolio-website:latest .`
2. Push the image to your registry (GHCR or Artifact Registry).
3. Set runtime env vars on the Cloud Run service: `CAT_API_KEY`, `MJ_APIKEY_PUBLIC`, `MJ_APIKEY_PRIVATE`, `CAPTCHA_SECRET`, `NEXT_PUBLIC_CAPTCHA_KEY`  
   - From the CLI you can run:  
     `./scripts/update-cloud-run-env.sh`  
     (override SERVICE/REGION/PROJECT/ENV_FILE via env vars; defaults: service `portfolio`, region `us-east4`, project `portfolio-website-403402`, env file `.env`).
4. Deploy:  
   `gcloud run deploy portfolio --region=us-central1 --image=ghcr.io/ebox86/portfolio-website:latest --allow-unauthenticated --set-env-vars CAT_API_KEY=...,MJ_APIKEY_PUBLIC=...,MJ_APIKEY_PRIVATE=...,CAPTCHA_SECRET=...,NEXT_PUBLIC_CAPTCHA_KEY=...`

---
## Deploying to Kubernetes
1. Build and push a container image (same as above).
2. Create a `Deployment` that runs the container on port 8080 with env vars for `CAT_API_KEY`, `MJ_APIKEY_PUBLIC`, `MJ_APIKEY_PRIVATE`, `CAPTCHA_SECRET`, `NEXT_PUBLIC_CAPTCHA_KEY`. Use `envFrom` + a `Secret`/`ConfigMap` instead of hardcoding.
3. Expose via a `Service` (ClusterIP) and an `Ingress`/Ingress Controller (NGINX, GKE Ingress, etc.). Example minimal `Service`:
   ```yaml
   apiVersion: v1
   kind: Service
   metadata:
     name: portfolio-web
   spec:
     selector:
       app: portfolio-web
     ports:
       - port: 80
         targetPort: 8080
   ```
4. If the cluster sits behind a load balancer, terminate TLS at the ingress and route to the service.

---
## Deploying on AWS Lambda (serverless)
Next.js can be packed for Lambda using `@sls-next/serverless-component` (Serverless Framework) or `npx @vercel/node` style adapters. High-level steps with Serverless Framework:
1. Install tooling: `npm i -D serverless @sls-next/serverless-component` and add a `serverless.yml`.
2. Configure `serverless.yml`:
   ```yaml
   component: '@sls-next/serverless-component@3.7.0'
   inputs:
     domain: null
     runtime: nodejs18.x
     env:
       CAT_API_KEY: ${env:CAT_API_KEY}
       MJ_APIKEY_PUBLIC: ${env:MJ_APIKEY_PUBLIC}
       MJ_APIKEY_PRIVATE: ${env:MJ_APIKEY_PRIVATE}
       CAPTCHA_SECRET: ${env:CAPTCHA_SECRET}
       NEXT_PUBLIC_CAPTCHA_KEY: ${env:NEXT_PUBLIC_CAPTCHA_KEY}
   ```
3. Export the env vars locally (or use AWS SSM/Secrets Manager) and deploy: `npx serverless`.
4. The component creates Lambda@Edge/API Gateway + S3 for static assets; confirm the generated URL works and set your custom domain via Route 53/ACM if needed.

If you prefer containers on AWS, run the same image on Lambda (container runtime) or ECS/Fargate with an ALB; supply the env vars there.
