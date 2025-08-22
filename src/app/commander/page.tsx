'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Shield, AlertTriangle, Activity, Eye, Plane,
  CheckCircle, XCircle, AlertCircle,
  Satellite, Globe, Radar, Database, Network, Brain,
  Crown,
  Bell,
  Volume2, VolumeX, Maximize2, RefreshCw, Layers
} from 'lucide-react';


const generateRandomEvent = () => {
  const events = [
    'UAV-002 encountered unexpected weather pattern',
    'New enemy contact detected via SIGINT',
    'Mission OVERWATCH BRAVO requesting priority support',
    'Friendly forces movement reported in AO GUARDIAN',
    'Communications relay established with forward units',
    'UAV-007 completing final approach to target area',
    'Intelligence update: Enemy activity decreased in sector 4'
  ];
  return events[Math.floor(Math.random() * events.length)];
};

type Status = 'ACTIVE' | 'STANDBY' | 'MAINTENANCE' | 'OFFLINE';
type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
type EventType = 'SUCCESS' | 'ALERT' | 'WARNING' | 'INFO';
type ThreatLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

const CommanderView = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMission, setSelectedMission] = useState('GUARDIAN-SHIELD');
  const [alertsCount, setAlertsCount] = useState(3);
  const [commandMode, setCommandMode] = useState('NORMAL'); // NORMAL, ALERT, EMERGENCY
  const [audioEnabled, setAudioEnabled] = useState(true);

  // 실시간 작전 데이터
  const [operationalData, setOperationalData] = useState<{
    totalAssets: number;
    activeAssets: number;
    standbyAssets: number;
    maintenanceAssets: number;
    activeMissions: number;
    completedMissions: number;
    threatLevel: ThreatLevel;
    airspaceStatus: string;
    weatherCondition: string;
    overallReadiness: number;
  }>({
    totalAssets: 8,
    activeAssets: 6,
    standbyAssets: 1,
    maintenanceAssets: 1,
    activeMissions: 3,
    completedMissions: 12,
    threatLevel: 'MODERATE',
    airspaceStatus: 'CONTESTED',
    weatherCondition: 'FAVORABLE',
    overallReadiness: 85
  });

  const [missionStatus, setMissionStatus] = useState([
    {
      id: 'MSN-001',
      name: 'PATROL ALPHA',
      status: 'ACTIVE',
      progress: 65,
      assets: ['UAV-001', 'UAV-003'],
      priority: 'HIGH',
      eta: '14:30',
      commander: 'CPT Johnson'
    },
    {
      id: 'MSN-002', 
      name: 'OVERWATCH BRAVO',
      status: 'ACTIVE',
      progress: 40,
      assets: ['UAV-002'],
      priority: 'MEDIUM',
      eta: '16:45',
      commander: 'LT Smith'
    },
    {
      id: 'MSN-003',
      name: 'RECON CHARLIE',
      status: 'ACTIVE',
      progress: 80,
      assets: ['UAV-005'],
      priority: 'LOW',
      eta: '15:15',
      commander: 'SGT Davis'
    }
  ]);

  const [assetStatus, setAssetStatus] = useState([
    { id: 'UAV-001', name: 'Ghost Recon', status: 'ACTIVE', mission: 'PATROL ALPHA', battery: 87, altitude: 1245, location: 'GRID-4521' },
    { id: 'UAV-002', name: 'Thunder Strike', status: 'ACTIVE', mission: 'OVERWATCH BRAVO', battery: 92, altitude: 2100, location: 'GRID-3892' },
    { id: 'UAV-003', name: 'Eagle Eye', status: 'ACTIVE', mission: 'PATROL ALPHA', battery: 73, altitude: 2385, location: 'GRID-4633' },
    { id: 'UAV-004', name: 'Link Master', status: 'MAINTENANCE', mission: 'OFFLINE', battery: 15, altitude: 0, location: 'HOME-BASE' },
    { id: 'UAV-005', name: 'Shadow Walker', status: 'ACTIVE', mission: 'RECON CHARLIE', battery: 64, altitude: 1876, location: 'GRID-5127' },
    { id: 'UAV-006', name: 'Storm Rider', status: 'STANDBY', mission: 'READY', battery: 95, altitude: 0, location: 'HOME-BASE' },
    { id: 'UAV-007', name: 'Night Hawk', status: 'ACTIVE', mission: 'BORDER PATROL', battery: 78, altitude: 1650, location: 'GRID-6234' },
    { id: 'UAV-008', name: 'Sky Guardian', status: 'ACTIVE', mission: 'ISR DELTA', battery: 82, altitude: 2200, location: 'GRID-5889' }
  ]);

  const [recentEvents, setRecentEvents] = useState([
    { id: 1, time: '13:42:15', type: 'SUCCESS', message: 'UAV-005 reached waypoint CHARLIE-3', priority: 'LOW' },
    { id: 2, time: '13:41:03', type: 'ALERT', message: 'New threat detected in AO GUARDIAN', priority: 'HIGH' },
    { id: 3, time: '13:39:48', type: 'INFO', message: 'Mission PATROL ALPHA 65% complete', priority: 'MEDIUM' },
    { id: 4, time: '13:38:22', type: 'WARNING', message: 'UAV-003 battery approaching 75%', priority: 'MEDIUM' },
    { id: 5, time: '13:37:01', type: 'SUCCESS', message: 'Weather conditions favorable for operations', priority: 'LOW' }
  ]);

  const [intelSummary, setIntelSummary] = useState({
    totalReports: 24,
    newReports: 6,
    highPriority: 2,
    sources: {
      sigint: 85,
      humint: 72,
      geoint: 94,
      elint: 67,
      imint: 89,
      osint: 76
    }
  });

  const updateOperationalData = useCallback(() => {
    // 자산 배터리 및 위치 업데이트
    setAssetStatus(prev => 
      prev.map(asset => {
        if (asset.status === 'ACTIVE') {
          return {
            ...asset,
            battery: Math.max(20, asset.battery - Math.random() * 2),
            altitude: asset.altitude + (Math.random() - 0.5) * 50
          };
        }
        return asset;
      })
    );

    // 미션 진행률 업데이트
    setMissionStatus(prev =>
      prev.map(mission => {
        if (mission.status === 'ACTIVE') {
          return {
            ...mission,
            progress: Math.min(100, mission.progress + Math.random() * 5)
          };
        }
        return mission;
      })
    );

    // 새로운 이벤트 추가 (20% 확률)
    if (Math.random() < 0.2) {
      const newEvent = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        type: Math.random() > 0.7 ? 'ALERT' : Math.random() > 0.5 ? 'WARNING' : 'INFO',
        message: generateRandomEvent(),
        priority: Math.random() > 0.7 ? 'HIGH' : Math.random() > 0.4 ? 'MEDIUM' : 'LOW'
      };
      setRecentEvents(prev => [newEvent, ...prev.slice(0, 9)]);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // 실시간 데이터 업데이트 시뮬레이션
      updateOperationalData();
    }, 5000); // 5초마다 업데이트

    return () => clearInterval(timer);
  }, [updateOperationalData]);


