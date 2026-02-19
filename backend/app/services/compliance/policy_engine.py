from typing import Optional, Dict, Any
import os
import json
import yaml


class PolicyEngine:
    """YAML-based custom rule engine for flexible compliance policies"""
    
    DEFAULT_POLICIES = {
        'default': {
            'rules': [
                {
                    'name': 'no_hardcoded_secrets',
                    'description': 'Detect hardcoded secrets and API keys',
                    'enabled': True,
                    'severity': 'critical',
                    'patterns': [
                        'api_key', 'secret_key', 'password', 'token'
                    ]
                },
                {
                    'name': 'no_pii_in_code',
                    'description': 'Prevent PII data in source code',
                    'enabled': True,
                    'severity': 'high',
                    'patterns': ['email', 'phone', 'credit_card', 'ssn']
                },
                {
                    'name': 'secure_logging',
                    'description': 'Ensure logging does not expose sensitive data',
                    'enabled': True,
                    'severity': 'high',
                    'rules': ['no_password_logs', 'no_token_logs']
                },
                {
                    'name': 'data_residency',
                    'description': 'Ensure data stays in approved regions',
                    'enabled': True,
                    'severity': 'high',
                    'allowed_regions': ['us-east-1', 'eu-west-1']
                },
            ],
            'compliance_frameworks': ['GDPR', 'AI_ACT'],
        }
    }
    
    @staticmethod
    def load_policy(policy_name: str = 'default') -> Dict[str, Any]:
        """Load policy from YAML file or use default"""
        
        policy_file = f"/policies/{policy_name}.yaml"
        
        if os.path.exists(policy_file):
            with open(policy_file, 'r') as f:
                return yaml.safe_load(f)
        
        return PolicyEngine.DEFAULT_POLICIES.get(policy_name, PolicyEngine.DEFAULT_POLICIES['default'])
    
    @staticmethod
    def evaluate_against_policy(findings: list, policy: Dict[str, Any]) -> Dict[str, Any]:
        """Evaluate scan findings against a policy"""
        
        violations = []
        passed_rules = []
        
        for rule in policy.get('rules', []):
            if not rule.get('enabled', True):
                continue
            
            rule_violations = []
            for finding in findings:
                if finding.finding_type in rule.get('patterns', []):
                    rule_violations.append(finding)
            
            if rule_violations:
                violations.append({
                    'rule': rule['name'],
                    'severity': rule.get('severity'),
                    'violations': len(rule_violations),
                    'details': [str(v) for v in rule_violations[:5]]
                })
            else:
                passed_rules.append(rule['name'])
        
        return {
            'policy_name': policy.get('name', 'custom'),
            'compliance_frameworks': policy.get('compliance_frameworks', []),
            'total_rules': len([r for r in policy.get('rules', []) if r.get('enabled')]),
            'passed_rules': len(passed_rules),
            'violations': violations,
            'overall_status': 'compliant' if not violations else 'non_compliant'
        }
    
    @staticmethod
    def create_custom_policy(policy_name: str, rules: list, frameworks: list) -> Dict[str, Any]:
        """Create and save custom policy"""
        
        policy = {
            'name': policy_name,
            'rules': rules,
            'compliance_frameworks': frameworks,
            'created_at': str(__import__('datetime').datetime.utcnow()),
        }
        
        os.makedirs('/policies', exist_ok=True)
        
        with open(f'/policies/{policy_name}.yaml', 'w') as f:
            yaml.dump(policy, f)
        
        return policy
