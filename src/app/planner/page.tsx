'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Target, Save, Upload,
  Play, X,
  Eye, Camera, Home,
  Users,
  Radar,
  MessageCircle,
  Edit3, Copy,
  Download, FolderOpen, Share2, Archive, Book,
} from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';

type Status = 'DRAFT' | 'PLANNING' | 'APPROVED' | 'ACTIVE' | 'COMPLETED';
type Priority = 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL';
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
type WaypointType = 'normal' | 'target' | 'recon' | 'surveillance' | 'home';

interface MissionTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  waypoints: number;
  duration: number;
  assets: number;
  difficulty: Difficulty;
  usage: number;
}

type WaypointAction = 'flyby' | 'loiter' | 'survey' | 'takeoff' | 'land';

interface Waypoint {
  id: number;
  x: number;
  y: number;
  type: WaypointType;
  altitude: number;
  speed: number;
  action: WaypointAction;
  loiterTime?: number;
  payload?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  notes?: string;
}

interface MissionParams {
  name: string;
  type: string;
  priority: Priority;
  startTime: string;
  duration: number;
  assets: string[];
  weather: string;
  commander: string;
  backup: boolean;
}

interface Collaborator {
  id: number;
  name: string;
  role: string;
  status: 'online' | 'busy' | 'offline';
}

interface MissionLibrary {
  id: string;
  name: string;
  type: string;
  status: Status;
  priority: Priority;
  startTime: string;
  planner: string;
  progress: number;
  lastModified: Date;
  waypoints?: Waypoint[];
  parameters?: MissionParams;
}

