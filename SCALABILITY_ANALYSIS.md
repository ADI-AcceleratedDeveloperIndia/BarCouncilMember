# Scalability Analysis - High Traffic Handling

This document analyzes whether the website can handle 35,000 concurrent users clicking simultaneously.

## 🏗️ Current Architecture

### Technology Stack:
- **Frontend:** Next.js 14 (React)
- **Hosting:** Vercel (Serverless)
- **Data Storage:** Google Sheets API (No MongoDB)
- **Image Generation:** Client-side (html-to-image library)
- **CDN:** Vercel Edge Network (automatic)

---

## 📊 Traffic Scenario

**Assumption:**
- 35,000 users click the website link simultaneously
- All users visit within 1-2 minutes
- Each user may:
  - View the website (static pages)
  - Click support button
  - Submit preferential vote
  - Generate/download images

---

## ✅ What Works Well (No Issues)

### 1. **Static Page Serving** ✅
- **Next.js Static Generation:** Homepage, About, Vision, Mission pages are pre-rendered
- **Vercel CDN:** Serves static content from edge locations globally
- **Capacity:** Can handle millions of requests
- **Cost:** Free (included in Vercel)

**Verdict:** ✅ **No problem** - Can handle 35,000+ concurrent page views

### 2. **Client-Side Image Generation** ✅
- **html-to-image library:** Runs entirely in user's browser
- **No server load:** Zero cost, zero server resources
- **Scalability:** Unlimited (each user's browser does the work)

**Verdict:** ✅ **No problem** - Scales infinitely

### 3. **localStorage (Preferential Vote Tracking)** ✅
- **Client-side storage:** Each user's browser stores their vote status
- **No server calls:** No API requests for checking vote status
- **Scalability:** Unlimited

**Verdict:** ✅ **No problem** - No server impact

---

## ⚠️ Potential Bottlenecks

### 1. **Google Sheets API Rate Limits** ⚠️

**Current Limits:**
- **Free Tier:** 60 requests per minute per user
- **Quota:** 300 requests per minute per project (shared across all clients)

**Scenario Analysis:**
- 35,000 users click simultaneously
- Each user may make 1-3 API calls:
  - Preferential vote submission: 1 call
  - Support form submission: 1 call
  - Modal tracking: 1 call (optional)

**Worst Case:**
- 35,000 users × 3 calls = 105,000 API calls
- But these happen over 1-2 minutes
- **Problem:** Google Sheets API allows only 300 requests/minute

**Impact:**
- ❌ **Will hit rate limits**
- Users will see errors when submitting votes/support
- Some submissions will fail

**Solutions:**

**Option A: Request Quota Increase (Recommended)**
- Apply for Google Cloud quota increase
- Request: 10,000+ requests per minute
- **Cost:** Free (but requires approval)
- **Time:** 1-2 business days for approval

**Option B: Implement Queue/Retry System**
- Queue failed requests
- Retry automatically after delay
- **Implementation:** Add retry logic in API routes
- **Trade-off:** Some delays, but all requests eventually succeed

**Option C: Batch Requests**
- Group multiple submissions into single API call
- **Limitation:** Google Sheets API doesn't support true batching for append operations

**Option D: Upgrade to Google Workspace**
- Higher rate limits (but still may not be enough for 35K concurrent)

**Recommendation:** 
1. Request quota increase from Google
2. Implement retry logic as backup
3. Monitor and alert on rate limit errors

---

### 2. **Vercel Serverless Function Limits** ⚠️

**Vercel Free Tier:**
- **Bandwidth:** 100GB/month
- **Function Execution:** 100GB-hours/month
- **Edge Functions:** 500K invocations/month

**Vercel Pro ($20/month):**
- **Bandwidth:** 1TB/month
- **Function Execution:** 1,000GB-hours/month
- **Edge Functions:** 10M invocations/month

**Scenario Analysis:**
- 35,000 users × 3 API calls = 105,000 function invocations
- **Free Tier:** 500K/month limit ✅ (within limit)
- **Bandwidth:** ~50-100MB total ✅ (within 100GB limit)

**Verdict:** 
- ✅ **Free tier sufficient** for one-time 35K spike
- ⚠️ **Pro tier recommended** if multiple clients have simultaneous spikes

---

### 3. **Concurrent API Route Execution** ⚠️

**Vercel Serverless Functions:**
- Auto-scales to handle concurrent requests
- Each API route (`/api/preferential-vote`, `/api/support`) runs independently
- **Capacity:** Can handle thousands of concurrent executions

**Potential Issue:**
- Google Sheets API rate limiting will cause function timeouts/errors
- Functions will retry, but may queue up

**Verdict:** 
- ✅ **Vercel can handle it** (auto-scales)
- ⚠️ **Google Sheets API is the bottleneck**

---

## 🎯 Recommended Solutions

### Immediate Actions (Before Launch):

1. **Request Google Cloud Quota Increase**
   ```
   - Go to Google Cloud Console
   - Navigate to APIs & Services > Quotas
   - Find "Google Sheets API"
   - Request increase to 10,000 requests/minute
   - Submit justification: "Election campaign website expecting 35,000 concurrent users"
   ```

2. **Implement Retry Logic**
   - Add exponential backoff to API routes
   - Retry failed requests up to 3 times
   - Log errors for monitoring

3. **Upgrade to Vercel Pro** (if multiple clients)
   - $20/month per team
   - Can host multiple client websites
   - Better support and monitoring

4. **Add Error Handling & User Feedback**
   - Show user-friendly error messages
   - "Please try again in a moment" for rate limit errors
   - Auto-retry on client side

### Code Improvements Needed:

1. **Add Retry Logic to API Routes**
   ```typescript
   // In app/api/preferential-vote/route.ts
   async function appendWithRetry(sheets, values, retries = 3) {
     for (let i = 0; i < retries; i++) {
       try {
         await sheets.spreadsheets.values.append(...);
         return;
       } catch (error) {
         if (error.code === 429) { // Rate limit
           await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
         } else {
           throw error;
         }
       }
     }
   }
   ```

2. **Add Queue System (Optional)**
   - Use a message queue (Redis, BullMQ)
   - Process Google Sheets writes asynchronously
   - **Trade-off:** Adds complexity and cost

3. **Add Monitoring**
   - Track API errors
   - Alert on rate limit hits
   - Monitor Google Sheets API quota usage

---

## 📈 Scalability Verdict

### Can the website handle 35,000 concurrent users?

**Short Answer:** ⚠️ **Yes, but with modifications**

**Breakdown:**
- ✅ **Static pages:** No problem (CDN handles it)
- ✅ **Image generation:** No problem (client-side)
- ✅ **Vercel hosting:** No problem (auto-scales)
- ⚠️ **Google Sheets API:** **Bottleneck** - needs quota increase

### Action Items:

1. **Before Launch:**
   - [ ] Request Google Cloud quota increase (10,000+ requests/minute)
   - [ ] Implement retry logic in API routes
   - [ ] Test with load testing tool (simulate 1,000 concurrent users)

2. **During Launch:**
   - [ ] Monitor Google Sheets API errors
   - [ ] Monitor Vercel function execution
   - [ ] Have backup plan (manual data entry if needed)

3. **Post-Launch:**
   - [ ] Review error logs
   - [ ] Optimize based on real traffic patterns
   - [ ] Consider alternative data storage if needed

---

## 🔄 Alternative Solutions (If Google Sheets Fails)

### Option 1: **Hybrid Approach**
- Use Google Sheets for normal traffic
- Use database (PostgreSQL/MongoDB) for high-traffic periods
- Sync data between both

### Option 2: **Queue System**
- Use Redis/BullMQ to queue Google Sheets writes
- Process queue at controlled rate (within API limits)
- Users get immediate confirmation, writes happen asynchronously

### Option 3: **Multiple Google Service Accounts**
- Create multiple service accounts
- Rotate between them to distribute load
- **Limitation:** Still subject to project-level quotas

---

## 📊 Cost Analysis

### Per Client (35,000 users scenario):

**Free Tier:**
- Vercel: $0 (within limits)
- Google Sheets API: $0 (but may hit rate limits)
- **Total: $0/month**

**With Upgrades:**
- Vercel Pro: $20/month (shared across all clients)
- Google Cloud: $0 (quota increase is free)
- **Total: ~$20/month (for all clients combined)**

**Recommendation:** Start with free tier + quota increase request. Upgrade to Vercel Pro only if needed.

---

## ✅ Final Recommendation

**The website CAN handle 35,000 concurrent users IF:**

1. ✅ Request Google Cloud quota increase (free)
2. ✅ Implement retry logic (free, code change)
3. ✅ Upgrade to Vercel Pro if multiple clients ($20/month)
4. ✅ Monitor and optimize based on real traffic

**Timeline:**
- Quota increase request: 1-2 business days
- Retry logic implementation: 1-2 hours
- Testing: 1 day

**Risk Level:** 🟢 **Low** (with proper preparation)

The architecture is solid. The only bottleneck is Google Sheets API rate limits, which can be solved with a quota increase request.

