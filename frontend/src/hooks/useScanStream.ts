import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const WS_URL = API_URL.replace(/^http/, 'ws') + '/api/v1/ws/scan';

export type ScanEvent = {
    timestamp: string;
    event_type: 'progress' | 'finding' | 'error' | 'complete';
    progress_pct?: number;
    message?: string;
    finding?: any; // strict typing can be added later
};

export function useScanStream() {
    const [isConnected, setIsConnected] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [findings, setFindings] = useState<any[]>([]);
    const [logs, setLogs] = useState<string[]>([]);

    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Connect on mount
        const ws = new WebSocket(WS_URL);

        ws.onopen = () => {
            console.log('Connected to Scan Stream');
            setIsConnected(true);
        };

        ws.onclose = () => {
            console.log('Disconnected from Scan Stream');
            setIsConnected(false);
        };

        ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
            toast.error('Real-time connection failed');
        };

        ws.onmessage = (event) => {
            try {
                const data: ScanEvent = JSON.parse(event.data);
                handleEvent(data);
            } catch (err) {
                console.error('Parse error', err);
            }
        };

        socketRef.current = ws;

        return () => {
            if (ws.readyState === 1) ws.close();
        };
    }, []);

    const handleEvent = useCallback((event: ScanEvent) => {
        if (event.event_type === 'progress') {
            setProgress(event.progress_pct || 0);
            if (event.message) setLogs(prev => [...prev.slice(-4), event.message!]);
        } else if (event.event_type === 'finding') {
            setFindings(prev => [...prev, event.finding]);
            toast('New Finding: ' + event.finding.title, { icon: '⚠️' });
        } else if (event.event_type === 'complete') {
            setIsScanning(false);
            setProgress(100);
            toast.success('Scan Complete');
        } else if (event.event_type === 'error') {
            setIsScanning(false);
            toast.error(event.message || 'Scan Error');
        }
    }, []);

    const startScan = useCallback((code: string) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            setFindings([]);
            setLogs([]);
            setProgress(0);
            setIsScanning(true);
            socketRef.current.send(JSON.stringify({ type: 'code', content: code }));
        } else {
            toast.error('Connection lost. Reconnecting...');
        }
    }, []);

    return {
        isConnected,
        isScanning,
        progress,
        findings,
        logs,
        startScan
    };
}
