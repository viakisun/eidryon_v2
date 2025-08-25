"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Target, Route, Clock, Save, Upload,
  X, Check, AlertTriangle,
  Crosshair,
  Wind, Thermometer, CloudRain, Sun
} from 'lucide-react';

const MissionPlanningSystem = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedAsset, setSelectedAsset] = useState<string | null>('UAV-001');
  const [missionMode, setMissionMode] = useState('planning'); // planning, review, executing
  interface Waypoint {
    id: number;
    x: number;
    y: number;
    altitude: number;
    speed: number;
    action: string;
    loiterTime: number;
    coordinates: {
      lat: number;
      lng: number;
    };
  }

  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentWaypoint, setCurrentWaypoint] = useState(0);
  const [missionParams, setMissionParams] = useState({
    altitude: 1500,
    speed: 50,
    loiterTime: 300,
    payload: 'camera',
    returnToBase: true,
    emergencyLanding: true
  });
  const [selectedTool, setSelectedTool] = useState('waypoint'); // waypoint, area, route, target
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [missionTemplates, setMissionTemplates] = useState([
    { id: 1, name: 'AREA RECONNAISSANCE', type: 'recon', duration: '45min', waypoints: 8 },
    { id: 2, name: 'PATROL ROUTE', type: 'patrol', duration: '60min', waypoints: 6 },
    { id: 3, name: 'TARGET SURVEILLANCE', type: 'surveillance', duration: '120min', waypoints: 4 },
    { id: 4, name: 'CONVOY ESCORT', type: 'escort', duration: '90min', waypoints: 12 }
  ]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [threatAssessment, setThreatAssessment] = useState({
    airDefense: 'LOW',
    weather: 'GOOD',
    terrain: 'MODERATE',
    communications: 'EXCELLENT'
  });

  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Military Symbol Component
  interface MilitarySymbolProps {
    type: string;
    affiliation?: string;
    size?: number;
    label?: string;
  }

  const MilitarySymbol: React.FC<MilitarySymbolProps> = ({ type, size = 32, label = "" }) => {
    const getSymbolPath = () => {
      switch(type) {
        case 'waypoint':
          return "M12 2L2 7V17L12 22L22 17V7L12 2ZM20 16.17L12 20.17L4 16.17V7.83L12 3.83L20 7.83V16.17Z";
        case 'target':
          return "M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2M21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M12 15L18 21H6L12 15Z";
        case 'home':
          return "M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z";
        default:
          return "M12 2L2 7V17L12 22L22 17V7L12 2ZM20 16.17L12 20.17L4 16.17V7.83L12 3.83L20 7.83V16.17Z";
      }
    };

    const getColor = () => {
      switch(type) {
        case 'waypoint': return '#00BFFF';
        case 'target': return '#FF4444';
        case 'home': return '#00FF00';
        default: return '#00FF00';
      }
    };

    return (
      <div className="relative inline-block" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 24 24" className="absolute">
          <path
            d={getSymbolPath()}
            fill={getColor()}
            fillOpacity="0.3"
            stroke={getColor()}
            strokeWidth="2"
          />
        </svg>
        {label && (
          <div 
            className="absolute text-xs font-bold text-center whitespace-nowrap"
            style={{ 
              bottom: -20, 
              left: '50%', 
              transform: 'translateX(-50%)',
              color: getColor(),
              fontSize: size * 0.3
            }}
          >
            {label}
          </div>
        )}
      </div>
    );
  };

  // Waypoint management
  const addWaypoint = (x: number, y: number) => {
    const newWaypoint: Waypoint = {
      id: waypoints.length + 1,
      x: x,
      y: y,
      altitude: missionParams.altitude,
      speed: missionParams.speed,
      action: 'flyby',
      loiterTime: 0,
      coordinates: {
        lat: 37.2431 + (y - 50) * 0.001,
        lng: 127.0766 + (x - 50) * 0.001
      }
    };
    setWaypoints([...waypoints, newWaypoint]);
  };

  const removeWaypoint = (id: number) => {
    setWaypoints(waypoints.filter(wp => wp.id !== id));
  };

  const calculateMissionStats = () => {
    if (waypoints.length < 2) return { distance: 0, duration: 0, fuel: 0 };
    
    let totalDistance = 0;
    for (let i = 1; i < waypoints.length; i++) {
      const dx = waypoints[i].x - waypoints[i-1].x;
      const dy = waypoints[i].y - waypoints[i-1].y;
      totalDistance += Math.sqrt(dx*dx + dy*dy) * 10; // 임의 스케일
    }
    
    const avgSpeed = missionParams.speed;
    const duration = (totalDistance / avgSpeed) * 60; // minutes
    const fuel = Math.min(100, duration * 0.8); // 연료 소모율
    
    return { 
      distance: totalDistance,
      duration: duration,
      fuel: fuel
    };
  };

  const generateAutoRoute = (type: string) => {
    const basePoints = [];
    switch(type) {
      case 'patrol':
        basePoints.push(
          { x: 20, y: 30 }, { x: 80, y: 30 }, 
          { x: 80, y: 70 }, { x: 20, y: 70 }
        );
        break;
      case 'recon':
        basePoints.push(
          { x: 30, y: 40 }, { x: 70, y: 25 }, 
          { x: 85, y: 60 }, { x: 50, y: 75 }, { x: 15, y: 55 }
        );
        break;
      case 'surveillance':
        basePoints.push(
          { x: 50, y: 50 }, { x: 60, y: 40 }, { x: 60, y: 60 }, { x: 40, y: 60 }
        );
        break;
    }
    
    const autoWaypoints = basePoints.map((point, index) => ({
      id: index + 1,
      x: point.x,
      y: point.y,
      altitude: missionParams.altitude,
      speed: missionParams.speed,
      action: index === 0 ? 'takeoff' : (index === basePoints.length - 1 ? 'land' : 'flyby'),
      loiterTime: type === 'surveillance' ? 300 : 0,
      coordinates: {
        lat: 37.2431 + (point.y - 50) * 0.001,
        lng: 127.0766 + (point.x - 50) * 0.001
      }
    }));
    
    setWaypoints(autoWaypoints);
  };

  const getThreatColor = (level: string) => {
    switch(level) {
      case 'LOW': return 'text-green-400';
      case 'MODERATE': return 'text-yellow-400';
      case 'HIGH': return 'text-red-400';
      case 'EXCELLENT': return 'text-green-400';
      case 'GOOD': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const assets = [
    { 
      id: 'UAV-001', 
      type: 'reconnaissance',
      name: 'Ghost Recon', 
      status: 'available',
      maxRange: 50,
      maxAltitude: 3000,
      maxSpeed: 80,
      payload: ['camera', 'sensors']
    },
    { 
      id: 'UAV-002', 
      type: 'attack',
      name: 'Thunder Strike', 
      status: 'available',
      maxRange: 100,
      maxAltitude: 5000,
      maxSpeed: 120,
      payload: ['missiles', 'camera']
    },
    { 
      id: 'UAV-003', 
      type: 'surveillance',
      name: 'Eagle Eye', 
      status: 'maintenance',
      maxRange: 200,
      maxAltitude: 8000,
      maxSpeed: 60,
      payload: ['camera', 'radar', 'sensors']
    }
  ];

  return (
    <div className="h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Header */}
      <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Target className="w-6 h-6 text-blue-400" />
            <span className="text-xl font-bold font-mono">MISSION PLANNING</span>
            <span className="text-xs text-blue-400 font-mono">[CLASSIFIED]</span>
          </div>
          <div className="h-6 w-px bg-gray-600"></div>
          <span className="text-sm text-gray-300 font-mono">
            OP GUARDIAN SHIELD // MISSION PLANNER v2.1
          </span>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Mission Mode Selector */}
          <div className="flex items-center space-x-2">
            {['planning', 'review', 'executing'].map(mode => (
              <button
                key={mode}
                onClick={() => setMissionMode(mode)}
                className={`px-3 py-1 rounded text-sm font-mono transition-colors ${
                  missionMode === mode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                {mode.toUpperCase()}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-mono">{currentTime.toISOString().slice(11,19)}Z</span>
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Left Panel - Mission Tools */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 p-4 space-y-4 overflow-y-auto">
          
          {/* Asset Selection */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono">ASSET SELECTION</div>
            <select 
              value={selectedAsset || ''}
              onChange={(e) => setSelectedAsset(e.target.value)}
              className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-sm font-mono"
            >
              {assets.map(asset => (
                <option key={asset.id} value={asset.id} disabled={asset.status !== 'available'}>
                  {asset.id} - {asset.name} ({asset.status.toUpperCase()})
                </option>
              ))}
            </select>
            
            {selectedAsset && (
              <div className="mt-3 text-xs font-mono space-y-1">
                {(() => {
                  const asset = assets.find(a => a.id === selectedAsset);
                  if (!asset) return null;
                  return (
                    <>
                      <div className="flex justify-between">
                        <span>MAX RANGE:</span>
                        <span className="text-blue-400">{asset.maxRange} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span>MAX ALT:</span>
                        <span className="text-blue-400">{asset.maxAltitude} m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>MAX SPEED:</span>
                        <span className="text-blue-400">{asset.maxSpeed} km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>PAYLOAD:</span>
                        <span className="text-blue-400">{asset.payload.join(', ').toUpperCase()}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Mission Templates */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono">MISSION TEMPLATES</div>
            <div className="space-y-2">
              {missionTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => generateAutoRoute(template.type)}
                  className="w-full text-left bg-gray-600 hover:bg-gray-500 rounded p-2 transition-colors"
                >
                  <div className="text-sm font-mono text-green-400">{template.name}</div>
                  <div className="text-xs text-gray-300 font-mono">
                    {template.duration} • {template.waypoints} WP
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Planning Tools */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono">PLANNING TOOLS</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'waypoint', icon: MapPin, label: 'WAYPOINT' },
                { id: 'area', icon: Target, label: 'AREA' },
                { id: 'route', icon: Route, label: 'ROUTE' },
                { id: 'target', icon: Crosshair, label: 'TARGET' }
              ].map(tool => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className={`p-3 rounded text-xs font-mono transition-colors flex flex-col items-center space-y-1 ${
                    selectedTool === tool.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                >
                  <tool.icon className="w-4 h-4" />
                  <span>{tool.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mission Parameters */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono">MISSION PARAMETERS</div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1">ALTITUDE (m)</label>
                <input
                  type="number"
                  value={missionParams.altitude}
                  onChange={(e) => setMissionParams({...missionParams, altitude: parseInt(e.target.value)})}
                  className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 text-sm font-mono"
                  min="100"
                  max="3000"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1">SPEED (km/h)</label>
                <input
                  type="number"
                  value={missionParams.speed}
                  onChange={(e) => setMissionParams({...missionParams, speed: parseInt(e.target.value)})}
                  className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 text-sm font-mono"
                  min="20"
                  max="120"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1">PAYLOAD</label>
                <select
                  value={missionParams.payload}
                  onChange={(e) => setMissionParams({...missionParams, payload: e.target.value})}
                  className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 text-sm font-mono"
                >
                  <option value="camera">CAMERA</option>
                  <option value="sensors">SENSORS</option>
                  <option value="missiles">MISSILES</option>
                  <option value="radar">RADAR</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mission Statistics */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono">MISSION ANALYSIS</div>
            {(() => {
              const stats = calculateMissionStats();
              return (
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span>DISTANCE:</span>
                    <span className="text-blue-400">{stats.distance.toFixed(1)} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DURATION:</span>
                    <span className="text-blue-400">{stats.duration.toFixed(0)} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FUEL REQ:</span>
                    <span className={`${stats.fuel > 80 ? 'text-red-400' : 'text-green-400'}`}>
                      {stats.fuel.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>WAYPOINTS:</span>
                    <span className="text-blue-400">{waypoints.length}</span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Threat Assessment */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono">THREAT ASSESSMENT</div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span>AIR DEFENSE:</span>
                <span className={getThreatColor(threatAssessment.airDefense)}>
                  {threatAssessment.airDefense}
                </span>
              </div>
              <div className="flex justify-between">
                <span>WEATHER:</span>
                <span className={getThreatColor(threatAssessment.weather)}>
                  {threatAssessment.weather}
                </span>
              </div>
              <div className="flex justify-between">
                <span>TERRAIN:</span>
                <span className={getThreatColor(threatAssessment.terrain)}>
                  {threatAssessment.terrain}
                </span>
              </div>
              <div className="flex justify-between">
                <span>COMMS:</span>
                <span className={getThreatColor(threatAssessment.communications)}>
                  {threatAssessment.communications}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-mono text-sm transition-colors">
              <Save className="w-4 h-4 inline mr-2" />
              SAVE MISSION
            </button>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-mono text-sm transition-colors">
              <Upload className="w-4 h-4 inline mr-2" />
              UPLOAD TO ASSET
            </button>
            <button 
              onClick={() => setWaypoints([])}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded font-mono text-sm transition-colors"
            >
              <X className="w-4 h-4 inline mr-2" />
              CLEAR MISSION
            </button>
          </div>
        </div>

        {/* Main Planning Area */}
        <div className="flex-1 relative">
          {/* 3D Map Background */}
          <div 
            ref={mapRef}
            className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 cursor-crosshair"
            onClick={(e) => {
              if (selectedTool === 'waypoint' && missionMode === 'planning' && mapRef.current) {
                const rect = mapRef.current.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                addWaypoint(x, y);
              }
            }}
          >
            {/* Military Grid */}
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="militaryGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#00FF00" strokeWidth="1"/>
                    <text x="2" y="12" fill="#00FF00" fontSize="10" fontFamily="monospace">
                      {Math.floor(Math.random() * 900) + 100}
                    </text>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#militaryGrid)" />
              </svg>
            </div>

            {/* Operation Areas */}
            <div className="absolute top-20 left-20 w-64 h-48 border-2 border-green-500 bg-green-500/10 rounded-lg">
              <div className="absolute -top-6 left-2 text-xs font-bold text-green-400 font-mono">AO GUARDIAN</div>
            </div>
            <div className="absolute top-40 right-32 w-48 h-36 border-2 border-yellow-500 bg-yellow-500/10 rounded-lg">
              <div className="absolute -top-6 left-2 text-xs font-bold text-yellow-400 font-mono">TAO THUNDER</div>
            </div>
            <div className="absolute bottom-32 left-40 w-32 h-32 border-2 border-red-500 bg-red-500/10 rounded-lg">
              <div className="absolute -top-6 left-2 text-xs font-bold text-red-400 font-mono">EZ LIGHTNING</div>
            </div>

            {/* Home Base */}
            <div className="absolute bottom-20 right-20">
              <MilitarySymbol type="home" size={32} label="HOME BASE" />
            </div>

            {/* Flight Path */}
            {waypoints.length > 1 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <polyline
                  points={waypoints.map(wp => `${wp.x}% ${wp.y}%`).join(' ')}
                  fill="none"
                  stroke="#00BFFF"
                  strokeWidth="3"
                  strokeDasharray="10,5"
                  markerEnd="url(#arrowhead)"
                />
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" 
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
                <MilitarySymbol 
                  type="waypoint" 
                  size={24} 
                  label={`WP${waypoint.id}`}
                />
                
                {/* Waypoint Info Popup */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800/90 rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  <div className="text-xs font-mono text-blue-400">WP {waypoint.id}</div>
                  <div className="text-xs font-mono text-gray-300">
                    ALT: {waypoint.altitude}m
                  </div>
                  <div className="text-xs font-mono text-gray-300">
                    SPD: {waypoint.speed} km/h
                  </div>
                  <div className="text-xs font-mono text-gray-300">
                    {waypoint.coordinates.lat.toFixed(4)}, {waypoint.coordinates.lng.toFixed(4)}
                  </div>
                  {missionMode === 'planning' && (
                    <button
                      onClick={() => removeWaypoint(waypoint.id)}
                      className="mt-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                    >
                      DELETE
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Current Tool Indicator */}
            <div className="absolute top-4 left-4 bg-gray-800/90 rounded-lg p-2">
              <div className="text-sm font-mono text-blue-400">
                MODE: {selectedTool.toUpperCase()}
              </div>
              {selectedTool === 'waypoint' && (
                <div className="text-xs font-mono text-gray-300">
                  Click to add waypoint
                </div>
              )}
            </div>

            {/* Mission Progress (when executing) */}
            {missionMode === 'executing' && waypoints.length > 0 && (
              <div className="absolute top-4 right-4 bg-gray-800/90 rounded-lg p-3">
                <div className="text-sm font-mono text-green-400 mb-2">MISSION EXECUTING</div>
                <div className="text-xs font-mono text-gray-300">
                  Current WP: {currentWaypoint + 1} / {waypoints.length}
                </div>
                <div className="text-xs font-mono text-gray-300">
                  Progress: {((currentWaypoint / (waypoints.length - 1)) * 100).toFixed(0)}%
                </div>
                <div className="w-32 bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-400 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(currentWaypoint / (waypoints.length - 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Waypoint List */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 p-4">
          <div className="text-lg font-semibold mb-4 font-mono">WAYPOINT LIST</div>
          
          {waypoints.length === 0 ? (
            <div className="text-center text-gray-400 font-mono text-sm mt-8">
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
              NO WAYPOINTS DEFINED
              <br />
              Click on map or use templates
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {waypoints.map((waypoint) => (
                <div
                  key={waypoint.id}
                  className={`bg-gray-700 rounded-lg p-3 transition-all ${
                    missionMode === 'executing' && waypoint.id === currentWaypoint
                      ? 'ring-2 ring-green-400 bg-gray-600' 
                      : 'hover:bg-gray-650'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span className="font-medium text-sm font-mono text-blue-400">
                        WAYPOINT {waypoint.id}
                      </span>
                    </div>
                    {missionMode === 'executing' && waypoint.id === currentWaypoint && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-300 space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span>COORDINATES:</span>
                      <span className="text-green-400">
                        {waypoint.coordinates.lat.toFixed(4)}, {waypoint.coordinates.lng.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>ALTITUDE:</span>
                      <span className="text-yellow-400">{waypoint.altitude}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SPEED:</span>
                      <span className="text-yellow-400">{waypoint.speed} km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ACTION:</span>
                      <span className="text-cyan-400">{waypoint.action.toUpperCase()}</span>
                    </div>
                    {waypoint.loiterTime > 0 && (
                      <div className="flex justify-between">
                        <span>LOITER:</span>
                        <span className="text-purple-400">{waypoint.loiterTime}s</span>
                      </div>
                    )}
                  </div>

                  {missionMode === 'planning' && (
                    <div className="mt-2 flex space-x-1">
                      <button
                        onClick={() => removeWaypoint(waypoint.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded text-xs font-mono"
                      >
                        DELETE
                      </button>
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded text-xs font-mono">
                        EDIT
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Weather Conditions */}
          <div className="mt-6 bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono">WEATHER CONDITIONS</div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wind className="w-4 h-4 text-blue-400" />
                  <span>WIND:</span>
                </div>
                <span className="text-blue-400">120°/12KT</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-4 h-4 text-green-400" />
                  <span>TEMP:</span>
                </div>
                <span className="text-green-400">18°C</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CloudRain className="w-4 h-4 text-gray-400" />
                  <span>PRECIP:</span>
                </div>
                <span className="text-gray-400">0%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sun className="w-4 h-4 text-yellow-400" />
                  <span>VIS:</span>
                </div>
                <span className="text-yellow-400">10+ km</span>
              </div>
            </div>
          </div>

          {/* Mission Validation */}
          {waypoints.length > 0 && (
            <div className="mt-4 bg-gray-700 rounded-lg p-4">
              <div className="text-sm font-medium mb-3 font-mono">MISSION VALIDATION</div>
              <div className="space-y-2">
                {(() => {
                  const stats = calculateMissionStats();
                  const validations = [
                    { 
                      check: waypoints.length >= 2, 
                      message: 'Minimum 2 waypoints', 
                      status: waypoints.length >= 2 ? 'pass' : 'fail' 
                    },
                    { 
                      check: stats.fuel <= 90,
                      message: 'Fuel consumption OK', 
                      status: stats.fuel <= 90 ? 'pass' : 'warn'
                    },
                    { 
                      check: stats.duration <= 120,
                      message: 'Mission duration OK', 
                      status: stats.duration <= 120 ? 'pass' : 'warn'
                    },
                    { 
                      check: missionParams.altitude >= 500, 
                      message: 'Safe altitude', 
                      status: missionParams.altitude >= 500 ? 'pass' : 'fail' 
                    }
                  ];

                  return validations.map((validation) => (
                    <div key={validation.message} className="flex items-center space-x-2 text-xs font-mono">
                      {validation.status === 'pass' && <Check className="w-4 h-4 text-green-400" />}
                      {validation.status === 'warn' && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                      {validation.status === 'fail' && <X className="w-4 h-4 text-red-400" />}
                      <span className={
                        validation.status === 'pass' ? 'text-green-400' :
                        validation.status === 'warn' ? 'text-yellow-400' : 'text-red-400'
                      }>
                        {validation.message}
                      </span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionPlanningSystem;
