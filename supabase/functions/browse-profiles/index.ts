import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory rate limiter (resets on function cold start)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30; // requests per window
const RATE_WINDOW_MS = 60 * 1000; // 1 minute window

function checkRateLimit(userId: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const userLimit = rateLimitStore.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(userId, { count: 1, resetTime: now + RATE_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT - 1, resetIn: RATE_WINDOW_MS };
  }

  if (userLimit.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0, resetIn: userLimit.resetTime - now };
  }

  userLimit.count++;
  return { allowed: true, remaining: RATE_LIMIT - userLimit.count, resetIn: userLimit.resetTime - now };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check rate limit
    const rateCheck = checkRateLimit(user.id);
    if (!rateCheck.allowed) {
      console.log(`Rate limit exceeded for user ${user.id}`);
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded. Please try again later.',
        resetIn: Math.ceil(rateCheck.resetIn / 1000)
      }), {
        status: 429,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(rateCheck.resetIn / 1000)),
        },
      });
    }

    const url = new URL(req.url);
    const type = url.searchParams.get('type') || 'browse';

    // Use secure RPC function that only returns non-sensitive profile data
    const { data: profiles, error } = await supabase.rpc('get_public_profiles');

    if (error) {
      console.error('Error fetching profiles:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch profiles' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Filter based on type
    let filteredProfiles = profiles || [];
    if (type === 'matching') {
      // For matching, we need profiles with skills offered
      filteredProfiles = filteredProfiles.filter((p: any) => 
        p.skills_offered && p.skills_offered.length > 0
      );
    } else {
      // For browse, get profiles with at least one skill
      filteredProfiles = filteredProfiles.filter((p: any) => 
        (p.skills_offered && p.skills_offered.length > 0) || 
        (p.skills_wanted && p.skills_wanted.length > 0)
      );
    }

    console.log(`User ${user.id} fetched ${filteredProfiles.length} profiles (type: ${type})`);

    return new Response(JSON.stringify({ 
      profiles: filteredProfiles,
      rateLimit: {
        remaining: rateCheck.remaining,
        resetIn: Math.ceil(rateCheck.resetIn / 1000)
      }
    }), {
      status: 200,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-RateLimit-Remaining': String(rateCheck.remaining),
        'X-RateLimit-Reset': String(Math.ceil(rateCheck.resetIn / 1000)),
      },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
