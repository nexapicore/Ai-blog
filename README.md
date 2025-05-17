# AI Blog Platform

A community-driven blog platform with AI-powered article generation, fact-checking, and social features.

## Setup
1. **Backend**:
   - `cd backend`
   - `npm install`
   - Copy `.env.example` to `.env` and fill in variables
   - `npm run seed` (optional)
   - `npm start`
2. **Frontend**:
   - `cd frontend`
   - `npm install`
   - `npm start`
3. **Local Development**:
   - `docker-compose up`

## Deployment
- **Frontend**: Deploy to Vercel (`vercel`)
- **Backend**: Deploy to Render (use `render.yaml`)
- **Database**: Use MongoDB Atlas

## API
- Docs: `/api-docs`
- Example: `curl -H "Authorization: Bearer <JWT>" http://localhost:3000/api/v1/posts`
