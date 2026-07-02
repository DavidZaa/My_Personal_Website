"use client";

import { GlowButton } from "@/components/ui/GlowButton";
import { createClient } from "@/lib/supabase/client";

export function LoginButton() {
  const signIn = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=/dashboard`,
      },
    });
  };

  return <GlowButton onClick={signIn}>Sign in with Google</GlowButton>;
}
