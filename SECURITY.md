# NexOps Security Policy & Architecture Guide

## Overview

NexOps is a production-grade DevOps intelligence & automation platform designed to process infrastructure telemetry, deployment events, and incident signals securely across multi-tenant environments.

This document details the security architecture, data protection controls, Row-Level Security (RLS) enforcement, cryptographic standards, and operational runbooks for key rotation.

---

## 🛡️ Security Architecture & Controls

### 1. Authentication & Identity
- **Provider:** Firebase Admin SDK (Google OAuth 2.0).
- **Session Tokens:** Cryptographically signed JWTs verified on every HTTP request and WebSocket connection via `get_current_user`.
- **Environment Isolation:** Development/mock token bypasses are strictly restricted to `APP_ENV="local"`. Production and staging enforce 100% token verification.

### 2. Multi-Tenant Isolation (Row-Level Security)
- **Database Engine:** PostgreSQL Row-Level Security (RLS).
- **Tenant Context:** Enforced per-transaction using PostgreSQL Session Configuration:
  ```sql
  SELECT set_config('nexops.current_workspace_id', :workspace_id, false);
  SELECT set_config('nexops.current_user_id', :user_id, false);
  SELECT set_config('nexops.bypass_rls', 'false', false);
  ```
- **Safe RLS Bypass Context Manager:** Unauthenticated webhook handlers utilize an `asynccontextmanager` (`app.core.rls.rls_bypass`) ensuring RLS bypass is unconditionally reset to `false` in a `finally` block on exit:
  ```python
  async with rls_bypass(session):
      # Queries requiring cross-workspace resolution (e.g. webhook HMAC verification)
      ...
  # nexops.bypass_rls is guaranteed false here, even on exception or early return
  ```

### 3. Encryption at Rest & In Transit
- **Data in Transit:** Enforced TLS 1.3/HTTPS across all API endpoints and WebSockets.
- **Sensitive Secrets in Rest:** GitHub OAuth tokens, PagerDuty API tokens, and webhook secrets are encrypted before storage using **Fernet (AES-128-CBC + HMAC-SHA256)**:
  - Cryptographic key provided via `ENCRYPTION_KEY` setting.
- **Webhook Integrity:**
  - GitHub webhooks verified using HMAC-SHA256 signatures (`X-Hub-Signature-256`) via `hmac.compare_digest` (constant-time execution against timing attacks).
  - PagerDuty webhook URLs embed HMAC-SHA256 signed `uid` tokens (`_make_pd_uid_token`) to prevent workspace-spoofing attacks.

### 4. Network & Browser Hardening
- **CORS Policy:** Strict explicit origin allowlist (`cors_origins_list` + configured frontend origins). Wildcard origins are disabled.
- **HTTP Security Headers (`next.config.mjs`):**
  - `Content-Security-Policy`: Restricts scripts, styles, images, and WebSocket connect origins to verified domains.
  - `X-Frame-Options: SAMEORIGIN`: Prevents clickjacking attacks.
  - `X-Content-Type-Options: nosniff`: Prevents MIME-sniffing.
  - `Strict-Transport-Security`: Enforces HTTPS for 1 year (`max-age=31536000`).
  - `Permissions-Policy`: Disables camera, microphone, geolocation, and payment APIs.
- **Rate Limiting:**
  - IP-based rate limiting via `SlowAPIMiddleware`.
  - `ProxyHeadersMiddleware` configured with `trusted_hosts="*"` to ensure real client IPs are read from `X-Forwarded-For` behind Render's load balancer.

---

## 🔑 Operational Runbook: Secret Key Rotation

If the production `ENCRYPTION_KEY` needs to be rotated, follow this zero-downtime key rotation runbook using the provided migration utility:

### Key Rotation Steps

1. **Generate a New Base64 Fernet Key:**
   ```bash
   python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
   ```

2. **Execute the Migration Script:**
   Run the CLI utility in the backend directory providing the current (`old-key`) and new (`new-key`) keys:
   ```bash
   cd backend
   python scripts/rotate_key.py --old-key <CURRENT_ENCRYPTION_KEY> --new-key <NEW_ENCRYPTION_KEY>
   ```

3. **Update Environment Settings:**
   Update `ENCRYPTION_KEY` in Render / server environment variables with `<NEW_ENCRYPTION_KEY>` and redeploy the backend service.

4. **Verify Cache Invalidation:**
   The rotation script automatically flushes `nexops:user:*` keys in Redis. Verify that users can re-authenticate cleanly.

---

## 📬 Reporting Vulnerabilities

If you discover a potential security issue in NexOps, please do not create a public GitHub issue. Send a report to `akaashgithub21@gmail.com` including steps to reproduce. Critical issues will be triaged within 24 hours.