const getStatusColor = (status: Status) => {
    switch(status) {
        case 'ACTIVE': return 'text-green-400 bg-green-400/20';
        case 'STANDBY': return 'text-yellow-400 bg-yellow-400/20';
        case 'MAINTENANCE': return 'text-red-400 bg-red-400/20';
        case 'OFFLINE': return 'text-gray-400 bg-gray-400/20';
        default: return 'text-gray-400 bg-gray-400/20';
    }
};

const getPriorityColor = (priority: Priority) => {
    switch(priority) {
        case 'HIGH': return 'text-red-400 border-red-500 bg-red-900/30';
        case 'MEDIUM': return 'text-yellow-400 border-yellow-500 bg-yellow-900/30';
        case 'LOW': return 'text-green-400 border-green-500 bg-green-900/30';
        default: return 'text-gray-400 border-gray-500 bg-gray-900/30';
    }
};

const getEventIcon = (type: EventType) => {
    switch(type) {
        case 'SUCCESS': return <CheckCircle className="w-4 h-4 text-green-400" />;
        case 'ALERT': return <AlertTriangle className="w-4 h-4 text-red-400" />;
        case 'WARNING': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
        case 'INFO': return <Eye className="w-4 h-4 text-blue-400" />;
        default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
};

const getThreatLevelColor = (level: ThreatLevel) => {
    switch(level) {
        case 'LOW': return 'text-green-400';
        case 'MODERATE': return 'text-yellow-400';
        case 'HIGH': return 'text-orange-400';
        case 'CRITICAL': return 'text-red-400';
        default: return 'text-gray-400';
    }
};

  const approveAllMissions = () => {
    console.log('All active missions approved by Commander');
    // 실제 구현에서는 백엔드 API 호출
  };

  const emergencyStop = () => {
    setCommandMode('EMERGENCY');
    console.log('EMERGENCY STOP activated by Commander');
    // 모든 드론 긴급 정지
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Top Command Bar */}
      <div className="h-20 bg-gray-800 border-b-2 border-blue-500 px-8 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <Crown className="w-8 h-8 text-yellow-400" />
            <div>
              <div className="text-2xl font-bold font-mono">COMMAND CENTER</div>
              <div className="text-sm text-gray-300 font-mono">OPERATION {selectedMission}</div>
            </div>
          </div>
          
          <div className="h-12 w-px bg-gray-600"></div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold font-mono text-green-400">{operationalData.totalAssets}</div>
              <div className="text-xs text-gray-400 font-mono">TOTAL ASSETS</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-mono text-blue-400">{operationalData.activeMissions}</div>
              <div className="text-xs text-gray-400 font-mono">ACTIVE MISSIONS</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold font-mono ${getThreatLevelColor(operationalData.threatLevel)}`}>
                {operationalData.threatLevel}
              </div>
              <div className="text-xs text-gray-400 font-mono">THREAT LEVEL</div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Alert Indicator */}
          {alertsCount > 0 && (
            <div className="relative">
              <Bell className="w-6 h-6 text-red-400 animate-pulse" />
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                {alertsCount}
              </div>
            </div>
          )}

          {/* Audio Toggle */}
          <button 
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2 rounded ${audioEnabled ? 'text-green-400' : 'text-gray-400'}`}
          >
            {audioEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </button>

          {/* Command Mode Indicator */}
          <div className={`px-3 py-1 rounded font-mono text-sm font-bold ${
            commandMode === 'EMERGENCY' ? 'bg-red-600 text-white animate-pulse' :
            commandMode === 'ALERT' ? 'bg-yellow-600 text-black' :
            'bg-green-600 text-white'
          }`}>
            {commandMode}
          </div>

          {/* Real-time Clock */}
          <div className="text-right">
            <div className="text-lg font-mono font-bold">{currentTime.toLocaleTimeString()}</div>
            <div className="text-xs text-gray-400 font-mono">{currentTime.toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="p-6 grid grid-cols-12 gap-6 h-full">
        
        {/* Large Tactical Map - Central Focus */}
        <div className="col-span-8 row-span-3 bg-gray-800 rounded-lg border border-gray-700 relative overflow-hidden">
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-gray-900/90 rounded px-3 py-2 font-mono text-sm">
              <div className="text-blue-400 font-bold">TACTICAL OVERVIEW</div>
              <div className="text-gray-300">AO GUARDIAN SHIELD</div>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 z-10 flex space-x-2">
            <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded" title="Layers">
              <Layers className="w-4 h-4" />
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded" title="Fullscreen">
              <Maximize2 className="w-4 h-4" />
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded" title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Simulated Tactical Map */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-30">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="commandGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00FF00" strokeWidth="1"/>
                    <text x="4" y="16" fill="#00FF00" fontSize="10" fontFamily="monospace">CMD</text>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#commandGrid)" />
              </svg>
            </div>

            {/* Operation Areas */}
            <div className="absolute top-16 left-16 w-72 h-56 border-3 border-green-500 bg-green-500/10 rounded-lg">
              <div className="absolute -top-8 left-4 text-sm font-bold text-green-400 font-mono">AO GUARDIAN</div>
            </div>
            <div className="absolute top-32 right-24 w-56 h-44 border-3 border-yellow-500 bg-yellow-500/10 rounded-lg">
              <div className="absolute -top-8 left-4 text-sm font-bold text-yellow-400 font-mono">TAO THUNDER</div>
            </div>

            {/* Asset Positions */}
            {assetStatus.filter(asset => asset.status === 'ACTIVE').map((asset, index) => (
              <div
                key={asset.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{
                  left: `${25 + index * 15}%`,
                  top: `${30 + (index % 2) * 20}%`
                }}
              >
                <div className="w-10 h-10 bg-blue-500/30 border-2 border-blue-400 rounded-full flex items-center justify-center">
                  <Plane className="w-5 h-5 text-blue-400" />
                </div>
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-gray-800/90 rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-xs font-mono text-blue-400 whitespace-nowrap">{asset.id}</div>
                  <div className="text-xs font-mono text-gray-300 whitespace-nowrap">{asset.location}</div>
                </div>
                {/* Status Indicator */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            ))}

            {/* Mission Zones */}
            <div className="absolute bottom-16 left-20 w-48 h-32 border-2 border-purple-500 bg-purple-500/20 rounded-lg">
              <div className="absolute -top-6 left-2 text-xs font-bold text-purple-400 font-mono">PATROL ALPHA</div>
            </div>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-gray-900/90 rounded px-3 py-2">
            <div className="text-xs font-mono text-gray-300 space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span>ACTIVE ASSETS</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border-2 border-green-500 rounded"></div>
                <span>AO BOUNDARIES</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border-2 border-purple-500 rounded"></div>
                <span>MISSION ZONES</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Status Panel */}
        <div className="col-span-4 bg-gray-800 rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-mono text-blue-400">MISSION STATUS</h3>
            <div className="text-sm font-mono text-gray-400">{missionStatus.length} ACTIVE</div>
          </div>
          
          <div className="space-y-3">
            {missionStatus.map(mission => (
              <div key={mission.id} className={`p-3 rounded border-l-4 ${getPriorityColor(mission.priority)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-mono font-bold text-white">{mission.name}</div>
                  <div className={`px-2 py-1 rounded text-xs font-mono ${getStatusColor(mission.status)}`}>
                    {mission.status}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-mono">
                    <span className="text-gray-300">Progress:</span>
                    <span className="text-blue-400">{mission.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${mission.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs font-mono text-gray-400">
                    <span>CDR: {mission.commander}</span>
                    <span>ETA: {mission.eta}</span>
                  </div>
                  <div className="text-xs font-mono text-cyan-400">
                    Assets: {mission.assets.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mission Control Buttons */}
          <div className="mt-4 space-y-2">
            <button 
              onClick={approveAllMissions}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded font-mono font-bold transition-colors"
            >
              <CheckCircle className="w-4 h-4 inline mr-2" />
              APPROVE ALL MISSIONS
            </button>
            <button 
              onClick={emergencyStop}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded font-mono font-bold transition-colors"
            >
              <XCircle className="w-4 h-4 inline mr-2" />
              EMERGENCY STOP ALL
            </button>
          </div>
        </div>

        {/* Asset Status Overview */}
        <div className="col-span-6 bg-gray-800 rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-mono text-green-400">ASSET STATUS</h3>
            <div className="text-sm font-mono text-gray-400">{assetStatus.length} TOTAL</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {assetStatus.map(asset => (
              <div key={asset.id} className="bg-gray-700 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-mono font-bold text-sm text-white">{asset.id}</div>
                  <div className={`px-2 py-1 rounded text-xs font-mono ${getStatusColor(asset.status)}`}>
                    {asset.status}
                  </div>
                </div>
                
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Mission:</span>
                    <span className="text-cyan-400">{asset.mission}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Battery:</span>
                    <span className={`${
                      asset.battery > 70 ? 'text-green-400' :
                      asset.battery > 30 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {asset.battery.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Location:</span>
                    <span className="text-blue-400">{asset.location}</span>
                  </div>
                  {asset.status === 'ACTIVE' && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Altitude:</span>
                      <span className="text-purple-400">{asset.altitude.toFixed(0)}m</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intelligence Summary */}
        <div className="col-span-3 bg-gray-800 rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-mono text-cyan-400">INTELLIGENCE</h3>
            <Database className="w-5 h-5 text-cyan-400" />
          </div>

          <div className="space-y-4">
            {/* Intel Stats */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-gray-700 rounded p-2">
                <div className="text-xl font-bold font-mono text-cyan-400">{intelSummary.totalReports}</div>
                <div className="text-xs font-mono text-gray-400">TOTAL REPORTS</div>
              </div>
              <div className="bg-gray-700 rounded p-2">
                <div className="text-xl font-bold font-mono text-red-400">{intelSummary.highPriority}</div>
                <div className="text-xs font-mono text-gray-400">HIGH PRIORITY</div>
              </div>
            </div>

            {/* Source Reliability */}
            <div className="space-y-2">
              <div className="text-sm font-mono text-gray-300 mb-2">SOURCE RELIABILITY</div>
              {Object.entries(intelSummary.sources).map(([source, reliability]) => (
                <div key={source} className="flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-400">{source.toUpperCase()}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          reliability >= 80 ? 'bg-green-400' :
                          reliability >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${reliability}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-mono text-white w-8">{reliability}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Events Log */}
        <div className="col-span-3 bg-gray-800 rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-mono text-yellow-400">RECENT EVENTS</h3>
            <Activity className="w-5 h-5 text-yellow-400" />
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recentEvents.map(event => (
              <div key={event.id} className={`p-2 rounded border-l-4 ${getPriorityColor(event.priority)}`}>
                <div className="flex items-start space-x-2">
                  {getEventIcon(event.type)}
                  <div className="flex-1">
                    <div className="text-xs font-mono text-gray-400">{event.time}</div>
                    <div className="text-sm font-mono text-white">{event.message}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="col-span-12 bg-gray-800 rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-mono text-purple-400">SYSTEM STATUS</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-mono text-green-400">ALL SYSTEMS OPERATIONAL</span>
              </div>
              <div className="text-sm font-mono text-gray-400">
                READINESS: {operationalData.overallReadiness}%
              </div>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-4">
            <div className="bg-gray-700 rounded p-3 text-center">
              <Network className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <div className="text-sm font-mono text-green-400">NETWORK</div>
              <div className="text-xs font-mono text-gray-400">SECURE</div>
            </div>
            <div className="bg-gray-700 rounded p-3 text-center">
              <Satellite className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <div className="text-sm font-mono text-green-400">SATCOM</div>
              <div className="text-xs font-mono text-gray-400">LINKED</div>
            </div>
            <div className="bg-gray-700 rounded p-3 text-center">
              <Radar className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <div className="text-sm font-mono text-green-400">RADAR</div>
              <div className="text-xs font-mono text-gray-400">ACTIVE</div>
            </div>
            <div className="bg-gray-700 rounded p-3 text-center">
              <Brain className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <div className="text-sm font-mono text-blue-400">AI CORE</div>
              <div className="text-xs font-mono text-gray-400">ONLINE</div>
            </div>
            <div className="bg-gray-700 rounded p-3 text-center">
              <Shield className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
              <div className="text-sm font-mono text-yellow-400">DEFENSE</div>
              <div className="text-xs font-mono text-gray-400">{operationalData.airspaceStatus}</div>
            </div>
            <div className="bg-gray-700 rounded p-3 text-center">
              <Globe className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <div className="text-sm font-mono text-green-400">WEATHER</div>
              <div className="text-xs font-mono text-gray-400">{operationalData.weatherCondition}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommanderView;