const PlannerView = () => {
  const [selectedTool, setSelectedTool] = useState('waypoint');
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  const [missionLibrary, setMissionLibrary] = useState<MissionLibrary[]>([]);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [missionTemplates, setMissionTemplates] = useState<MissionTemplate[]>([]);
  const [planningMode] = useState('create'); // create, edit, review, simulate
  const [mapLayers, setMapLayers] = useState({
    terrain: true,
    weather: true,
    threats: true,
    airspace: true,
    routes: true,
    assets: true
  });
  const [missionParams, setMissionParams] = useState<MissionParams>({
    name: '',
    type: 'reconnaissance',
    priority: 'MEDIUM',
    startTime: '',
    duration: 60,
    assets: [],
    weather: 'FAIR',
    commander: '',
    backup: false
  });
  const [analysisResults, setAnalysisResults] = useState({
    feasibility: 85,
    riskLevel: 'MODERATE',
    fuelConsumption: 65,
    timeEstimate: 42,
    successProbability: 78,
    alternativeRoutes: 3
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    { id: 1, name: 'CPT Johnson', role: 'COMMANDER', status: 'online' },
    { id: 2, name: 'SGT Miller', role: 'OPERATOR', status: 'busy' },
    { id: 3, name: 'LT Davis', role: 'ANALYST', status: 'online' }
  ]);

  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 초기 데이터 로드
    loadMissionTemplates();
    loadMissionLibrary();
  }, []);

  const loadMissionTemplates = () => {
    setMissionTemplates([
      {
        id: 'TPL-001',
        name: 'Border Patrol Route',
        type: 'patrol',
        description: '국경선 순찰 표준 경로',
        waypoints: 8,
        duration: 90,
        assets: 2,
        difficulty: 'EASY',
        usage: 156
      },
      {
        id: 'TPL-002',
        name: 'Area Reconnaissance',
        type: 'reconnaissance',
        description: '지역 정찰 임무 템플릿',
        waypoints: 12,
        duration: 75,
        assets: 3,
        difficulty: 'MEDIUM',
        usage: 89
      },
      {
        id: 'TPL-003',
        name: 'Target Surveillance',
        type: 'surveillance',
        description: '목표물 감시 지속 임무',
        waypoints: 6,
        duration: 180,
        assets: 1,
        difficulty: 'HARD',
        usage: 34
      },
      {
        id: 'TPL-004',
        name: 'Convoy Escort',
        type: 'escort',
        description: '호송 차량 경호 임무',
        waypoints: 15,
        duration: 120,
        assets: 4,
        difficulty: 'HARD',
        usage: 67
      },
      {
        id: 'TPL-005',
        name: 'Emergency Response',
        type: 'emergency',
        description: '긴급 상황 대응 임무',
        waypoints: 4,
        duration: 30,
        assets: 2,
        difficulty: 'MEDIUM',
        usage: 23
      }
    ]);
  };

  const loadMissionLibrary = () => {
    setMissionLibrary([
      {
        id: 'MSN-2025-001',
        name: 'Operation Thunder',
        type: 'reconnaissance',
        status: 'PLANNING',
        priority: 'HIGH',
        startTime: '2025-01-28T06:00:00',
        planner: 'MAJ Wilson',
        progress: 65,
        lastModified: new Date(Date.now() - 86400000)
      },
      {
        id: 'MSN-2025-002', 
        name: 'Sector 7 Patrol',
        type: 'patrol',
        status: 'APPROVED',
        priority: 'MEDIUM',
        startTime: '2025-01-28T14:00:00',
        planner: 'CPT Chen',
        progress: 100,
        lastModified: new Date(Date.now() - 3600000)
      },
      {
        id: 'MSN-2025-003',
        name: 'Alpine Watch',
        type: 'surveillance',
        status: 'DRAFT',
        priority: 'LOW',
        startTime: '2025-01-29T08:00:00',
        planner: 'LT Park',
        progress: 25,
        lastModified: new Date(Date.now() - 7200000)
      }
    ]);
  };

  const addWaypoint = (x: number, y: number) => {
    const newWaypoint: Waypoint = {
      id: waypoints.length + 1,
      x: x,
      y: y,
      type: (selectedTool === 'waypoint' ? 'normal' : selectedTool) as WaypointType,
      altitude: 1500,
      speed: 50,
      action: 'flyby',
      loiterTime: 0,
      payload: 'camera',
      coordinates: {
        lat: 37.2431 + (y - 50) * 0.001,
        lng: 127.0766 + (x - 50) * 0.001
      },
      notes: ''
    };
    setWaypoints([...waypoints, newWaypoint]);
  };

  const removeWaypoint = (id: number) => {
    setWaypoints(waypoints.filter(wp => wp.id !== id));
  };

  const updateWaypoint = (id: number, updates: Partial<Waypoint>) => {
    setWaypoints(waypoints.map(wp => 
      wp.id === id ? { ...wp, ...updates } : wp
    ));
  };

  const createNewMission = () => {
    const newMission: MissionLibrary = {
      id: `MSN-${new Date().getFullYear()}-${String(missionLibrary.length + 1).padStart(3, '0')}`,
      name: missionParams.name || 'Untitled Mission',
      type: missionParams.type,
      status: 'DRAFT',
      priority: missionParams.priority,
      startTime: missionParams.startTime,
      planner: 'Current User',
      progress: 0,
      lastModified: new Date(),
      waypoints: [...waypoints],
      parameters: { ...missionParams }
    };
    
    setMissionLibrary([newMission, ...missionLibrary]);
    setSelectedMission(newMission.id);
  };

  const duplicateMission = (missionId: string) => {
    const original = missionLibrary.find(m => m.id === missionId);
    if (original) {
      const duplicate: MissionLibrary = {
        ...original,
        id: `MSN-${new Date().getFullYear()}-${String(missionLibrary.length + 1).padStart(3, '0')}`,
        name: `${original.name} (Copy)`,
        status: 'DRAFT',
        progress: 0,
        lastModified: new Date()
      };
      setMissionLibrary([duplicate, ...missionLibrary]);
    }
  };

  const loadTemplate = (templateId: string) => {
    const template = missionTemplates.find(t => t.id === templateId);
    if (template) {
      // 템플릿에 따른 웨이포인트 생성
      generateTemplateWaypoints(template.type, template.waypoints);
      setMissionParams(prev => ({
        ...prev,
        type: template.type,
        name: template.name + ' - ' + new Date().toISOString().slice(0,10)
      }));
    }
  };

  const generateTemplateWaypoints = (type: string, count: number) => {
    const templateWaypoints: Waypoint[] = [];
    
    switch(type) {
      case 'patrol':
        // 직사각형 패턴
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * 2 * Math.PI;
          templateWaypoints.push({
            id: i + 1,
            x: 50 + Math.cos(angle) * 30,
            y: 50 + Math.sin(angle) * 20,
            type: 'normal',
            altitude: 1500,
            speed: 50,
            action: i === 0 ? 'takeoff' : i === count - 1 ? 'land' : 'flyby',
            coordinates: {
              lat: 37.2431 + ((50 + Math.sin(angle) * 20) - 50) * 0.001,
              lng: 127.0766 + ((50 + Math.cos(angle) * 30) - 50) * 0.001
            },
            notes: ''
          });
        }
        break;
      case 'reconnaissance':
        // 지그재그 패턴
        for (let i = 0; i < count; i++) {
          const row = Math.floor(i / 4);
          const col = i % 4;
          templateWaypoints.push({
            id: i + 1,
            x: 20 + col * 20,
            y: 30 + row * 15 + (col % 2) * 10,
            type: 'recon',
            altitude: 2000,
            speed: 40,
            action: 'survey',
            coordinates: {
              lat: 37.2431 + ((30 + row * 15 + (col % 2) * 10) - 50) * 0.001,
              lng: 127.0766 + ((20 + col * 20) - 50) * 0.001
            },
            notes: ''
          });
        }
        break;
      case 'surveillance':
        // 원형 감시 패턴
        const centerX = 50, centerY = 50, radius = 25;
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * 2 * Math.PI;
          templateWaypoints.push({
            id: i + 1,
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
            type: 'surveillance',
            altitude: 2500,
            speed: 30,
            action: 'loiter',
            loiterTime: 300,
            coordinates: {
              lat: 37.2431 + ((centerY + Math.sin(angle) * radius) - 50) * 0.001,
              lng: 127.0766 + ((centerX + Math.cos(angle) * radius) - 50) * 0.001
            },
            notes: ''
          });
        }
        break;
    }
    
    setWaypoints(templateWaypoints);
  };

  const analyzeMission = () => {
    // 임무 분석 시뮬레이션
    const totalDistance = calculateTotalDistance();
    const estimatedTime = (totalDistance / 50) * 60; // 50km/h 평균 속도
    const fuelConsumption = Math.min(100, estimatedTime * 0.8);
    const riskFactors = waypoints.filter(wp => wp.type === 'target').length;
    
    setAnalysisResults({
      feasibility: Math.max(60, 100 - riskFactors * 10),
      riskLevel: riskFactors > 2 ? 'HIGH' : riskFactors > 0 ? 'MODERATE' : 'LOW',
      fuelConsumption: fuelConsumption,
      timeEstimate: estimatedTime,
      successProbability: Math.max(50, 90 - riskFactors * 5),
      alternativeRoutes: Math.floor(Math.random() * 5) + 1
    });
  };

  const calculateTotalDistance = () => {
    if (waypoints.length < 2) return 0;
    
    let total = 0;
    for (let i = 1; i < waypoints.length; i++) {
      const dx = waypoints[i].x - waypoints[i-1].x;
      const dy = waypoints[i].y - waypoints[i-1].y;
      total += Math.sqrt(dx*dx + dy*dy) * 10; // 임의 스케일
    }
    return total;
  };

  const getStatusColor = (status: Status) => {
    switch(status) {
      case 'DRAFT': return 'text-gray-400 bg-gray-400/20';
      case 'PLANNING': return 'text-yellow-400 bg-yellow-400/20';
      case 'APPROVED': return 'text-green-400 bg-green-400/20';
      case 'ACTIVE': return 'text-blue-400 bg-blue-400/20';
      case 'COMPLETED': return 'text-purple-400 bg-purple-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch(priority) {
      case 'HIGH': return 'text-red-400 border-red-500';
      case 'MEDIUM': return 'text-yellow-400 border-yellow-500';
      case 'LOW': return 'text-green-400 border-green-500';
      default: return 'text-gray-400 border-gray-500';
    }
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch(difficulty) {
      case 'EASY': return 'text-green-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'HARD': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getWaypointIcon = (type: WaypointType) => {
    switch(type) {
      case 'normal': return <MapPin className="w-4 h-4 text-blue-400" />;
      case 'target': return <Target className="w-4 h-4 text-red-400" />;
      case 'recon': return <Eye className="w-4 h-4 text-green-400" />;
      case 'surveillance': return <Camera className="w-4 h-4 text-purple-400" />;
      case 'home': return <Home className="w-4 h-4 text-cyan-400" />;
      default: return <MapPin className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <PageLayout title="Mission Planner" icon={<Edit3 className="w-6 h-6 text-blue-400" />}>
      <div className="planner-view">
        {/* Left Panel - Mission Library & Templates */}
        <div className="planner-view__left-panel">
          
          {/* Mission Templates */}
          <div className="planner-view__panel-section">
            <div className="planner-view__panel-title" style={{ color: '$color-green-400' }}>
              <span>MISSION TEMPLATES</span>
              <Book className="w-4 h-4" />
            </div>
            
            <div className="space-y-2">
              {missionTemplates.map(template => (
                <div
                  key={template.id}
                  className="p-3 bg-gray-600 rounded hover:bg-gray-550 transition-colors cursor-pointer"
                  onClick={() => loadTemplate(template.id)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-mono font-bold text-sm text-white">{template.name}</div>
                    <div className={`text-xs font-mono ${getDifficultyColor(template.difficulty)}`}>
                      {template.difficulty}
                    </div>
                  </div>
                  <div className="text-xs text-gray-300 font-mono mb-2">
                    {template.description}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono text-gray-400">
                    <div>WP: {template.waypoints}</div>
                    <div>T: {template.duration}m</div>
                    <div>Used: {template.usage}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mission Library */}
          <div className="planner-view__panel-section">
            <div className="planner-view__panel-title" style={{ color: '$color-purple-400' }}>
              <span>MISSION LIBRARY</span>
              <div className="flex items-center space-x-2">
                <FolderOpen className="w-4 h-4" />
                <button 
                  onClick={createNewMission}
                  className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
                >
                  NEW
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              {missionLibrary.map(mission => (
                <div
                  key={mission.id}
                  className={`p-3 rounded border transition-all cursor-pointer ${
                    selectedMission === mission.id 
                      ? 'bg-gray-600 border-blue-500' 
                      : 'bg-gray-600 border-transparent hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedMission(mission.id)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-mono font-bold text-sm text-white">{mission.name}</div>
                    <div className={`px-2 py-1 rounded text-xs font-mono ${getStatusColor(mission.status)}`}>
                      {mission.status}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-300 font-mono space-y-1">
                    <div className="flex justify-between">
                      <span>ID: {mission.id}</span>
                      <span className={getPriorityColor(mission.priority)}>
                        {mission.priority}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Planner: {mission.planner}</span>
                      <span>{mission.progress}%</span>
                    </div>
                    <div className="text-gray-400">
                      Modified: {mission.lastModified.toLocaleDateString()}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex space-x-1 mt-2">
                    <button 
                      onClick={(e: React.MouseEvent) => { e.stopPropagation(); duplicateMission(mission.id); }}
                      className="flex-1 bg-gray-500 hover:bg-gray-400 text-white py-1 px-2 rounded text-xs font-mono"
                    >
                      <Copy className="w-3 h-3 inline mr-1" />
                      COPY
                    </button>
                    <button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-1 px-2 rounded text-xs font-mono">
                      <Edit3 className="w-3 h-3 inline mr-1" />
                      EDIT
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mission Parameters */}
          <div className="planner-view__panel-section">
            <div className="planner-view__panel-title" style={{ color: '$color-yellow-400' }}>MISSION PARAMETERS</div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1">MISSION NAME</label>
                <input
                  type="text"
                  value={missionParams.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMissionParams(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 text-sm font-mono"
                  placeholder="Enter mission name"
                />
              </div>
              
              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1">MISSION TYPE</label>
                <select
                  value={missionParams.type}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMissionParams(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 text-sm font-mono"
                >
                  <option value="reconnaissance">RECONNAISSANCE</option>
                  <option value="patrol">PATROL</option>
                  <option value="surveillance">SURVEILLANCE</option>
                  <option value="escort">ESCORT</option>
                  <option value="emergency">EMERGENCY</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1">PRIORITY</label>
                <select
                  value={missionParams.priority}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMissionParams(prev => ({ ...prev, priority: e.target.value as Priority }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 text-sm font-mono"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1">START TIME</label>
                <input
                  type="datetime-local"
                  value={missionParams.startTime}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMissionParams(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 text-sm font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1">COMMANDER</label>
                <select
                  value={missionParams.commander}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMissionParams(prev => ({ ...prev, commander: e.target.value }))}
                  className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 text-sm font-mono"
                >
                  <option value="">Select Commander</option>
                  <option value="CPT Johnson">CPT Johnson</option>
                  <option value="MAJ Wilson">MAJ Wilson</option>
                  <option value="LT Davis">LT Davis</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Planning Map */}
        <div className="planner-view__center-panel">
          <div 
            ref={mapRef}
            className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 cursor-crosshair"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              if ((planningMode === 'create' || planningMode === 'edit') && mapRef.current) {
                const rect = mapRef.current.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                addWaypoint(x, y);
              }
            }}
          >
            {/* Planning Grid */}
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="planningGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#00BFFF" strokeWidth="1"/>
                    <text x="2" y="12" fill="#00BFFF" fontSize="8" fontFamily="monospace">PLN</text>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#planningGrid)" />
              </svg>
            </div>

            {/* Map Layers */}
            {mapLayers.terrain && (
              <div className="absolute inset-0 opacity-30">
                {/* Terrain features */}
                <div className="absolute top-16 left-16 w-64 h-48 bg-gradient-to-br from-green-800 to-green-900 rounded-lg"></div>
                <div className="absolute bottom-32 right-24 w-48 h-36 bg-gradient-to-br from-yellow-800 to-yellow-900 rounded-lg"></div>
              </div>
            )}

            {mapLayers.airspace && (
              <>
                {/* Operation Areas */}
                <div className="absolute top-20 left-20 w-64 h-48 border-2 border-green-500 bg-green-500/10 rounded-lg">
                  <div className="absolute -top-6 left-2 text-sm font-bold text-green-400 font-mono">AO GUARDIAN</div>
                </div>
                <div className="absolute top-40 right-32 w-48 h-36 border-2 border-yellow-500 bg-yellow-500/10 rounded-lg">
                  <div className="absolute -top-6 left-2 text-sm font-bold text-yellow-400 font-mono">TAO THUNDER</div>
                </div>
                <div className="absolute bottom-32 left-40 w-32 h-32 border-2 border-red-500 bg-red-500/10 rounded-lg">
                  <div className="absolute -top-6 left-2 text-sm font-bold text-red-400 font-mono">EZ LIGHTNING</div>
                </div>
              </>
            )}

            {mapLayers.threats && (
              <>
                {/* Threat Areas */}
                <div className="absolute top-32 left-60 w-16 h-16 bg-red-500/30 border-2 border-red-400 rounded-full">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Radar className="w-6 h-6 text-red-400" />
                  </div>
                </div>
                <div className="absolute bottom-48 right-48 w-20 h-20 bg-orange-500/30 border-2 border-orange-400 rounded-full">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Radar className="w-6 h-6 text-orange-400" />
                  </div>
                </div>
              </>
            )}

            {/* Flight Path */}
            {waypoints.length > 1 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <polyline
                  points={waypoints.map(wp => `${wp.x}% ${wp.y}%`).join(' ')}
                  fill="none"
                  stroke="#00BFFF"
                  strokeWidth="3"
                  strokeDasharray="10,5"
                />
                <defs>
                  <marker id="plannerArrow" markerWidth="10" markerHeight="7" 
                          refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#00BFFF" />
                  </marker>
                </defs>
              </svg>
            )}

            {/* Waypoints */}
            {waypoints.map((waypoint) => (
              <div
                key={waypoint.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{
                  left: `${waypoint.x}%`,
                  top: `${waypoint.y}%`
                }}
              >
                <div className="relative">
                  {getWaypointIcon(waypoint.type)}
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-mono font-bold">
                    WP{waypoint.id}
                  </div>
                </div>
                
                {/* Waypoint Edit Popup */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800/95 rounded p-3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 w-64">
                  <div className="text-sm font-mono text-blue-400 mb-2">WAYPOINT {waypoint.id}</div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-gray-400 font-mono">TYPE</label>
                        <select 
                          value={waypoint.type}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateWaypoint(waypoint.id, { type: e.target.value as WaypointType })}
                          className="w-full bg-gray-700 border border-gray-600 rounded px-1 py-0.5 text-xs font-mono"
                        >
                          <option value="normal">NORMAL</option>
                          <option value="target">TARGET</option>
                          <option value="recon">RECON</option>
                          <option value="surveillance">SURVEILLANCE</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-gray-400 font-mono">ACTION</label>
                        <select 
                          value={waypoint.action}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateWaypoint(waypoint.id, { action: e.target.value as WaypointAction })}
                          className="w-full bg-gray-700 border border-gray-600 rounded px-1 py-0.5 text-xs font-mono"
                        >
                          <option value="flyby">FLYBY</option>
                          <option value="loiter">LOITER</option>
                          <option value="survey">SURVEY</option>
                          <option value="takeoff">TAKEOFF</option>
                          <option value="land">LAND</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-gray-400 font-mono">ALT (m)</label>
                        <input
                          type="number"
                          value={waypoint.altitude}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateWaypoint(waypoint.id, { altitude: parseInt(e.target.value) })}
                          className="w-full bg-gray-700 border border-gray-600 rounded px-1 py-0.5 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 font-mono">SPEED</label>
                        <input
                          type="number"
                          value={waypoint.speed}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateWaypoint(waypoint.id, { speed: parseInt(e.target.value) })}
                          className="w-full bg-gray-700 border border-gray-600 rounded px-1 py-0.5 text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => removeWaypoint(waypoint.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded text-xs font-mono"
                      >
                        DELETE
                      </button>
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded text-xs font-mono">
                        SAVE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Planning Tools */}
            <div className="absolute top-4 left-4 bg-gray-800/90 rounded-lg p-3">
              <div className="text-sm font-mono text-blue-400 mb-2">PLANNING TOOLS</div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'waypoint', icon: MapPin, label: 'WAYPOINT' },
                  { id: 'target', icon: Target, label: 'TARGET' },
                  { id: 'recon', icon: Eye, label: 'RECON' },
                  { id: 'surveillance', icon: Camera, label: 'SURVEILLANCE' }
                ].map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    className={`p-2 rounded text-xs font-mono transition-colors flex flex-col items-center space-y-1 ${
                      selectedTool === tool.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <tool.icon className="w-4 h-4" />
                    <span>{tool.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Map Layer Controls */}
            <div className="absolute top-4 right-4 bg-gray-800/90 rounded-lg p-3">
              <div className="text-sm font-mono text-blue-400 mb-2">MAP LAYERS</div>
              <div className="space-y-1">
                {Object.entries(mapLayers).map(([layer, enabled]) => (
                  <label key={layer} className="flex items-center space-x-2 text-xs font-mono">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMapLayers(prev => ({ ...prev, [layer]: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="capitalize">{layer}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Mission Statistics */}
            <div className="absolute bottom-4 left-4 bg-gray-800/90 rounded-lg p-3">
              <div className="text-sm font-mono text-blue-400 mb-2">MISSION STATS</div>
              <div className="space-y-1 text-xs font-mono">
                <div>WAYPOINTS: {waypoints.length}</div>
                <div>DISTANCE: {calculateTotalDistance().toFixed(1)} km</div>
                <div>EST. TIME: {((calculateTotalDistance() / 50) * 60).toFixed(0)} min</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Analysis & Collaboration */}
        <div className="planner-view__right-panel">
          
          {/* Mission Analysis */}
          <div className="planner-view__panel-section">
            <div className="planner-view__panel-title" style={{ color: '$color-cyan-400' }}>
              <span>MISSION ANALYSIS</span>
              <button 
                onClick={analyzeMission}
                className="text-xs bg-cyan-600 hover:bg-cyan-700 px-2 py-1 rounded"
              >
                ANALYZE
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-600 rounded p-2 text-center">
                  <div className="text-lg font-bold font-mono text-green-400">
                    {analysisResults.feasibility}%
                  </div>
                  <div className="text-xs font-mono text-gray-400">FEASIBILITY</div>
                </div>
                <div className="bg-gray-600 rounded p-2 text-center">
                  <div className="text-lg font-bold font-mono text-yellow-400">
                    {analysisResults.riskLevel}
                  </div>
                  <div className="text-xs font-mono text-gray-400">RISK LEVEL</div>
                </div>
                <div className="bg-gray-600 rounded p-2 text-center">
                  <div className="text-lg font-bold font-mono text-blue-400">
                    {analysisResults.fuelConsumption.toFixed(0)}%
                  </div>
                  <div className="text-xs font-mono text-gray-400">FUEL REQ</div>
                </div>
                <div className="bg-gray-600 rounded p-2 text-center">
                  <div className="text-lg font-bold font-mono text-purple-400">
                    {analysisResults.timeEstimate.toFixed(0)}m
                  </div>
                  <div className="text-xs font-mono text-gray-400">EST. TIME</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span>SUCCESS PROBABILITY:</span>
                  <span className="text-green-400">{analysisResults.successProbability}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-green-400 h-2 rounded-full"
                    style={{ width: `${analysisResults.successProbability}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span>ALTERNATIVE ROUTES:</span>
                  <span className="text-cyan-400">{analysisResults.alternativeRoutes}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Waypoint List */}
          <div className="planner-view__panel-section">
            <div className="planner-view__panel-title" style={{ color: '$color-green-400' }}>WAYPOINT LIST</div>
            
            {waypoints.length === 0 ? (
              <div className="text-center text-gray-400 font-mono text-sm">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                NO WAYPOINTS
                <br />
                Click on map to add
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {waypoints.map(waypoint => (
                  <div key={waypoint.id} className="bg-gray-600 rounded p-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        {getWaypointIcon(waypoint.type)}
                        <span className="font-mono text-sm text-white">WP {waypoint.id}</span>
                      </div>
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => removeWaypoint(waypoint.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs font-mono text-gray-300 space-y-0.5">
                      <div>Type: {waypoint.type.toUpperCase()}</div>
                      <div>Action: {waypoint.action.toUpperCase()}</div>
                      <div>Alt: {waypoint.altitude}m | Speed: {waypoint.speed} km/h</div>
                      <div>Pos: {waypoint.coordinates.lat.toFixed(4)}, {waypoint.coordinates.lng.toFixed(4)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Collaboration Panel */}
          <div className="planner-view__panel-section">
            <div className="planner-view__panel-title" style={{ color: '$color-orange-400' }}>COLLABORATION</div>
            
            <div className="space-y-2">
              {collaborators.map(collaborator => (
                <div key={collaborator.id} className="flex items-center justify-between p-2 bg-gray-600 rounded">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      collaborator.status === 'online' ? 'bg-green-400' :
                      collaborator.status === 'busy' ? 'bg-yellow-400' : 'bg-gray-400'
                    }`}></div>
                    <div>
                      <div className="text-sm font-mono text-white">{collaborator.name}</div>
                      <div className="text-xs font-mono text-gray-400">{collaborator.role}</div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button className="text-blue-400 hover:text-blue-300">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button className="text-green-400 hover:text-green-300">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-600">
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded font-mono text-sm">
                <Users className="w-4 h-4 inline mr-2" />
                INVITE COLLABORATOR
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded font-mono font-bold transition-colors">
              <Save className="w-4 h-4 inline mr-2" />
              SAVE MISSION
            </button>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-mono font-bold transition-colors">
              <Upload className="w-4 h-4 inline mr-2" />
              SUBMIT FOR APPROVAL
            </button>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded font-mono font-bold transition-colors">
              <Play className="w-4 h-4 inline mr-2" />
              RUN SIMULATION
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-3 rounded font-mono text-sm transition-colors">
                <Download className="w-4 h-4 inline mr-1" />
                EXPORT
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded font-mono text-sm transition-colors">
                <Archive className="w-4 h-4 inline mr-1" />
                ARCHIVE
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PlannerView;
