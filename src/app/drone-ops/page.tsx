import React, { useState, useEffect } from 'react';
import { Camera, Radio, Battery, AlertTriangle, Target, Navigation, Shield, Activity, MapPin, Clock, Users, Zap, Settings, Eye, Plane, Bell, X, ChevronDown, ChevronUp, Compass, Gauge, Navigation2, Wifi, WifiOff } from 'lucide-react';

const IntegratedOperationsDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [telemetryExpanded, setTelemetryExpanded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateTelemetryData();
      if (Math.random() < 0.08) {
        generateRandomNotification();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Military Symbol Components
  const MilitarySymbol = ({ type, affiliation = "friend", status = "present", size = 32, echelon = null, uniqueDesignation = "", additionalInfo = "" }) => {
    const getSymbolPath = () => {
      switch(type) {
        case 'uav-reconnaissance':
          return "M12 2L2 7V17L12 22L22 17V7L12 2ZM20 16.17L12 20.17L4 16.17V7.83L12 3.83L20 7.83V16.17ZM12 6C10.34 6 9 7.34 9 9S10.34 12 12 12S15 10.66 15 9S13.66 6 12 6ZM12 10C11.45 10 11 9.55 11 9S11.45 8 12 8S13 8.45 13 9S12.55 10 12 10Z";
        case 'uav-attack':
          return "M12 2L2 7V17L12 22L22 17V7L12 2ZM20 16.17L12 20.17L4 16.17V7.83L12 3.83L20 7.83V16.17ZM16 9L12 5L8 9H10.5V15H13.5V9H16Z";
        case 'uav-surveillance':
          return "M12 2L2 7V17L12 22L22 17V7L12 2ZM20 16.17L12 20.17L4 16.17V7.83L12 3.83L20 7.83V16.17ZM12 8A3 3 0 0 0 9 11A3 3 0 0 0 12 14A3 3 0 0 0 15 11A3 3 0 0 0 12 8Z";
        case 'uav-communication':
          return "M12 2L2 7V17L12 22L22 17V7L12 2ZM20 16.17L12 20.17L4 16.17V7.83L12 3.83L20 7.83V16.17ZM16 11C16 8.8 14.2 7 12 7S8 8.8 8 11C8 11.4 8.1 11.8 8.2 12.2L6.8 13.6C6.3 12.8 6 11.9 6 11C6 7.7 8.7 5 12 5S18 7.7 18 11C18 11.9 17.7 12.8 17.2 13.6L15.8 12.2C15.9 11.8 16 11.4 16 11Z";
        default:
          return "M12 2L2 7V17L12 22L22 17V7L12 2ZM20 16.17L12 20.17L4 16.17V7.83L12 3.83L20 7.83V16.17Z";
      }
    };

    const getAffiliationColor = () => {
      switch(affiliation) {
        case 'friend': return '#00FF00';
        case 'hostile': return '#FF0000';
        case 'neutral': return '#FFFF00';
        case 'unknown': return '#FF00FF';
        default: return '#00FF00';
      }
    };

    const getStatusIndicator = () => {
      switch(status) {
        case 'present': return '';
        case 'anticipated': return 'stroke-dasharray="5,5"';
        case 'damaged': return 'opacity="0.7"';
        case 'destroyed': return 'opacity="0.4"';
        default: return '';
      }
    };

    const getEchelonSymbol = () => {
      if (!echelon) return null;
      switch(echelon) {
        case 'squad': return '●';
        case 'section': return '●●';
        case 'platoon': return '●●●';
        case 'company': return '|';
        case 'battalion': return '||';
        case 'brigade': return 'X';
        case 'division': return 'XX';
        default: return null;
      }
    };

    return (
      <div className="relative inline-block" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 24 24" className="absolute">
          {/* Main Symbol Frame */}
          <path
            d={getSymbolPath()}
            fill="none"
            stroke={getAffiliationColor()}
            strokeWidth="2"
            {...(status !== 'present' ? { [getStatusIndicator().split('=')[0]]: getStatusIndicator().split('=')[1] } : {})}
          />
          {/* Fill for operational status */}
          {status === 'present' && (
            <path
              d={getSymbolPath()}
              fill={getAffiliationColor()}
              fillOpacity="0.2"
            />
          )}
        </svg>
        
        {/* Echelon Indicator */}
        {echelon && (
          <div 
            className="absolute text-xs font-bold text-center"
            style={{ 
              top: -8, 
              left: '50%', 
              transform: 'translateX(-50%)',
              color: getAffiliationColor(),
              fontSize: size * 0.3
            }}
          >
            {getEchelonSymbol()}
          </div>
        )}
        
        {/* Unique Designation */}
        {uniqueDesignation && (
          <div 
            className="absolute text-xs font-bold text-center whitespace-nowrap"
            style={{ 
              bottom: -16, 
              left: '50%', 
              transform: 'translateX(-50%)',
              color: getAffiliationColor(),
              fontSize: size * 0.25
            }}
          >
            {uniqueDesignation}
          </div>
        )}
        
        {/* Additional Information */}
        {additionalInfo && (
          <div 
            className="absolute text-xs text-center whitespace-nowrap"
            style={{ 
              bottom: -28, 
              left: '50%', 
              transform: 'translateX(-50%)',
              color: getAffiliationColor(),
              fontSize: size * 0.2
            }}
          >
            {additionalInfo}
          </div>
        )}
      </div>
    );
  };

  // Tactical Graphics Component
  const TacticalGraphic = ({ type, points, color = "#00FF00", label = "" }) => {
    const renderGraphic = () => {
      switch(type) {
        case 'boundary':
          return (
            <g>
              <line x1={points[0]} y1={points[1]} x2={points[2]} y2={points[3]} 
                    stroke={color} strokeWidth="3" strokeDasharray="10,5" />
              {label && (
                <text x={(points[0] + points[2]) / 2} y={(points[1] + points[3]) / 2 - 10} 
                      fill={color} fontSize="12" textAnchor="middle">{label}</text>
              )}
            </g>
          );
        case 'area':
          return (
            <g>
              <polygon points={points.join(' ')} fill={color} fillOpacity="0.2" 
                       stroke={color} strokeWidth="2" />
              {label && (
                <text x={points[0]} y={points[1] - 10} fill={color} fontSize="12">{label}</text>
              )}
            </g>
          );
        case 'route':
          return (
            <g>
              <polyline points={points.join(' ')} fill="none" stroke={color} 
                        strokeWidth="3" markerEnd="url(#arrowhead)" />
              {label && (
                <text x={points[points.length-2]} y={points[points.length-1] - 10} 
                      fill={color} fontSize="12">{label}</text>
              )}
            </g>
          );
        default:
          return null;
      }
    };

    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                  refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={color} />
          </marker>
        </defs>
        {renderGraphic()}
      </svg>
    );
  };

  // 드론 자산 데이터 (군대부호 정보 추가)
  const [assets, setAssets] = useState([
    { 
      id: 'UAV-001', 
      type: 'uav-reconnaissance',
      militaryDesignation: 'RQ-11B',
      name: 'Ghost Recon', 
      status: 'active',
      affiliation: 'friend',
      echelon: 'squad',
      battery: 87, 
      position: { x: 45, y: 35 }, 
      mission: 'PATROL-ALPHA',
      tacticalTask: 'RECON',
      telemetry: {
        gps: { lat: 37.2431, lng: 127.0766, accuracy: 3.2, satellites: 12 },
        altitude: 1245.6,
        yaw: 156.8,
        pitch: -2.1,
        roll: 1.3,
        speed: { ground: 45.2, air: 47.8, vertical: 0.3 },
        distance: { home: 2847.5, waypoint: 156.2 },
        flightMode: 'AUTO',
        signal: { strength: -72, quality: 85 },
        engine: { temp: 68.5, rpm: 2450, fuel: 87 }
      }
    },
    { 
      id: 'UAV-002', 
      type: 'uav-attack',
      militaryDesignation: 'MQ-9',
      name: 'Thunder Strike', 
      status: 'standby',
      affiliation: 'friend',
      echelon: 'platoon',
      battery: 92, 
      position: { x: 65, y: 55 }, 
      mission: 'STANDBY',
      tacticalTask: 'ATK',
      telemetry: {
        gps: { lat: 37.2398, lng: 127.0823, accuracy: 2.8, satellites: 14 },
        altitude: 0,
        yaw: 270.0,
        pitch: 0,
        roll: 0,
        speed: { ground: 0, air: 0, vertical: 0 },
        distance: { home: 0, waypoint: 0 },
        flightMode: 'STANDBY',
        signal: { strength: -65, quality: 92 },
        engine: { temp: 35.2, rpm: 0, fuel: 92 }
      }
    },
    { 
      id: 'UAV-003', 
      type: 'uav-surveillance',
      militaryDesignation: 'RQ-4B',
      name: 'Eagle Eye', 
      status: 'active',
      affiliation: 'friend',
      echelon: 'company',
      battery: 73, 
      position: { x: 30, y: 60 }, 
      mission: 'OVERWATCH-BRAVO',
      tacticalTask: 'SURV',
      telemetry: {
        gps: { lat: 37.2465, lng: 127.0712, accuracy: 4.1, satellites: 11 },
        altitude: 2385.3,
        yaw: 89.2,
        pitch: -15.7,
        roll: -0.8,
        speed: { ground: 12.5, air: 15.2, vertical: -0.1 },
        distance: { home: 4521.8, waypoint: 892.3 },
        flightMode: 'LOITER',
        signal: { strength: -78, quality: 78 },
        engine: { temp: 72.1, rpm: 1850, fuel: 73 }
      }
    },
    { 
      id: 'UAV-004', 
      type: 'uav-communication',
      militaryDesignation: 'MQ-8C',
      name: 'Link Master', 
      status: 'maintenance',
      affiliation: 'friend',
      echelon: 'section',
      battery: 15, 
      position: { x: 50, y: 25 }, 
      mission: 'OFFLINE',
      tacticalTask: 'COMM',
      telemetry: {
        gps: { lat: 37.2412, lng: 127.0789, accuracy: 0, satellites: 0 },
        altitude: 0,
        yaw: 0,
        pitch: 0,
        roll: 0,
        speed: { ground: 0, air: 0, vertical: 0 },
        distance: { home: 0, waypoint: 0 },
        flightMode: 'OFFLINE',
        signal: { strength: -95, quality: 15 },
        engine: { temp: 25.0, rpm: 0, fuel: 15 }
      }
    },
    { 
      id: 'UAV-005', 
      type: 'uav-reconnaissance',
      militaryDesignation: 'RQ-7B',
      name: 'Shadow Walker', 
      status: 'active',
      affiliation: 'friend',
      echelon: 'squad',
      battery: 64, 
      position: { x: 75, y: 40 }, 
      mission: 'RECON-CHARLIE',
      tacticalTask: 'RECON',
      telemetry: {
        gps: { lat: 37.2387, lng: 127.0856, accuracy: 3.5, satellites: 13 },
        altitude: 1876.2,
        yaw: 45.6,
        pitch: -8.3,
        roll: 2.1,
        speed: { ground: 38.7, air: 41.2, vertical: 1.8 },
        distance: { home: 3156.7, waypoint: 234.8 },
        flightMode: 'GUIDED',
        signal: { strength: -74, quality: 81 },
        engine: { temp: 65.8, rpm: 2200, fuel: 64 }
      }
    }
  ]);

  const updateTelemetryData = () => {
    setAssets(prevAssets => 
      prevAssets.map(asset => {
        if (asset.status === 'active') {
          return {
            ...asset,
            telemetry: {
              ...asset.telemetry,
              yaw: (asset.telemetry.yaw + (Math.random() - 0.5) * 2) % 360,
              speed: {
                ...asset.telemetry.speed,
                ground: Math.max(0, asset.telemetry.speed.ground + (Math.random() - 0.5) * 5),
                air: Math.max(0, asset.telemetry.speed.air + (Math.random() - 0.5) * 5)
              },
              signal: {
                ...asset.telemetry.signal,
                strength: Math.max(-100, Math.min(-50, asset.telemetry.signal.strength + (Math.random() - 0.5) * 5)),
                quality: Math.max(0, Math.min(100, asset.telemetry.signal.quality + (Math.random() - 0.5) * 10))
              }
            }
          };
        }
        return asset;
      })
    );
  };

  const generateRandomNotification = () => {
    const notificationTypes = [
      { type: 'warning', message: '▲ UAV-003 배터리 임계치 접근', priority: 'medium' },
      { type: 'info', message: '→ UAV-001 Checkpoint ALPHA 통과', priority: 'low' },
      { type: 'error', message: '✗ UAV-004 데이터링크 LOST', priority: 'high' },
      { type: 'success', message: '✓ UAV-002 Pre-flight 점검 완료', priority: 'low' },
      { type: 'warning', message: '⚠ EZ-1 Unknown 접촉 탐지', priority: 'high' }
    ];
    
    const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    const newNotification = {
      id: Date.now(),
      ...randomNotification,
      timestamp: new Date()
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationColor = (type) => {
    switch(type) {
      case 'error': return 'border-red-500 bg-red-900/30 text-red-300';
      case 'warning': return 'border-yellow-500 bg-yellow-900/30 text-yellow-300';
      case 'success': return 'border-green-500 bg-green-900/30 text-green-300';
      default: return 'border-blue-500 bg-blue-900/30 text-blue-300';
    }
  };

  const getFlightModeColor = (mode) => {
    switch(mode) {
      case 'AUTO': return 'text-green-400';
      case 'GUIDED': return 'text-blue-400';
      case 'LOITER': return 'text-yellow-400';
      case 'STANDBY': return 'text-gray-400';
      case 'OFFLINE': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSignalStrengthIcon = (strength) => {
    if (strength > -60) return <Wifi className="w-4 h-4 text-green-400" />;
    if (strength > -80) return <Wifi className="w-4 h-4 text-yellow-400" />;
    return <WifiOff className="w-4 h-4 text-red-400" />;
  };

  const getTacticalTaskColor = (task) => {
    switch(task) {
      case 'RECON': return 'text-blue-400';
      case 'ATK': return 'text-red-400';
      case 'SURV': return 'text-green-400';
      case 'COMM': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  // 작전구역 데이터 (군대부호 적용)
  const operationAreas = [
    { 
      id: 'AO-MAIN', 
      type: 'AO', 
      name: 'AO GUARDIAN', 
      color: '#00FF00', 
      coords: '37.24N 127.08E',
      designation: 'AO',
      commander: '1-501 IN'
    },
    { 
      id: 'TAO-1', 
      type: 'TAO', 
      name: 'TAO THUNDER', 
      color: '#FFFF00', 
      coords: '37.23N 127.09E',
      designation: 'TAO',
      commander: 'A/1-501'
    },
    { 
      id: 'EZ-1', 
      type: 'EZ', 
      name: 'EZ LIGHTNING', 
      color: '#FF0000', 
      coords: '37.25N 127.07E',
      designation: 'EZ',
      commander: 'FIRES'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'text-green-400';
      case 'standby': return 'text-yellow-400';
      case 'maintenance': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-gray-100 overflow-hidden relative">
      {/* Header Bar */}
      <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-green-400" />
            <span className="text-xl font-bold">C2 GUARDIAN SHIELD</span>
            <span className="text-xs text-green-400 font-mono">[S]</span>
          </div>
          <div className="h-6 w-px bg-gray-600"></div>
          <span className="text-sm text-gray-300 font-mono">OP GUARDIAN SHIELD // DTG: {currentTime.toISOString().slice(0,10).replace(/-/g,'')}</span>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Notification Bell */}
          <div className="relative">
            <button 
              className="relative p-2 hover:bg-gray-700 rounded transition-colors"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs">
                  {notifications.length}
                </div>
              )}
            </button>
            
            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-3 border-b border-gray-600 font-medium font-mono">SITREP // ALERTS</div>
                {notifications.length === 0 ? (
                  <div className="p-4 text-gray-400 text-center font-mono">NO ACTIVE ALERTS</div>
                ) : (
                  notifications.map(notification => (
                    <div key={notification.id} className={`p-3 border-b border-gray-700 last:border-b-0 ${getNotificationColor(notification.type)} border-l-4`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="text-sm font-mono">{notification.message}</div>
                          <div className="text-xs text-gray-400 mt-1 font-mono">
                            DTG: {notification.timestamp.toISOString().slice(11,19)}Z
                          </div>
                        </div>
                        <button 
                          onClick={() => dismissNotification(notification.id)}
                          className="ml-2 text-gray-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-mono">{currentTime.toISOString().slice(11,19)}Z</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-mono">REDCON-1</span>
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Left Sidebar - System Status */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 p-4 space-y-4">
          <div className="text-lg font-semibold mb-4 font-mono">SYSTEM STATUS</div>
          
          {/* Weather Info */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-2 font-mono">WX CONDITIONS</div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div>WIND: 120°/12KT</div>
              <div>VIS: 10+ KM</div>
              <div>TEMP: +18°C</div>
              <div>RH: 65%</div>
              <div>CEILING: 3000m</div>
              <div>QNH: 1013</div>
            </div>
          </div>

          {/* Active Missions */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono">ACTIVE MISSIONS</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span>MSN ALPHA</span>
                <span className="text-green-400">●ACTIVE</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span>MSN BRAVO</span>
                <span className="text-green-400">●ACTIVE</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span>MSN CHARLIE</span>
                <span className="text-green-400">●ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Operation Areas */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono">CONTROL MEASURES</div>
            <div className="space-y-2">
              {operationAreas.map(area => (
                <div key={area.id} className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs font-mono">
                    <div 
                      className="w-3 h-3 rounded border-2"
                      style={{ borderColor: area.color, backgroundColor: area.color + '20' }}
                    ></div>
                    <div>
                      <div className="font-medium" style={{ color: area.color }}>{area.designation}</div>
                      <div className="text-gray-400">{area.coords}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 font-mono ml-5">
                    CMD: {area.commander}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-red-400 font-mono">PRIORITY ALERTS</span>
            </div>
            <div className="space-y-1 text-xs text-red-300 font-mono">
              <div>✗ UAV-004 MAINT REQ - PWR LOW</div>
              <div>▲ UAV-003 COMMS DEGRADED</div>
              <div>⚠ UNKNOWN CONTACT IN EZ-1</div>
            </div>
          </div>
        </div>

        {/* Main 3D Map Area */}
        <div className="flex-1 relative">
          {/* 3D Map Background (Simulated) */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
            {/* Military Grid Pattern */}
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="militaryGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00FF00" strokeWidth="1"/>
                    <text x="2" y="12" fill="#00FF00" fontSize="8" fontFamily="monospace">37.24</text>
                    <text x="2" y="38" fill="#00FF00" fontSize="8" fontFamily="monospace">127.08</text>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#militaryGrid)" />
              </svg>
            </div>

            {/* Tactical Graphics for Operation Areas */}
            <TacticalGraphic 
              type="area" 
              points={[80, 80, 320, 80, 320, 272, 80, 272]} 
              color="#00FF00" 
              label="AO GUARDIAN"
            />
            <TacticalGraphic 
              type="area" 
              points={[400, 160, 592, 160, 592, 304, 400, 304]} 
              color="#FFFF00" 
              label="TAO THUNDER"
            />
            <TacticalGraphic 
              type="area" 
              points={[160, 384, 288, 384, 288, 512, 160, 512]} 
              color="#FF0000" 
              label="EZ LIGHTNING"
            />

            {/* Boundaries */}
            <TacticalGraphic 
              type="boundary" 
              points={[0, 300, 800, 300]} 
              color="#FFFF00" 
              label="FLOT"
            />

            {/* Asset Positions with Military Symbols */}
            {assets.map(asset => (
              <div
                key={asset.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
                  selectedAsset === asset.id ? 'scale-125' : 'hover:scale-110'
                } transition-transform`}
                style={{
                  left: `${asset.position.x}%`,
                  top: `${asset.position.y}%`
                }}
                onClick={() => setSelectedAsset(selectedAsset === asset.id ? null : asset.id)}
              >
                <MilitarySymbol 
                  type={asset.type}
                  affiliation={asset.affiliation}
                  status={asset.status}
                  size={40}
                  echelon={asset.echelon}
                  uniqueDesignation={asset.id}
                  additionalInfo={asset.tacticalTask}
                />
                {asset.status === 'active' && (
                  <div className="absolute -inset-6 border border-green-400 rounded-full animate-ping opacity-30"></div>
                )}
              </div>
            ))}
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 bg-gray-800/90 rounded-lg p-2 space-y-2">
            <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors" title="Navigation">
              <Navigation className="w-4 h-4" />
            </button>
            <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors" title="Grid Reference">
              <MapPin className="w-4 h-4" />
            </button>
            <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors" title="Settings">
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Military Grid Reference Display */}
          <div className="absolute top-4 left-4 bg-gray-800/90 rounded-lg p-2">
            <div className="text-xs font-mono text-green-400">
              MGRS: 52SCE1234567890
            </div>
            <div className="text-xs font-mono text-green-400">
              SCALE: 1:50,000
            </div>
          </div>

          {/* Selected Asset Detailed Info Overlay */}
          {selectedAsset && (
            <div className="absolute bottom-4 left-4 bg-gray-800/95 rounded-lg p-4 w-96 border border-green-400">
              {(() => {
                const asset = assets.find(a => a.id === selectedAsset);
                return (
                  <div className="space-y-4">
                    <div className="border-b border-gray-600 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MilitarySymbol 
                            type={asset.type}
                            affiliation={asset.affiliation}
                            status={asset.status}
                            size={24}
                          />
                          <div>
                            <div className="font-bold font-mono text-green-400">{asset.id}</div>
                            <div className="text-xs text-gray-400 font-mono">{asset.militaryDesignation}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium font-mono ${getStatusColor(asset.status)}`}>
                            {asset.status.toUpperCase()}
                          </span>
                          {getSignalStrengthIcon(asset.telemetry.signal.strength)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Mission Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400 text-xs font-mono">MISSION</div>
                        <div className="font-medium font-mono">{asset.mission}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs font-mono">TASK</div>
                        <div className={`font-medium font-mono ${getTacticalTaskColor(asset.tacticalTask)}`}>
                          {asset.tacticalTask}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs font-mono">FLIGHT MODE</div>
                        <div className={`font-medium font-mono ${getFlightModeColor(asset.telemetry.flightMode)}`}>
                          {asset.telemetry.flightMode}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs font-mono">ECHELON</div>
                        <div className="font-medium font-mono text-blue-400">{asset.echelon.toUpperCase()}</div>
                      </div>
                    </div>

                    {/* Battery */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1">
                          <Battery className="w-4 h-4" />
                          <span className="font-mono">POWER</span>
                        </div>
                        <span className={`font-medium font-mono ${
                          asset.battery > 70 ? 'text-green-400' :
                          asset.battery > 30 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {asset.battery}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            asset.battery > 70 ? 'bg-green-400' :
                            asset.battery > 30 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${asset.battery}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Telemetry Toggle */}
                    <button 
                      onClick={() => setTelemetryExpanded(!telemetryExpanded)}
                      className="w-full flex items-center justify-between bg-gray-700 hover:bg-gray-600 rounded p-2 transition-colors"
                    >
                      <span className="text-sm font-medium font-mono">DETAILED TELEMETRY</span>
                      {telemetryExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {/* Detailed Telemetry */}
                    {telemetryExpanded && (
                      <div className="space-y-3 bg-gray-700/50 rounded p-3">
                        {/* GPS & Position */}
                        <div className="grid grid-cols-3 gap-3 text-xs">
                          <div>
                            <div className="text-gray-400 font-mono">LAT</div>
                            <div className="font-mono text-green-400">{asset.telemetry.gps.lat.toFixed(4)}°</div>
                          </div>
                          <div>
                            <div className="text-gray-400 font-mono">LON</div>
                            <div className="font-mono text-green-400">{asset.telemetry.gps.lng.toFixed(4)}°</div>
                          </div>
                          <div>
                            <div className="text-gray-400 font-mono">ALT</div>
                            <div className="font-mono text-green-400">{asset.telemetry.altitude.toFixed(0)}m</div>
                          </div>
                        </div>

                        {/* Attitude */}
                        <div className="grid grid-cols-3 gap-3 text-xs">
                          <div>
                            <div className="text-gray-400 font-mono">YAW</div>
                            <div className="font-mono flex items-center space-x-1">
                              <Compass className="w-3 h-3" />
                              <span className="text-yellow-400">{asset.telemetry.yaw.toFixed(1)}°</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400 font-mono">PITCH</div>
                            <div className="font-mono text-yellow-400">{asset.telemetry.pitch.toFixed(1)}°</div>
                          </div>
                          <div>
                            <div className="text-gray-400 font-mono">ROLL</div>
                            <div className="font-mono text-yellow-400">{asset.telemetry.roll.toFixed(1)}°</div>
                          </div>
                        </div>

                        {/* Speed & Distance */}
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <div className="text-gray-400 font-mono">GND SPD</div>
                            <div className="font-mono flex items-center space-x-1">
                              <Gauge className="w-3 h-3" />
                              <span className="text-blue-400">{asset.telemetry.speed.ground.toFixed(1)} KMH</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400 font-mono">AIR SPD</div>
                            <div className="font-mono text-blue-400">{asset.telemetry.speed.air.toFixed(1)} KMH</div>
                          </div>
                          <div>
                            <div className="text-gray-400 font-mono">DIST HOME</div>
                            <div className="font-mono text-blue-400">{asset.telemetry.distance.home.toFixed(0)}m</div>
                          </div>
                          <div>
                            <div className="text-gray-400 font-mono">DIST WP</div>
                            <div className="font-mono text-blue-400">{asset.telemetry.distance.waypoint.toFixed(0)}m</div>
                          </div>
                        </div>

                        {/* Signal & GPS */}
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <div className="text-gray-400 font-mono">RSSI</div>
                            <div className="font-mono text-cyan-400">{asset.telemetry.signal.strength} dBm</div>
                          </div>
                          <div>
                            <div className="text-gray-400 font-mono">LINK QUAL</div>
                            <div className="font-mono text-cyan-400">{asset.telemetry.signal.quality}%</div>
                          </div>
                          <div>
                            <div className="text-gray-400 font-mono">GPS SATS</div>
                            <div className="font-mono text-cyan-400">{asset.telemetry.gps.satellites} SVs</div>
                          </div>
                          <div>
                            <div className="text-gray-400 font-mono">GPS ACC</div>
                            <div className="font-mono text-cyan-400">{asset.telemetry.gps.accuracy.toFixed(1)}m</div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors font-mono">
                        CONTROL
                      </button>
                      <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded text-sm transition-colors font-mono">
                        VIDEO
                      </button>
                      <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm transition-colors font-mono">
                        CMD
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Right Sidebar - Asset Status */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 p-4">
          <div className="text-lg font-semibold mb-4 font-mono">ASSET STATUS</div>
          
          <div className="space-y-3">
            {assets.map(asset => (
              <div
                key={asset.id}
                className={`bg-gray-700 rounded-lg p-3 cursor-pointer transition-all border ${
                  selectedAsset === asset.id ? 'ring-2 ring-green-400 bg-gray-600 border-green-400' : 'hover:bg-gray-650 border-transparent'
                }`}
                onClick={() => setSelectedAsset(selectedAsset === asset.id ? null : asset.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <MilitarySymbol 
                      type={asset.type}
                      affiliation={asset.affiliation}
                      status={asset.status}
                      size={20}
                    />
                    <div>
                      <div className="font-medium text-sm font-mono text-green-400">{asset.id}</div>
                      <div className="text-xs text-gray-400 font-mono">{asset.militaryDesignation}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getSignalStrengthIcon(asset.telemetry.signal.strength)}
                    <div className={`w-2 h-2 rounded-full ${
                      asset.status === 'active' ? 'bg-green-400' :
                      asset.status === 'standby' ? 'bg-yellow-400' : 'bg-red-400'
                    }`}></div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-300 space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span>MSN: {asset.mission.slice(0,12)}</span>
                    <span className={getTacticalTaskColor(asset.tacticalTask)}>
                      {asset.tacticalTask}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>PWR: {asset.battery}%</span>
                    <span>ALT: {asset.telemetry.altitude.toFixed(0)}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SPD: {asset.telemetry.speed.ground.toFixed(0)} KMH</span>
                    <span>QUAL: {asset.telemetry.signal.quality}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={getFlightModeColor(asset.telemetry.flightMode)}>
                      {asset.telemetry.flightMode}
                    </span>
                    <span className="text-blue-400">{asset.echelon.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-6 pt-4 border-t border-gray-600">
            <div className="text-sm font-medium mb-3 font-mono">FORCE STATUS</div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-gray-700 rounded p-2 text-center">
                <div className="text-green-400 font-bold text-lg font-mono">3</div>
                <div className="text-gray-300 font-mono">ACTIVE</div>
              </div>
              <div className="bg-gray-700 rounded p-2 text-center">
                <div className="text-yellow-400 font-bold text-lg font-mono">1</div>
                <div className="text-gray-300 font-mono">STANDBY</div>
              </div>
              <div className="bg-gray-700 rounded p-2 text-center">
                <div className="text-red-400 font-bold text-lg font-mono">1</div>
                <div className="text-gray-300 font-mono">MAINT</div>
              </div>
              <div className="bg-gray-700 rounded p-2 text-center">
                <div className="text-blue-400 font-bold text-lg font-mono">72%</div>
                <div className="text-gray-300 font-mono">AVG PWR</div>
              </div>
            </div>
          </div>

          {/* REDCON Status */}
          <div className="mt-4 bg-green-900/30 border border-green-700 rounded-lg p-3">
            <div className="text-sm font-medium font-mono text-green-400 mb-2">READINESS CONDITION</div>
            <div className="text-xl font-bold font-mono text-green-400">REDCON-1</div>
            <div className="text-xs text-green-300 font-mono">HIGHEST STATE OF READINESS</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegratedOperationsDashboard;
