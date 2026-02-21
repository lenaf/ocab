# Deployment Guide for ESP Site

## Database Setup

Your database has been cleaned and exported. Here's how to deploy it to production:

### Current Export

- **File**: `data/database-export-1771699908703.json`
- **Size**: 0.35 MB
- **Contents**:
  - 23 pages
  - 10 blog posts
  - 0 events
  - 0 press articles
  - 195 media files
  - Site settings
  - Navigation

### Production Deployment Steps

1. **Create MongoDB Atlas Production Database**
   ```bash
   # In MongoDB Atlas:
   # 1. Create new database cluster (or use existing)
   # 2. Create database named: ourcity-prod (or esp-prod)
   # 3. Create database user with read/write access
   # 4. Get connection string
   ```

2. **Deploy to Vercel**
   ```bash
   # Clone/push this repo to new GitHub repo for ESP
   # In Vercel:
   # 1. Import the GitHub repo
   # 2. Add environment variables:

   MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/ourcity-prod
   PAYLOAD_SECRET=<generate-random-32-char-string>
   NEXT_PUBLIC_SERVER_URL=https://your-domain.vercel.app
   ```

3. **Import Database to Production**

   After first deploy completes:

   ```bash
   # Set production MongoDB URI
   export MONGODB_URI="mongodb+srv://USER:PASS@cluster.mongodb.net/ourcity-prod"

   # Run import script
   npx tsx scripts/importDatabase.ts
   ```

4. **Upload Media Files**

   The media files are in `/public/migrated-media/` but excluded from git (too large).

   Options:
   - Upload manually via admin panel
   - Use a cloud storage service (Cloudinary, AWS S3)
   - Deploy media folder separately

### Alternative: MongoDB Tools

You can also use MongoDB's native tools:

```bash
# Export from dev
mongodump --uri="mongodb+srv://USER:PASS@cluster.mongodb.net/ourcity-dev" --out=./dump

# Import to prod
mongorestore --uri="mongodb+srv://USER:PASS@cluster.mongodb.net/ourcity-prod" ./dump/ourcity-dev
```

## Quick Deploy Checklist

- [ ] Create production MongoDB database
- [ ] Deploy to Vercel with environment variables
- [ ] Run import script to populate database
- [ ] Create admin user via `/admin` page
- [ ] Test all pages load correctly
- [ ] Upload/migrate media files if needed
- [ ] Set up custom domain

## Notes

- The export file is in `/data/` directory (gitignored by default)
- Media files are NOT included in JSON export (use Payload's media migration or manual upload)
- Make sure to update `NEXT_PUBLIC_SERVER_URL` to your production domain
- Generate a secure `PAYLOAD_SECRET` for production (32+ random characters)
