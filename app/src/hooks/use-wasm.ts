import { useState, useEffect } from "react";
import { useUIStore } from "@/stores/ui";

type WasmModule = typeof import("@/wasm/rosette_wasm");

// Module-level cache - tracks full initialization (import + init)
let wasmModuleCache: WasmModule | null = null;
let initializationPromise: Promise<WasmModule> | null = null;

/**
 * Load and initialize WASM module (singleton pattern).
 */
async function initializeWasm(): Promise<WasmModule> {
  // Already fully initialized
  if (wasmModuleCache) {
    return wasmModuleCache;
  }

  // Already initializing - wait for it
  if (initializationPromise) {
    return initializationPromise;
  }

  // Start initialization
  initializationPromise = (async () => {
    const module = await import("@/wasm/rosette_wasm");
    await module.default();
    wasmModuleCache = module;
    return module;
  })();

  try {
    return await initializationPromise;
  } catch (e) {
    // Reset on failure so retry is possible
    initializationPromise = null;
    throw e;
  }
}

/**
 * Hook to load and access the WASM module.
 *
 * The module is loaded once and cached at the module level,
 * so multiple components can use this hook without reloading.
 */
export function useWasm() {
  const [wasm, setWasm] = useState<WasmModule | null>(wasmModuleCache);
  const [isLoading, setIsLoading] = useState(!wasmModuleCache);
  const [error, setError] = useState<Error | null>(null);
  const setWasmReady = useUIStore((s) => s.setWasmReady);

  useEffect(() => {
    let mounted = true;

    initializeWasm()
      .then((module) => {
        if (mounted) {
          setWasm(module);
          setIsLoading(false);
          setWasmReady(true);
        }
      })
      .catch((e) => {
        console.error("Failed to load WASM module:", e);
        if (mounted) {
          setError(e as Error);
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [setWasmReady]);

  return {
    /** The WASM module, or null if not yet loaded. */
    wasm,
    /** Whether the module is currently loading. */
    isLoading,
    /** Any error that occurred during loading. */
    error,
    /** Whether the module is ready to use. */
    isReady: !!wasm && !isLoading && !error,
  };
}
