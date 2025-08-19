import React, { useState, useEffect, useRef } from 'react';
import { 
  Map, MapPin, Navigation, Target, Route, Clock, Settings, Save, Upload, 
  Play, Pause, Square, RotateCcw, Plus, Minus, X, Check, AlertTriangle,
  Eye, Camera, Radio, Plane, Shield, Crosshair, Zap, Flag, Home,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Calculator,
  Compass, Gauge, Wind, Thermometer, CloudRain, Sun, Brain, Cpu,
  TrendingUp, BarChart3, Sparkles, RefreshCw, Zap as Lightning,
  Activity, Users, Globe, Radar, Satellite, Wifi, Signal, Tower,
  AlertCircle, Info, CheckCircle, XCircle, Rss, Database, Network,
  Monitor, Headphones, MessageSquare, Bell, Filter, Search, Layers,
  MapIcon, Crosshair as TargetIcon, Users as EnemyIcon, Truck
} from 'lucide-react';

const MissionPlanningSystem = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedAsset, setSelectedAsset] = useState('UAV-001');
  const [missionMode, setMissionMode] = useState('planning');
  const [waypoints, setWaypoints] = useState([]);
  const [currentWaypoint, setCurrentWaypoint] = useState(0);
  const [selectedTool, setSelectedTool] = useState('waypoint');
  const [aiOptimizing, setAiOptimizing] = useState(false);
  const [realTimeIntel, setRealTimeIntel] = useState({
    enabled: true,
    connectionStatus: 'connected', // connected, degraded, disconnected
    lastUpdate: new Date(),
    sources: {
      sigint: { status: 'active', confidence: 95, lastPing: new Date() },
      humint: { status: 'active', confidence: 78, lastPing: new Date() },
      geoint: { status: 'active', confidence: 92, lastPing: new Date() },
      elint: { status: 'degraded', confidence: 65, lastPing: new Date() },
      imint: { status: 'active', confidence: 88, lastPing: new Date() },
      osint: { status: 'active', confidence: 72, lastPing: new Date() }
    }
  });

  const [liveThreats, setLiveThreats] = useState([]);
  const [enemyUnits, setEnemyUnits] = useState([]);
  const [friendlyUnits, setFriendlyUnits] = useState([]);
  const [intelReports, setIntelReports] = useState([]);
  const [situationalAwareness, setSituationalAwareness] = useState({
    threatLevel: 'MODERATE',
    enemyActivity: 'NORMAL',
    weatherCondition: 'FAVORABLE',
    commsStatus: 'SECURE',
    airspace: 'CONTESTED'
  });

  const [autoReplan, setAutoReplan] = useState(true);
  const [intelFilters, setIntelFilters] = useState({
    threats: true,
    enemies: true,
    friendlies: true,
    neutral: true,
    confirmed: true,
    probable: true,
    possible: true
  });

  const mapRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (realTimeIntel.enabled) {
        updateRealTimeIntelligence();
        updateSituationalAwareness();
      }
    }, 2000); // 2초마다 인텔 업데이트

    return () => clearInterval(timer);
  }, [realTimeIntel.enabled]);

  // 실시간 인텔리전스 업데이트
  const updateRealTimeIntelligence = () => {
    // SIGINT (Signal Intelligence) - 적 통신 감청
    if (Math.random() < 0.3) {
      const newReport = {
        id: Date.now(),
        timestamp: new Date(),
        source: 'SIGINT',
        classification: 'SECRET',
        confidence: 85 + Math.random() * 15,
        priority: Math.random() > 0.7 ? 'HIGH' : Math.random() > 0.4 ? 'MEDIUM' : 'LOW',
        type: 'communication_intercept',
        title: '적 무선 통신 감청',
        content: `적 부대 이동 명령 감청 - Grid ${Math.floor(Math.random() * 9000) + 1000}`,
        location: { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 },
        actionRequired: Math.random() > 0.6
      };
      setIntelReports(prev => [newReport, ...prev.slice(0, 19)]);
    }

    // GEOINT (Geospatial Intelligence) - 위성 정보
    if (Math.random() < 0.2) {
      const newThreat = {
        id: Date.now(),
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        type: Math.random() > 0.5 ? 'mobile_sam' : 'armor_unit',
        confidence: 75 + Math.random() * 25,
        source: 'GEOINT',
        timestamp: new Date(),
        movement: Math.random() > 0.6,
        threat_level: Math.random() > 0.7 ? 'HIGH' : Math.random() > 0.4 ? 'MEDIUM' : 'LOW'
      };
      setLiveThreats(prev => [...prev.filter(t => t.id !== newThreat.id), newThreat].slice(0, 15));
    }

    // HUMINT (Human Intelligence) - 현지 정보원
    if (Math.random() < 0.15) {
      const newReport = {
        id: Date.now(),
        timestamp: new Date(),
        source: 'HUMINT',
        classification: 'CONFIDENTIAL',
        confidence: 60 + Math.random() * 30,
        priority: 'MEDIUM',
        type: 'human_intelligence',
        title: '현지 정보원 보고',
        content: `민간인 목격담 - 적 차량 ${Math.floor(Math.random() * 5) + 2}대 이동`,
        location: { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 },
        actionRequired: false
      };
      setIntelReports(prev => [newReport, ...prev.slice(0, 19)]);
    }

    // ELINT (Electronic Intelligence) - 전자 정보
    if (Math.random() < 0.25) {
      const newReport = {
        id: Date.now(),
        timestamp: new Date(),
        source: 'ELINT',
        classification: 'SECRET',
        confidence: 70 + Math.random() * 25,
        priority: 'HIGH',
        type: 'radar_detection',
        title: '적 레이더 활동 탐지',
        content: `새로운 대공 레이더 신호 탐지 - 주파수 ${(Math.random() * 5 + 8).toFixed(2)} GHz`,
        location: { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 },
        actionRequired: true
      };
      setIntelReports(prev => [newReport, ...prev.slice(0, 19)]);
    }

    // 적군 부대 동적 업데이트
    setEnemyUnits(prev => 
      prev.map(unit => ({
        ...unit,
        x: Math.max(5, Math.min(95, unit.x + (Math.random() - 0.5) * 3)),
        y: Math.max(5, Math.min(95, unit.y + (Math.random() - 0.5) * 3)),
        lastSeen: new Date()
      }))
    );

    // 아군 부대 업데이트
    setFriendlyUnits(prev => 
      prev.map(unit => ({
        ...unit,
        x: Math.max(5, Math.min(95, unit.x + (Math.random() - 0.5) * 2)),
        y: Math.max(5, Math.min(95, unit.y + (Math.random() - 0.5) * 2)),
        status: Math.random() > 0.95 ? 'engaged' : Math.random() > 0.9 ? 'moving' : 'operational'
      }))
    );

    // 인텔 소스 상태 업데이트
    setRealTimeIntel(prev => ({
      ...prev,
      lastUpdate: new Date(),
      sources: {
        ...prev.sources,
        sigint: { ...prev.sources.sigint, confidence: Math.max(70, prev.sources.sigint.confidence + (Math.random() - 0.5) * 10) },
        humint: { ...prev.sources.humint, confidence: Math.max(60, prev.sources.humint.confidence + (Math.random() - 0.5) * 15) },
        geoint: { ...prev.sources.geoint, confidence: Math.max(80, prev.sources.geoint.confidence + (Math.random() - 0.5) * 8) },
        elint: { 
          ...prev.sources.elint, 
          status: Math.random() > 0.9 ? 'degraded' : 'active',
          confidence: Math.max(50, prev.sources.elint.confidence + (Math.random() - 0.5) * 20) 
        },
        imint: { ...prev.sources.imint, confidence: Math.max(75, prev.sources.imint.confidence + (Math.random() - 0.5) * 12) },
        osint: { ...prev.sources.osint, confidence: Math.max(65, prev.sources.osint.confidence + (Math.random() - 0.5) * 18) }
      }
    }));
  };

  const updateSituationalAwareness = () => {
    const highThreats = liveThreats.filter(t => t.threat_level === 'HIGH').length;
    const mediumThreats = liveThreats.filter(t => t.threat_level === 'MEDIUM').length;
    
    let threatLevel = 'LOW';
    if (highThreats > 2) threatLevel = 'CRITICAL';
    else if (highThreats > 0 || mediumThreats > 3) threatLevel = 'HIGH';
    else if (mediumThreats > 1) threatLevel = 'MODERATE';

    const enemyActivity = enemyUnits.filter(u => u.status === 'moving').length > 2 ? 'HIGH' : 'NORMAL';
    
    setSituationalAwareness(prev => ({
      ...prev,
      threatLevel,
      enemyActivity,
      weatherCondition: Math.random() > 0.9 ? 'UNFAVORABLE' : 'FAVORABLE',
      commsStatus: realTimeIntel.sources.sigint.status === 'active' ? 'SECURE' : 'COMPROMISED',
      airspace: threatLevel === 'CRITICAL' ? 'DENIED' : threatLevel === 'HIGH' ? 'CONTESTED' : 'PERMISSIVE'
    }));
  };

  // 초기 전장 상황 설정
  useEffect(() => {
    // 초기 적군 부대
    setEnemyUnits([
      { id: 1, x: 30, y: 25, type: 'armor', size: 'company', status: 'operational', confidence: 85, lastSeen: new Date() },
      { id: 2, x: 70, y: 40, type: 'infantry', size: 'platoon', status: 'moving', confidence: 72, lastSeen: new Date() },
      { id: 3, x: 45, y: 70, type: 'artillery', size: 'battery', status: 'operational', confidence: 90, lastSeen: new Date() },
      { id: 4, x: 80, y: 20, type: 'air_defense', size: 'squad', status: 'operational', confidence: 95, lastSeen: new Date() }
    ]);

    // 초기 아군 부대
    setFriendlyUnits([
      { id: 1, x: 15, y: 80, type: 'armor', size: 'platoon', status: 'operational', callsign: 'STEEL-1' },
      { id: 2, x: 25, y: 60, type: 'infantry', size: 'company', status: 'operational', callsign: 'BRAVO-6' },
      { id: 3, x: 85, y: 85, type: 'artillery', size: 'battery', status: 'operational', callsign: 'THUNDER-7' }
    ]);

    // 초기 위협
    setLiveThreats([
      { id: 1, x: 40, y: 30, type: 'sam_site', confidence: 95, source: 'GEOINT', threat_level: 'HIGH', timestamp: new Date() },
      { id: 2, x: 65, y: 55, type: 'radar', confidence: 80, source: 'ELINT', threat_level: 'MEDIUM', timestamp: new Date() }
    ]);

    // 초기 인텔 보고서
    setIntelReports([
      {
        id: 1,
        timestamp: new Date(Date.now() - 300000),
        source: 'GEOINT',
        classification: 'SECRET',
        confidence: 92,
        priority: 'HIGH',
        type: 'enemy_movement',
        title: '적 기갑부대 이동 확인',
        content: '위성 영상 분석 결과 적 T-80 전차 12대가 북동쪽으로 이동 중',
        location: { x: 35, y: 30 },
        actionRequired: true
      }
    ]);
  }, []);

  // 자동 재계획 시스템
  useEffect(() => {
    if (autoReplan && waypoints.length > 0) {
      const pathThreats = checkPathThreats();
      if (pathThreats.high > 0 || pathThreats.critical > 0) {
        console.log('위협 탐지로 인한 자동 재계획 트리거');
        // AI 재최적화 실행
        if (!aiOptimizing) {
          runAutoReplan();
        }
      }
    }
  }, [liveThreats, enemyUnits, autoReplan]);

  const checkPathThreats = () => {
    let high = 0, medium = 0, critical = 0;
    
    waypoints.forEach(wp => {
      liveThreats.forEach(threat => {
        const distance = Math.sqrt((wp.x - threat.x)**2 + (wp.y - threat.y)**2);
        if (distance < 15) { // 위협 반경 내
          if (threat.threat_level === 'CRITICAL') critical++;
          else if (threat.threat_level === 'HIGH') high++;
          else if (threat.threat_level === 'MEDIUM') medium++;
        }
      });
    });
    
    return { critical, high, medium };
  };

  const runAutoReplan = async () => {
    setAiOptimizing(true);
    // 실시간 위협 정보를 AI에 반영하여 재계획
    setTimeout(() => {
      const optimizedWaypoints = waypoints.map(wp => {
        const nearbyThreats = liveThreats.filter(threat => {
          const distance = Math.sqrt((wp.x - threat.x)**2 + (wp.y - threat.y)**2);
          return distance < 20;
        });
        
        if (nearbyThreats.length > 0) {
          // 위협 회피를 위한 위치 조정
          let avoidX = 0, avoidY = 0;
          nearbyThreats.forEach(threat => {
            const strength = threat.threat_level === 'HIGH' ? 15 : threat.threat_level === 'MEDIUM' ? 10 : 5;
            avoidX += (wp.x - threat.x) * strength / 100;
            avoidY += (wp.y - threat.y) * strength / 100;
          });
          
          return {
            ...wp,
            x: Math.max(5, Math.min(95, wp.x + avoidX)),
            y: Math.max(5, Math.min(95, wp.y + avoidY)),
            coordinates: {
              lat: 37.2431 + ((wp.y + avoidY) - 50) * 0.001,
              lng: 127.0766 + ((wp.x + avoidX) - 50) * 0.001
            }
          };
        }
        return wp;
      });
      
      setWaypoints(optimizedWaypoints);
      
      // 재계획 알림 추가
      const replanReport = {
        id: Date.now(),
        timestamp: new Date(),
        source: 'AI_SYSTEM',
        classification: 'UNCLASSIFIED',
        confidence: 100,
        priority: 'MEDIUM',
        type: 'auto_replan',
        title: '자동 경로 재계획 완료',
        content: `새로운 위협 정보에 따라 경로가 자동으로 재계획되었습니다.`,
        actionRequired: false
      };
      setIntelReports(prev => [replanReport, ...prev.slice(0, 19)]);
      
      setAiOptimizing(false);
    }, 3000);
  };

  // 기존 함수들
  const addWaypoint = (x, y) => {
    const newWaypoint = {
      id: waypoints.length + 1,
      x: x,
      y: y,
      altitude: 1500,
      speed: 50,
      action: 'flyby',
      loiterTime: 0,
      coordinates: {
        lat: 37.2431 + (y - 50) * 0.001,
        lng: 127.0766 + (x - 50) * 0.001
      }
    };
    setWaypoints([...waypoints, newWaypoint]);
  };

  const getIntelSourceIcon = (source) => {
    switch(source) {
      case 'SIGINT': return <Radio className="w-4 h-4" />;
      case 'HUMINT': return <Users className="w-4 h-4" />;
      case 'GEOINT': return <Satellite className="w-4 h-4" />;
      case 'ELINT': return <Radar className="w-4 h-4" />;
      case 'IMINT': return <Camera className="w-4 h-4" />;
      case 'OSINT': return <Globe className="w-4 h-4" />;
      case 'AI_SYSTEM': return <Brain className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getIntelSourceColor = (source) => {
    switch(source) {
      case 'SIGINT': return 'text-blue-400';
      case 'HUMINT': return 'text-green-400';
      case 'GEOINT': return 'text-purple-400';
      case 'ELINT': return 'text-yellow-400';
      case 'IMINT': return 'text-cyan-400';
      case 'OSINT': return 'text-orange-400';
      case 'AI_SYSTEM': return 'text-pink-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'HIGH': return 'text-red-400 bg-red-900/30 border-red-500';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-900/30 border-yellow-500';
      case 'LOW': return 'text-green-400 bg-green-900/30 border-green-500';
      default: return 'text-gray-400 bg-gray-900/30 border-gray-500';
    }
  };

  const getThreatLevelColor = (level) => {
    switch(level) {
      case 'CRITICAL': return 'text-red-500';
      case 'HIGH': return 'text-red-400';
      case 'MODERATE': return 'text-yellow-400';
      case 'LOW': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getUnitIcon = (type) => {
    switch(type) {
      case 'armor': return '🛡️';
      case 'infantry': return '👥';
      case 'artillery': return '💥';
      case 'air_defense': return '🚀';
      case 'mobile_sam': return '🎯';
      case 'armor_unit': return '🔰';
      default: return '📍';
    }
  };

  // Military Symbol Component
  const MilitarySymbol = ({ type, affiliation = "friend", size = 32, label = "" }) => {
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

  return (
    <div className="h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Header */}
      <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Satellite className="w-6 h-6 text-cyan-400" />
            <span className="text-xl font-bold font-mono">LIVE INTEL PLANNER</span>
            <span className="text-xs text-cyan-400 font-mono">[REAL-TIME]</span>
          </div>
          <div className="h-6 w-px bg-gray-600"></div>
          <span className="text-sm text-gray-300 font-mono">
            OP GUARDIAN SHIELD // LIVE INTELLIGENCE v4.0
          </span>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Real-time Intel Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              realTimeIntel.connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' :
              realTimeIntel.connectionStatus === 'degraded' ? 'bg-yellow-400' : 'bg-red-400'
            }`}></div>
            <Rss className={`w-4 h-4 ${
              realTimeIntel.connectionStatus === 'connected' ? 'text-green-400' :
              realTimeIntel.connectionStatus === 'degraded' ? 'text-yellow-400' : 'text-red-400'
            }`} />
            <span className="text-sm font-mono">
              INTEL {realTimeIntel.connectionStatus.toUpperCase()}
            </span>
          </div>

          {/* Situational Awareness */}
          <div className="flex items-center space-x-2">
            <Shield className={`w-4 h-4 ${getThreatLevelColor(situationalAwareness.threatLevel)}`} />
            <span className={`text-sm font-mono ${getThreatLevelColor(situationalAwareness.threatLevel)}`}>
              THREAT: {situationalAwareness.threatLevel}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-mono">{currentTime.toISOString().slice(11,19)}Z</span>
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Left Panel - Real-time Intelligence */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 p-4 space-y-4 overflow-y-auto">
          
          {/* Intelligence Sources */}
          <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono flex items-center space-x-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>INTELLIGENCE SOURCES</span>
            </div>
            
            <div className="space-y-2">
              {Object.entries(realTimeIntel.sources).map(([source, data]) => (
                <div key={source} className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      data.status === 'active' ? 'bg-green-400' : 
                      data.status === 'degraded' ? 'bg-yellow-400' : 'bg-red-400'
                    }`}></div>
                    <span className={getIntelSourceColor(source.toUpperCase())}>
                      {source.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-300">{data.confidence.toFixed(0)}%</span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-cyan-500/30 text-xs font-mono">
              <div className="flex justify-between">
                <span>LAST UPDATE:</span>
                <span className="text-cyan-400">
                  {Math.floor((new Date() - realTimeIntel.lastUpdate) / 1000)}s ago
                </span>
              </div>
            </div>
          </div>

          {/* Situational Awareness Panel */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono">SITUATIONAL AWARENESS</div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span>THREAT LEVEL:</span>
                <span className={getThreatLevelColor(situationalAwareness.threatLevel)}>
                  {situationalAwareness.threatLevel}
                </span>
              </div>
              <div className="flex justify-between">
                <span>ENEMY ACTIVITY:</span>
                <span className={situationalAwareness.enemyActivity === 'HIGH' ? 'text-red-400' : 'text-green-400'}>
                  {situationalAwareness.enemyActivity}
                </span>
              </div>
              <div className="flex justify-between">
                <span>AIRSPACE:</span>
                <span className={
                  situationalAwareness.airspace === 'DENIED' ? 'text-red-400' :
                  situationalAwareness.airspace === 'CONTESTED' ? 'text-yellow-400' : 'text-green-400'
                }>
                  {situationalAwareness.airspace}
                </span>
              </div>
              <div className="flex justify-between">
                <span>COMMS:</span>
                <span className={situationalAwareness.commsStatus === 'SECURE' ? 'text-green-400' : 'text-red-400'}>
                  {situationalAwareness.commsStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Auto-Replan Settings */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono">AUTO-REPLAN</div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono">ENABLE AUTO-REPLAN:</span>
              <button
                onClick={() => setAutoReplan(!autoReplan)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  autoReplan ? 'bg-green-600' : 'bg-gray-600'
                } relative`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                  autoReplan ? 'translate-x-7' : 'translate-x-1'
                }`}></div>
              </button>
            </div>
            {autoReplan && (
              <div className="text-xs font-mono text-green-400">
                ✓ AI will automatically replan when new threats detected
              </div>
            )}
          </div>

          {/* Live Intelligence Reports */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono flex items-center justify-between">
              <span>LIVE INTEL REPORTS</span>
              <span className="text-xs text-gray-400">({intelReports.length})</span>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {intelReports.slice(0, 8).map(report => (
                <div
                  key={report.id}
                  className={`p-2 rounded border-l-4 text-xs ${getPriorityColor(report.priority)}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-1">
                      <div className={getIntelSourceColor(report.source)}>
                        {getIntelSourceIcon(report.source)}
                      </div>
                      <span className="font-mono text-white font-bold">{report.source}</span>
                    </div>
                    <span className="text-gray-400 font-mono">
                      {Math.floor((new Date() - report.timestamp) / 60000)}m
                    </span>
                  </div>
                  <div className="font-mono text-white font-semibold mb-1">{report.title}</div>
                  <div className="font-mono text-gray-300">{report.content}</div>
                  <div className="flex justify-between mt-1">
                    <span className="font-mono">CONF: {report.confidence.toFixed(0)}%</span>
                    {report.actionRequired && (
                      <span className="text-red-400 font-mono">ACTION REQ</span>
                    )}
                  </div>
                </div>
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
                  disabled={aiOptimizing}
                  className={`p-3 rounded text-xs font-mono transition-colors flex flex-col items-center space-y-1 ${
                    selectedTool === tool.id 
                      ? 'bg-blue-600 text-white' 
                      : aiOptimizing
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                >
                  <tool.icon className="w-4 h-4" />
                  <span>{tool.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Path Threat Analysis */}
          {waypoints.length > 0 && (
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm font-medium mb-3 font-mono">PATH THREAT ANALYSIS</div>
              {(() => {
                const threats = checkPathThreats();
                return (
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span>CRITICAL THREATS:</span>
                      <span className="text-red-500">{threats.critical}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>HIGH THREATS:</span>
                      <span className="text-red-400">{threats.high}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>MEDIUM THREATS:</span>
                      <span className="text-yellow-400">{threats.medium}</span>
                    </div>
                    {(threats.critical > 0 || threats.high > 0) && (
                      <div className="mt-2 p-2 bg-red-900/30 rounded text-red-400">
                        ⚠️ PATH COMPROMISE DETECTED
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Main Planning Area */}
        <div className="flex-1 relative">
          <div 
            ref={mapRef}
            className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 cursor-crosshair"
            onClick={(e) => {
              if (selectedTool === 'waypoint' && !aiOptimizing) {
                const rect = mapRef.current.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                addWaypoint(x, y);
              }
            }}
          >
            {/* Military Grid with Real-time Data */}
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="liveGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#00FFFF" strokeWidth="1"/>
                    <text x="2" y="12" fill="#00FFFF" fontSize="8" fontFamily="monospace">
                      LIVE
                    </text>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#liveGrid)" />
              </svg>
            </div>

            {/* Live Threats */}
            {liveThreats.map(threat => (
              <div
                key={`threat-${threat.id}`}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                style={{
                  left: `${threat.x}%`,
                  top: `${threat.y}%`
                }}
              >
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  threat.threat_level === 'HIGH' ? 'bg-red-500/30 border-red-400' :
                  threat.threat_level === 'MEDIUM' ? 'bg-yellow-500/30 border-yellow-400' :
                  'bg-orange-500/30 border-orange-400'
                } ${threat.movement ? 'animate-pulse' : ''}`}>
                  <TargetIcon className="w-4 h-4 text-white" />
                </div>
                
                {/* Threat detection radius */}
                <div 
                  className={`absolute rounded-full border opacity-30 ${
                    threat.threat_level === 'HIGH' ? 'border-red-400' :
                    threat.threat_level === 'MEDIUM' ? 'border-yellow-400' : 'border-orange-400'
                  }`}
                  style={{
                    width: '40px',
                    height: '40px',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                ></div>

                {/* Threat Info Popup */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800/90 rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  <div className="text-xs font-mono text-red-400">{threat.type.toUpperCase()}</div>
                  <div className="text-xs font-mono text-gray-300">
                    {threat.source} | {threat.confidence.toFixed(0)}% CONF
                  </div>
                  <div className="text-xs font-mono text-gray-300">
                    {Math.floor((new Date() - threat.timestamp) / 60000)}min ago
                  </div>
                </div>
              </div>
            ))}

            {/* Enemy Units */}
            {enemyUnits.map(unit => (
              <div
                key={`enemy-${unit.id}`}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                style={{
                  left: `${unit.x}%`,
                  top: `${unit.y}%`
                }}
              >
                <div className={`w-6 h-6 rounded-full bg-red-600/40 border-2 border-red-400 flex items-center justify-center text-xs ${
                  unit.status === 'moving' ? 'animate-pulse' : ''
                }`}>
                  {getUnitIcon(unit.type)}
                </div>
                
                {/* Enemy Unit Info */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800/90 rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  <div className="text-xs font-mono text-red-400">ENEMY {unit.type.toUpperCase()}</div>
                  <div className="text-xs font-mono text-gray-300">
                    SIZE: {unit.size.toUpperCase()} | {unit.confidence}% CONF
                  </div>
                  <div className="text-xs font-mono text-gray-300">
                    STATUS: {unit.status.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}

            {/* Friendly Units */}
            {friendlyUnits.map(unit => (
              <div
                key={`friendly-${unit.id}`}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                style={{
                  left: `${unit.x}%`,
                  top: `${unit.y}%`
                }}
              >
                <div className={`w-6 h-6 rounded-full bg-green-600/40 border-2 border-green-400 flex items-center justify-center text-xs ${
                  unit.status === 'moving' ? 'animate-pulse' : unit.status === 'engaged' ? 'animate-bounce' : ''
                }`}>
                  {getUnitIcon(unit.type)}
                </div>
                
                {/* Friendly Unit Info */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800/90 rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  <div className="text-xs font-mono text-green-400">FRIENDLY {unit.type.toUpperCase()}</div>
                  <div className="text-xs font-mono text-gray-300">
                    {unit.callsign} | {unit.size.toUpperCase()}
                  </div>
                  <div className="text-xs font-mono text-gray-300">
                    STATUS: {unit.status.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}

            {/* Operation Areas */}
            <div className="absolute top-20 left-20 w-64 h-48 border-2 border-green-500 bg-green-500/10 rounded-lg">
              <div className="absolute -top-6 left-2 text-xs font-bold text-green-400 font-mono">AO GUARDIAN</div>
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
                  stroke={aiOptimizing ? "#9333EA" : "#00BFFF"}
                  strokeWidth="3"
                  strokeDasharray={aiOptimizing ? "5,5" : "10,5"}
                  className={aiOptimizing ? "animate-pulse" : ""}
                />
              </svg>
            )}

            {/* Waypoints */}
            {waypoints.map((waypoint, index) => (
              <div
                key={waypoint.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{
                  left: `${waypoint.x}%`,
                  top: `${waypoint.y}%`
                }}
              >
                <div className={aiOptimizing ? "animate-pulse" : ""}>
                  <MilitarySymbol 
                    type="waypoint" 
                    size={24} 
                    label={`WP${waypoint.id}`}
                  />
                </div>
              </div>
            ))}

            {/* Real-time Status Overlay */}
            <div className="absolute top-4 left-4 bg-gray-800/90 rounded-lg p-3 border border-cyan-500">
              <div className="text-sm font-mono text-cyan-400 mb-2 flex items-center space-x-2">
                <Rss className="w-4 h-4" />
                <span>LIVE INTELLIGENCE</span>
              </div>
              <div className="text-xs font-mono space-y-1">
                <div>THREATS: {liveThreats.length} ACTIVE</div>
                <div>ENEMIES: {enemyUnits.length} TRACKED</div>
                <div>FRIENDLIES: {friendlyUnits.length} ONLINE</div>
                <div>REPORTS: {intelReports.length} NEW</div>
              </div>
            </div>

            {/* Auto-replan Status */}
            {aiOptimizing && (
              <div className="absolute inset-0 bg-purple-900/20 flex items-center justify-center">
                <div className="bg-gray-800/90 rounded-lg p-6 text-center border border-purple-500">
                  <RefreshCw className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-spin" />
                  <div className="text-lg font-mono text-purple-400 mb-2">AUTO-REPLANNING</div>
                  <div className="text-sm font-mono text-gray-300">
                    Adapting to new threat intelligence...
                  </div>
                </div>
              </div>
            )}

            {/* Current Tool Indicator */}
            <div className="absolute top-4 right-4 bg-gray-800/90 rounded-lg p-2">
              <div className="text-sm font-mono text-blue-400">
                MODE: {selectedTool.toUpperCase()}
              </div>
              {selectedTool === 'waypoint' && !aiOptimizing && (
                <div className="text-xs font-mono text-gray-300">
                  Click to add waypoint
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Enhanced Intelligence Dashboard */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 space-y-4 overflow-y-auto">
          <div className="text-lg font-semibold mb-4 font-mono">INTELLIGENCE DASHBOARD</div>
          
          {/* Active Threats Summary */}
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono text-red-400">ACTIVE THREATS</div>
            <div className="space-y-2">
              {liveThreats.slice(0, 5).map(threat => (
                <div key={threat.id} className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      threat.threat_level === 'HIGH' ? 'bg-red-400' :
                      threat.threat_level === 'MEDIUM' ? 'bg-yellow-400' : 'bg-orange-400'
                    }`}></div>
                    <span>{threat.type.toUpperCase()}</span>
                  </div>
                  <div className="text-right">
                    <div className={
                      threat.threat_level === 'HIGH' ? 'text-red-400' :
                      threat.threat_level === 'MEDIUM' ? 'text-yellow-400' : 'text-orange-400'
                    }>
                      {threat.threat_level}
                    </div>
                    <div className="text-gray-400">{threat.confidence.toFixed(0)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enemy Units Tracking */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono">ENEMY UNITS</div>
            <div className="space-y-2">
              {enemyUnits.map(unit => (
                <div key={unit.id} className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span>{getUnitIcon(unit.type)}</span>
                    <span>{unit.type.toUpperCase()}</span>
                  </div>
                  <div className="text-right">
                    <div className={unit.status === 'moving' ? 'text-yellow-400' : 'text-gray-400'}>
                      {unit.status.toUpperCase()}
                    </div>
                    <div className="text-gray-400">{unit.confidence}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Friendly Forces Status */}
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono text-green-400">FRIENDLY FORCES</div>
            <div className="space-y-2">
              {friendlyUnits.map(unit => (
                <div key={unit.id} className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span>{getUnitIcon(unit.type)}</span>
                    <span>{unit.callsign}</span>
                  </div>
                  <div className="text-right">
                    <div className={
                      unit.status === 'engaged' ? 'text-red-400' :
                      unit.status === 'moving' ? 'text-yellow-400' : 'text-green-400'
                    }>
                      {unit.status.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mission Statistics */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono">MISSION STATISTICS</div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span>WAYPOINTS:</span>
                <span className="text-blue-400">{waypoints.length}</span>
              </div>
              <div className="flex justify-between">
                <span>INTEL REPORTS:</span>
                <span className="text-cyan-400">{intelReports.length}</span>
              </div>
              <div className="flex justify-between">
                <span>ACTIVE THREATS:</span>
                <span className="text-red-400">{liveThreats.length}</span>
              </div>
              <div className="flex justify-between">
                <span>ENEMY CONTACTS:</span>
                <span className="text-yellow-400">{enemyUnits.length}</span>
              </div>
              <div className="flex justify-between">
                <span>AUTO-REPLAN:</span>
                <span className={autoReplan ? 'text-green-400' : 'text-gray-400'}>
                  {autoReplan ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>
            </div>
          </div>

          {/* Intel Source Performance */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono">SOURCE PERFORMANCE</div>
            <div className="space-y-2">
              {Object.entries(realTimeIntel.sources).map(([source, data]) => (
                <div key={source}>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className={getIntelSourceColor(source.toUpperCase())}>
                      {source.toUpperCase()}
                    </span>
                    <span>{data.confidence.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-1">
                    <div 
                      className={`h-1 rounded-full ${
                        data.confidence >= 80 ? 'bg-green-400' :
                        data.confidence >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${data.confidence}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionPlanningSystem;
