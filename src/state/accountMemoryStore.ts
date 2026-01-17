import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AccountRole = "admin" | "employee_applicant" | "worker" | "client";

export type ChatMessage = {
  id: string;
  ts: number;
  role: "user" | "assistant" | "system";
  text: string;
  meta?: Record<string, any>;
};

export type AccountMemory = {
  // identity scope
  userId: string | null;
  role: AccountRole | null;

  // portal UI memory
  lastRoute: string | null;
  ui: {
    theme: "light" | "dark";
    compactMode: boolean;
    showTips: boolean;
  };

  // onboarding / signup progress memory
  signup: {
    step: 1 | 2 | 3;
    accountTypeSelected: "client" | "employee" | null;
    draft: Record<string, any>; // fields user already typed
  };

  // employee application memory (separate from client signup)
  employeeApplication: {
    status: "not_started" | "draft" | "submitted";
    draft: Record<string, any>;
    uploads: { name: string; url?: string; ts: number }[];
  };

  // AI help chat memory
  aiHelp: {
    threadId: string | null;
    lastIntent: string | null;
    messages: ChatMessage[];
  };

  // actions
  setIdentity: (userId: string, role: AccountRole) => void;
  setLastRoute: (path: string) => void;

  setUi: (patch: Partial<AccountMemory["ui"]>) => void;

  setSignup: (patch: Partial<AccountMemory["signup"]>) => void;
  setSignupDraftField: (key: string, value: any) => void;

  setEmployeeApplication: (patch: Partial<AccountMemory["employeeApplication"]>) => void;
  setEmployeeDraftField: (key: string, value: any) => void;

  pushAiMessage: (m: Omit<ChatMessage, "id" | "ts"> & Partial<Pick<ChatMessage, "id" | "ts">>) => void;
  clearAiThread: () => void;

  // persistence controls
  hydrateFromKey: (userId: string, role: AccountRole) => Promise<void>;
  resetForLogout: () => void;
};

function makeStorageKey(userId: string, role: AccountRole) {
  return `bhh:mem:${role}:${userId}`;
}

// Base store (will be re-persisted per user+role key via hydrateFromKey)
export const useAccountMemory = create<AccountMemory>()(
  persist(
    (set, get) => ({
      userId: null,
      role: null,

      lastRoute: null,

      ui: {
        theme: "light",
        compactMode: false,
        showTips: true,
      },

      signup: {
        step: 1,
        accountTypeSelected: null,
        draft: {},
      },

      employeeApplication: {
        status: "not_started",
        draft: {},
        uploads: [],
      },

      aiHelp: {
        threadId: null,
        lastIntent: null,
        messages: [],
      },

      setIdentity: (userId, role) => set({ userId, role }),
      setLastRoute: (path) => set({ lastRoute: path }),

      setUi: (patch) => set({ ui: { ...get().ui, ...patch } }),

      setSignup: (patch) => set({ signup: { ...get().signup, ...patch } }),
      setSignupDraftField: (key, value) =>
        set({ signup: { ...get().signup, draft: { ...get().signup.draft, [key]: value } } }),

      setEmployeeApplication: (patch) =>
        set({ employeeApplication: { ...get().employeeApplication, ...patch } }),
      setEmployeeDraftField: (key, value) =>
        set({
          employeeApplication: {
            ...get().employeeApplication,
            draft: { ...get().employeeApplication.draft, [key]: value },
          },
        }),

      pushAiMessage: (m) => {
        const msg: ChatMessage = {
          id: m.id ?? crypto.randomUUID(),
          ts: m.ts ?? Date.now(),
          role: m.role,
          text: m.text,
          meta: m.meta,
        };
        set({ aiHelp: { ...get().aiHelp, messages: [...get().aiHelp.messages, msg] } });
      },

      clearAiThread: () =>
        set({
          aiHelp: { threadId: null, lastIntent: null, messages: [] },
        }),

      // 🔑 The key part: load/store per user+role
      hydrateFromKey: async (userId, role) => {
        const key = makeStorageKey(userId, role);
        const raw = localStorage.getItem(key);
        if (!raw) {
          // fresh default state scoped to user+role
          set({
            userId,
            role,
            lastRoute: null,
          });
          return;
        }
        try {
          const parsed = JSON.parse(raw);
          // Zustand persist format: { state, version }
          const state = parsed?.state;
          if (state) set({ ...state, userId, role });
        } catch {
          // If corrupted, reset
          set({
            userId,
            role,
            lastRoute: null,
            aiHelp: { threadId: null, lastIntent: null, messages: [] },
          });
        }
      },

      resetForLogout: () => {
        set({
          userId: null,
          role: null,
          lastRoute: null,
          ui: { theme: "light", compactMode: false, showTips: true },
          signup: { step: 1, accountTypeSelected: null, draft: {} },
          employeeApplication: { status: "not_started", draft: {}, uploads: [] },
          aiHelp: { threadId: null, lastIntent: null, messages: [] },
        });
      },
    }),
    {
      name: "bhh:mem:active", // active cache (not the per-user final storage)
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // keep the whole thing in the "active" bucket
        ...state,
      }),
    }
  )
);

// Persist the *current* in-memory store into the user+role bucket
export function persistCurrentMemoryToUserBucket() {
  const s = useAccountMemory.getState();
  if (!s.userId || !s.role) return;

  const key = makeStorageKey(s.userId, s.role);
  const payload = {
    state: {
      ...s,
      // keep it clean
      // userId & role still stored; that’s fine for the bucket
    },
    version: 1,
  };
  localStorage.setItem(key, JSON.stringify(payload));
}
