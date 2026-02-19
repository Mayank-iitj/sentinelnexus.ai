export interface Scan {
  id: string;
  project_id: string;
  scan_type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  ai_risk_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  findings_summary: Record<string, any>;
  created_at: string;
  completed_at?: string;
}

export interface ScanResult {
  id: string;
  finding_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  file_path?: string;
  line_number?: number;
  description: string;
  remediation: string;
  code_snippet?: string;
}

export interface Alert {
  id: string;
  project_id: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description?: string;
  is_read: boolean;
  is_resolved: boolean;
  triggered_at: string;
}

export interface Project {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  repo_url?: string;
  repo_type?: string;
  created_at: string;
}
