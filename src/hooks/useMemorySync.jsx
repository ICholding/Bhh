import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAccountMemory, persistCurrentMemoryToUserBucket } from "@/state/accountMemoryStore";

export function MemoryRouteSync() {
  const location = useLocation();
  const setLastRoute = useAccountMemory((s) => s.setLastRoute);

  useEffect(() => {
    setLastRoute(location.pathname);
    persistCurrentMemoryToUserBucket();
  }, [location.pathname, setLastRoute]);

  return null;
}
