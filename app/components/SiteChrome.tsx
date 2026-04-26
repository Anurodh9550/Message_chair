"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import FloatingContactActions from "./FloatingContactActions";
import {
  defaultFeatureSettings,
  STORAGE_KEYS,
  type FeatureSettings,
} from "../utils/adminData";

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const [settings, setSettings] = useState<FeatureSettings>(() => {
    if (typeof window === "undefined") {
      return defaultFeatureSettings;
    }
    const raw = localStorage.getItem(STORAGE_KEYS.featureSettings);
    if (!raw) {
      return defaultFeatureSettings;
    }
    try {
      const parsed = JSON.parse(raw) as FeatureSettings;
      return {
        showHeader: parsed.showHeader ?? true,
        showFooter: parsed.showFooter ?? true,
        showFloatingContact: parsed.showFloatingContact ?? true,
      };
    } catch {
      return defaultFeatureSettings;
    }
  });

  useEffect(() => {
    const onStorageChange = () => {
      const raw = localStorage.getItem(STORAGE_KEYS.featureSettings);
      if (!raw) {
        setSettings(defaultFeatureSettings);
        return;
      }
      try {
        const parsed = JSON.parse(raw) as FeatureSettings;
        setSettings({
          showHeader: parsed.showHeader ?? true,
          showFooter: parsed.showFooter ?? true,
          showFloatingContact: parsed.showFloatingContact ?? true,
        });
      } catch {
        setSettings(defaultFeatureSettings);
      }
    };

    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  if (isAdminRoute) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <>
      {settings.showHeader ? <Header /> : null}
      <main
        className={`flex-grow ${settings.showHeader ? "pt-[64px] sm:pt-[68px]" : ""}`}
      >
        {children}
      </main>
      {settings.showFooter ? <Footer /> : null}
      {settings.showFloatingContact ? <FloatingContactActions /> : null}
    </>
  );
}
