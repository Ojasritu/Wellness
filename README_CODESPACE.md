# Codespaces Setup (Hindi / Hinglish)

Yeh file batati hai kaise ek naye collaborator Codespace open karke aage ka kaam continue kare. Simple steps aur required commands niche diye gaye hain.

1) Codespace open karna
- GitHub repo page par jao: `https://github.com/Ojasritu/wellness`
- **Code → Codespaces → New codespace** select karo (ya `Code` button se `Codespaces` tab). Agar aap collaborator ho aur repo access ho, to aap Codespace create kar paoge.

2) Codespaces secrets set karna (important)
- Codespace mein workflow secrets by default available nahi hote — isliye Codespaces-specific secrets set karne honge. Repo owner ya jis account ke paas permission hai, woh yeh steps kare:
  - Repo → Settings → Codespaces → Secrets → New repository secret
  - Add these secrets (same values jo aap Actions mein add kiye):
    - `RAILWAY_API_TOKEN`
    - `RAILWAY_PROJECT_ID`
    - `GODADDY_KEY`
    - `GODADDY_SECRET`
    - `DOMAIN` (set to `ojasritu.co.in`)
    - `GODADDY_RECORD_NAME` (set to `www`)

3) Devcontainer details
- Repository mein `.devcontainer/devcontainer.json` hai. Codespace create karte waqt yeh image use karega (Python 3.11) aur Node 18 feature install karega.
- Post-create commands automatically run honge: backend deps install, frontend `npm ci`, aur `scripts/*.sh` ko executable banaya jayega.
 - Post-create commands automatically run honge: backend deps install, frontend `npm ci`, aur `scripts/*.sh` ko executable banaya jayega.
 - Dev database ke liye **by-default superuser nahin banaya jayega** (to avoid overriding any existing admin). Seeder ab default mein sirf test users create karega:
   - Test users: `testuser1` / `testpass1`, `testuser2` / `testpass2`

  Agar aap explicitly dev superuser create karna chahte ho to Codespaces secrets mein pehle yeh set karo BEFORE creating the Codespace:
  - `DEV_CREATE_SUPERUSER` = `1`
  - `DEV_SUPERUSER_USERNAME` = desired username
  - `DEV_SUPERUSER_EMAIL` = desired email
  - `DEV_SUPERUSER_PASSWORD` = desired password

  Seeder script will create the superuser only when `DEV_CREATE_SUPERUSER=1` is present. This prevents accidental overriding of existing admin credentials.

4) Common commands to run inside Codespace (copy-paste)
- Projekt root par aake:
  ```bash
  # Install backend deps (if not already)
  python -m pip install --upgrade pip
  pip install -r requirements.txt

  # Frontend build
  cd frontend
  npm ci
  npm run build
  cd ..

  # Make scripts executable
  chmod +x scripts/*.sh
  ```

- Railway deploy (will actually deploy):
  ```bash
  export RAILWAY_API_TOKEN="$RAILWAY_API_TOKEN"
  export RAILWAY_PROJECT_ID="$RAILWAY_PROJECT_ID"
  ./scripts/deploy_railway.sh
  # After deploy, railway_host.txt should be created with host (e.g., your-app.railway.app)
  cat railway_host.txt
  ```

- Test GoDaddy update (prints/executes depending on script):
  ```bash
  # To only print the curl command (safe):
  export GODADDY_KEY="$GODADDY_KEY"
  export GODADDY_SECRET="$GODADDY_SECRET"
  export DOMAIN="$DOMAIN"
  export RAILWAY_HOST="$(cat railway_host.txt || echo '')"
  ./scripts/print_godaddy_command.sh

  # To run the actual update (be careful):
  ./scripts/update_godaddy.sh
  ```

5) Export / Import workflow (superuser + product images)

Export (from source environment where the desired superuser and product images live):

```bash
# create exports (includes db.sqlite3, fixtures_all.json, and media.tar.gz if present)
chmod +x scripts/export_backend.sh
./scripts/export_backend.sh /tmp/my-exports

# check /tmp/my-exports for db.sqlite3 and media.tar.gz (product images)
ls -la /tmp/my-exports
```

Transfer `/tmp/my-exports` securely to the collaborator or push to a private storage.

Import (on the new Codespace where you want exact superuser and product images):

Option A — Full DB replacement (recommended if you want exact replica including superuser):

```bash
# copy the exported folder into Codespace, e.g. to /workspaces/wellness/exports
chmod +x scripts/import_backend.sh
./scripts/import_backend.sh /workspaces/wellness/exports --use-db

# after import, run migrations/collectstatic if needed
python manage.py migrate
python manage.py collectstatic --noinput
```

Option B — Load fixtures + extract media (safer; does not replace DB):

```bash
./scripts/import_backend.sh /workspaces/wellness/exports
python manage.py migrate
python manage.py collectstatic --noinput
```

Notes:
- `--use-db` replaces local `db.sqlite3` with exported DB and will bring the superuser and all data exactly as in source. Use only when you intend to overwrite the local DB.
- `media.tar.gz` contains product images and will be extracted to the repo `media/` folder, so product image URLs will resolve as in source.

6) Verify locally (optional)
- Run Django dev server (for quick check):
  ```bash
  python manage.py migrate --noinput
  python manage.py runserver 0.0.0.0:8000
  ```
- Open forwarded port `8000` from Codespace to view site. Also check Vite dev server port `5173` if needed.

6) Troubleshooting tips
- Agar deploy script interactive message kare to check `RAILWAY_API_TOKEN` sahi hai aur token ko Codespaces secrets me set kiya gaya hai.
- Agar `railway_host.txt` nahi banta to `scripts/deploy_railway.sh` logs dekho (it prints errors). Use `railway status` manually inside Codespace if CLI installed.
- GoDaddy changes propagate hone me kuch minutes lag sakte hain — `dig`/`nslookup` se check karo.

7) Security note
- Codespaces secrets are sensitive — do not echo them in public. Agar aap kisi log/share me paste karna chaho to values redact karo.

8) Agar aap chahte ho main Codespace par direct check karun
- Main aapke Codespace environment ko directly access nahi kar sakta. Lekin aap jab Codespace open karoge, terminal logs/outputs yahan paste karo, main turant help kar dunga.
