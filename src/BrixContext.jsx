import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { farm, products as staticProducts } from "./data";

const BrixContext = createContext(null);

function mergeProducts(readings) {
  if (!readings) return staticProducts;
  return staticProducts.map((product) => {
    const row = readings[product.id];
    if (!row) return product;
    return {
      ...product,
      brix: Number(row.brix ?? product.brix),
      brixLabel: row.brixLabel ?? product.brixLabel,
      taste: row.taste ?? product.taste,
    };
  });
}

export function BrixProvider({ children }) {
  const [updatedAt, setUpdatedAt] = useState(null);
  const [harvestDate, setHarvestDate] = useState(farm.harvestDate);
  const [readings, setReadings] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/brix");
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) return;
      setUpdatedAt(data.updatedAt || null);
      setHarvestDate(data.harvestDate || farm.harvestDate);
      setReadings(data.readings || null);
    } catch {
      /* use static defaults */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      products: mergeProducts(readings),
      updatedAt,
      harvestDate,
      loading,
      refresh,
    }),
    [readings, updatedAt, harvestDate, loading, refresh]
  );

  return <BrixContext.Provider value={value}>{children}</BrixContext.Provider>;
}

export function useBrix() {
  const ctx = useContext(BrixContext);
  if (!ctx) {
    return {
      products: staticProducts,
      updatedAt: null,
      harvestDate: farm.harvestDate,
      loading: false,
      refresh: async () => {},
    };
  }
  return ctx;
}
