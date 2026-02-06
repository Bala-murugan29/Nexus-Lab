# ✅ NEXUS.LAB Installation Checklist

Follow this checklist to get NEXUS.LAB running on your machine.

## Prerequisites

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm 9+ installed (`npm --version`)
- [ ] Docker Desktop installed and running
- [ ] Git installed
- [ ] At least 4GB RAM available
- [ ] At least 2GB disk space available

## Installation Steps

### Step 1: Install Dependencies
```bash
npm install
```
- [ ] Command completed successfully
- [ ] No error messages
- [ ] `node_modules` folder created

### Step 2: Start Docker Services
```bash
docker-compose up -d
```
- [ ] PostgreSQL container started (port 5432)
- [ ] Neo4j container started (ports 7474, 7687)
- [ ] Redis container started (port 6379)
- [ ] All containers show "healthy" status

Verify with:
```bash
docker-compose ps
```

### Step 3: Generate Prisma Client
```bash
npm run db:generate
```
- [ ] Prisma client generated
- [ ] No TypeScript errors
- [ ] `@prisma/client` available

### Step 4: Push Database Schema
```bash
npm run db:push
```
- [ ] Database schema created
- [ ] Tables created successfully
- [ ] No connection errors

### Step 5: Seed Database (Optional)
```bash
npm run db:seed
```
- [ ] Test data created
- [ ] Sample user created
- [ ] Sample project created
- [ ] Knowledge nodes created

### Step 6: Start Development Server
```bash
npm run dev
```
- [ ] All packages building
- [ ] No compilation errors
- [ ] Server started on port 3000

### Step 7: Verify Installation

Visit these URLs:
- [ ] App running at http://localhost:3000
- [ ] Neo4j Browser at http://localhost:7474
- [ ] Prisma Studio with `npm run db:studio`

## Verification Tests

### Test 1: UI Loading
- [ ] Homepage loads without errors
- [ ] Sidebar visible
- [ ] Code editor visible
- [ ] Thought trace panel visible
- [ ] Knowledge topology visible
- [ ] Chat interface visible

### Test 2: Code Editor
- [ ] Monaco editor loads
- [ ] Syntax highlighting works
- [ ] Can type in editor
- [ ] Auto-sync indicator visible

### Test 3: Multimodal Input
- [ ] Drag-and-drop zone visible
- [ ] Can see supported file types
- [ ] Hover effects work

### Test 4: Database Connection
Open Prisma Studio (`npm run db:studio`):
- [ ] Can view User table
- [ ] Can view Project table
- [ ] Test data visible (if seeded)

### Test 5: Neo4j Connection
Visit http://localhost:7474:
- [ ] Neo4j Browser loads
- [ ] Can login (neo4j / nexuslab123)
- [ ] Database shows connected

## Common Issues & Solutions

### Issue: Port Already in Use
**Solution:**
```bash
docker-compose down
# Change ports in docker-compose.yml if needed
```

### Issue: Docker Not Running
**Solution:**
- Start Docker Desktop
- Wait for it to fully start
- Run `docker-compose up -d` again

### Issue: Module Not Found
**Solution:**
```bash
npm run clean
rm -rf node_modules package-lock.json
npm install
```

### Issue: Prisma Client Not Found
**Solution:**
```bash
npm run db:generate
```

### Issue: TypeScript Errors
**Solution:**
```bash
npm run type-check
npm run db:generate
```

### Issue: Database Connection Failed
**Solution:**
```bash
docker-compose restart postgres
# Wait 10 seconds
npm run db:push
```

## Success Criteria

You should see:
- ✅ No console errors in browser
- ✅ Dark theme UI matching screenshot
- ✅ All panels rendering correctly
- ✅ Green "Neural Engine Active" indicator
- ✅ Docker containers running
- ✅ Hot reload working

## Next Steps

Once everything is checked:
1. [ ] Read [GETTING-STARTED.md](./GETTING-STARTED.md)
2. [ ] Explore the UI
3. [ ] Try uploading a file
4. [ ] Check Neo4j Browser
5. [ ] Review [DEVELOPMENT.md](./DEVELOPMENT.md)

## Need Help?

If you encounter issues:
1. Check the logs: `docker-compose logs -f`
2. Check browser console for errors
3. Review error messages carefully
4. Consult [GETTING-STARTED.md](./GETTING-STARTED.md)
5. Check Docker container status: `docker-compose ps`

## Environment Check

Your `.env.local` should contain:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nexuslab_dev"
NEO4J_URI="bolt://localhost:7687"
NEO4J_USER="neo4j"
NEO4J_PASSWORD="nexuslab123"
NEXT_PUBLIC_WS_URL="http://localhost:3001"
```

- [ ] File exists at `apps/web/.env.local`
- [ ] All variables set correctly
- [ ] No syntax errors in file

## Final Check

Run all checks:
```bash
npm run type-check  # Should pass
npm run lint        # Should pass
npm test           # Should pass (when tests added)
```

---

**🎉 If all items are checked, you're ready to use NEXUS.LAB!**

Start developing with:
```bash
npm run dev
```

Visit: **http://localhost:3000**
