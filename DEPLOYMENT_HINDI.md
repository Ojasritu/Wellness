# Deployment Guide (Hinglish)

Yeh guide bataegi kaise GitHub Actions se Railway pe deploy aur GoDaddy DNS update automate karna hai. Steps simple aur Hinglish mein diye gaye hain.

1) GitHub repository secrets add karo
- `RAILWAY_API_TOKEN`: Railway API token (Personal API key). Use Railway account -> Settings -> API Key.
- `RAILWAY_PROJECT_ID`: Railway project id (jo project aap deploy karna chahte ho).
- `GODADDY_KEY`: GoDaddy API key (production/SSO key).
- `GODADDY_SECRET`: GoDaddy API secret.
- `DOMAIN`: Aapka domain (example: `example.com`).
- `GODADDY_RECORD_NAME` (optional): record name, default `www` (e.g., `www` -> `www.example.com`).

Settings -> Secrets and variables -> Actions -> New repository secret

2) Kya workflow karta hai
- On push to `main`, workflow frontend build karega (`frontend` folder mein `npm ci` and `npm run build`).
- Built files ko `static/frontend/` mein copy karega taaki Django serve kar sake (agar aapki setup mein alag static handling ho to tweak karein).
- Backend dependencies install karega (`pip install -r requirements.txt`).
- `scripts/deploy_railway.sh` run karega jo Railway CLI use karke deploy trigger karega. Yeh script `railway_host.txt` file banata/print karta hai.
- Agar `railway_host.txt` milta hai to usse `RAILWAY_HOST` environment variable set kiya jayega aur fir `scripts/update_godaddy.sh` run hoga jo GoDaddy par CNAME update karega.

3) Local testing (recommended pehle)
- Frontend build test:
  - `cd frontend && npm ci && npm run build`
- Backend linter/test (agar koi ho):
  - `pip install -r requirements.txt`

4) Important notes & troubleshooting
- Railway CLI: `scripts/deploy_railway.sh` non-interactive hona chahiye. Agar CLI behavior change ho to script ko update karo.
- `railway_host.txt` agar nahi ban raha, deployment step logs check karo — repository action logs mein CLI output hoga.
- GoDaddy: Apex domain par CNAME allowed nahi hota; agar aap root domain (`example.com`) chahte ho to A record ya forwarding use karo.
- Secrets ko correct values se bharna zaroori hai; agar workflow fail karta hai to Actions -> build log dekho.

5) Triggering
- Push changes to `main` branch: workflow automatically run karega.

6) Agar aap chaho to main branch se alag branch/PR flow bhi configure kar sakte ho.

7) Further improvements (optional)
- Canary/preview deploys for PRs.
- Add health-check step after Railway deploy to confirm site returns 200.
- Use Railway environment variables API instead of file parsing for robust host lookup.

---
If you want, main yeh sab steps khud configure kar doon (workflow already add kar diya hai). Next step: aap mujhe batao agar secrets add karne mein help chahiye ya main scripts ko aur robust banaun.

8) Specific steps for `ojasritu.co.in` (exact guide)
- Aapka domain: `ojasritu.co.in` — hum recommended approach yeh hai ki `www` subdomain ko Railway host pe point karein, aur root/apex (`ojasritu.co.in`) ko `www` par forward karein.

- Repository mein already automation hai: workflow `/.github/workflows/deploy.yml` aur script `scripts/update_godaddy.sh`.

- Jo main kar sakta hoon (maine kiya):
  - Workflow aur scripts repo mein add kar diye gaye hain.
  - `DEPLOYMENT_HINDI.md` mein yeh specific steps add kiye.

- Jo aapko manually karna padega (step-by-step):
  1. GoDaddy API key banayein:
     - Login GoDaddy -> Account Settings -> Developer -> Create New API Key (Production)
     - Save `GODADDY_KEY` aur `GODADDY_SECRET` securely.
  2. GitHub repo secrets add karein (Settings → Secrets and variables → Actions):
     - `RAILWAY_API_TOKEN`, `RAILWAY_PROJECT_ID`, `GODADDY_KEY`, `GODADDY_SECRET`, `DOMAIN` (set to `ojasritu.co.in`), `GODADDY_RECORD_NAME` (set to `www`).
  3. Push to `main` branch — workflow run hoga. Workflow step `Deploy to Railway` aapke Railway project ko deploy karega and create `railway_host.txt`.
  4. Agar `railway_host.txt` ban jaata hai, workflow `Update GoDaddy DNS` step `scripts/update_godaddy.sh` chalake `www.ojasritu.co.in` ko Railway host pe point karega.
  5. Root domain forward karein: GoDaddy UI se `Forwarding` settings use karke `ojasritu.co.in` → forward to `https://www.ojasritu.co.in` (301 permanent). Yeh step manual hona chahiye kyunki GoDaddy forwarding API thoda alag aur tricky hota hai.

- Manual curl command for GoDaddy (agar aap CLI se karna chahein):
  - Pehle environment vars set karein (locally test ke liye):
    ```bash
    export GODADDY_KEY="<your_key>"
    export GODADDY_SECRET="<your_secret>"
    export DOMAIN="ojasritu.co.in"
    export RAILWAY_HOST="<your_railway_host_from_railway>"
    ```
  - Fir yeh command run karke `www` CNAME set kar sakte ho:
    ```bash
    curl -s -X PUT "https://api.godaddy.com/v1/domains/${DOMAIN}/records/CNAME/www" \
      -H "Authorization: sso-key ${GODADDY_KEY}:${GODADDY_SECRET}" \
      -H "Content-Type: application/json" \
      -d "[ { \"data\": \"${RAILWAY_HOST}\", \"ttl\": 600 } ]"
    ```

- Agar aap chahte ho ki main deploy verify karun, to mujhe `RAILWAY_API_TOKEN` aur `RAILWAY_PROJECT_ID` GitHub secrets add karne ke baad batao; main phir workflow run logs check karke aur domain status dekhke help kar dunga.

9) Short summary — kya main kar sakta hoon aur kya aapko karna hai
- Main kar sakta hoon (already kiya): workflow aur scripts add, guide update.
- Aapko karna hoga: GoDaddy API key banana, GitHub repo secrets add karna, GoDaddy UI mein forwarding set karna (apex → www). Agar secrets add kar do, main deploy logs check kar ke DNS update verify kar dunga.

