"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { defaultLocale } from "@/lib/i18n/config";

// Static-export-friendly root redirect to the default locale. (A server
// redirect() can't be statically exported for GitHub Pages, so we redirect on
// the client; next/navigation prepends basePath automatically.)
export default function RootIndex() {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/${defaultLocale}`);
  }, [router]);
  return null;
}
