import { create } from 'zustand';

// ============ Types ============

interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  role: string;
}

interface Scan {
  id: string;
  scan_type: 'code' | 'prompt' | 'pii';
  status: 'pending' | 'running' | 'completed' | 'failed';
  risk_score: number;
  findings_count: number;
  created_at: string;
  completed_at?: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  repo_url?: string;
  created_at: string;
}

// ============ Auth Store ============

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set: (partial: Partial<AuthState>) => void) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setUser: (user: User | null) => set({ user, isAuthenticated: user !== null }),
  setToken: (token: string | null) => set({ token }),
  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_info');
    }
  },

}));

// ============ Scan Store ============

interface ScanState {
  currentScan: Scan | null;
  scans: Scan[];
  isLoading: boolean;
  setCurrentScan: (scan: Scan | null) => void;
  addScan: (scan: Scan) => void;
  setScanList: (scans: Scan[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useScanStore = create<ScanState>()((set: (partial: Partial<ScanState> | ((state: ScanState) => Partial<ScanState>)) => void) => ({
  currentScan: null,
  scans: [],
  isLoading: false,
  setCurrentScan: (scan: Scan | null) => set({ currentScan: scan }),
  addScan: (scan: Scan) => set((state: ScanState) => ({ scans: [scan, ...state.scans] })),
  setScanList: (scans: Scan[]) => set({ scans }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
}));

// ============ Project Store ============

interface ProjectState {
  currentProject: Project | null;
  projects: Project[];
  isLoading: boolean;
  setCurrentProject: (project: Project | null) => void;
  setProjectList: (projects: Project[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useProjectStore = create<ProjectState>()((set: (partial: Partial<ProjectState>) => void) => ({
  currentProject: null,
  projects: [],
  isLoading: false,
  setCurrentProject: (project: Project | null) => set({ currentProject: project }),
  setProjectList: (projects: Project[]) => set({ projects }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
}));

// ============ Export Types ============

export type { User, Scan, Project };
