'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Gamepad2, Camera, Battery, Crosshair, ZoomIn, ZoomOut,
  Pause, Square,
  Navigation, Thermometer,
  Home, Clock, Wifi, WifiOff,
  ChevronUp, ChevronDown, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Circle,
  Monitor, Grid3X3,
  Sun, Moon, Focus, Lock, Unlock,
  Target, Activity, Eye,
} from 'lucide-react';

type NotificationType = 'error' | 'warning' | 'success' | 'info';
type ControlMode = 'AUTO' | 'MANUAL' | 'ASSIST';

interface Telemetry {
  lat: number;
  lng: number;
  altitude: number;
  speed: number;
  heading: number;
  yaw: number;
  pitch: number;
  roll: number;
  battery: number;
  flightTime: string;
  distanceHome: number;
  satellites: number;
}

interface Mission {
  id: string;
  status: string;
  progress: number;
  currentWaypoint: number;
  totalWaypoints: number;
  eta: string;
}

interface Payload {
  camera: { active: boolean; zoom: number; mode: string; };
  sensors: { radar: boolean; lidar: boolean; thermal: boolean; };
}

interface Drone {
  telemetry: Telemetry;
  mission: Mission;
  payload: Payload;
}

interface DroneData {
  [key: string]: Drone;
}

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  timestamp: Date;
}

interface VideoFeed {
  active: boolean;
  quality: string;
  zoom: number;
  brightness: number;
  contrast: number;
  thermal: boolean;
  recording: boolean;
  crosshair: boolean;
  grid: boolean;
}

const OperatorView = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDrone, setSelectedDrone] = useState('UAV-001');
  const [controlMode, setControlMode] = useState<ControlMode>('AUTO'); // AUTO, MANUAL, ASSIST
  const [videoFeed, setVideoFeed] = useState<VideoFeed>({
    active: true,
    quality: 'HD',
    zoom: 1.0,
    brightness: 50,
    contrast: 50,
    thermal: false,
    recording: false,
    crosshair: true,
    grid: false
  });
  const [flightControls, setFlightControls] = useState({
    throttle: 50,
    yaw: 0,
    pitch: 0,
    roll: 0,
    altitude: 1500,
    speed: 45,
    heading: 270
  });
  const [systemStatus, setSystemStatus] = useState({
    armed: false,
    gps: true,
    compass: true,
    battery: 87,
    signal: -72,
    temperature: 68,
    motors: [98, 97, 99, 96]
  });
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 조작 가능한 드론 목록
  const availableDrones = [
    { id: 'UAV-001', name: 'Ghost Recon', type: 'reconnaissance', status: 'ACTIVE', assigned: true },
    { id: 'UAV-002', name: 'Thunder Strike', type: 'attack', status: 'STANDBY', assigned: false },
    { id: 'UAV-003', name: 'Eagle Eye', type: 'surveillance', status: 'ACTIVE', assigned: false },
    { id: 'UAV-005', name: 'Shadow Walker', type: 'reconnaissance', status: 'ACTIVE', assigned: false }
  ];

  const [droneData, setDroneData] = useState<DroneData>({
    'UAV-001': {
      telemetry: {
        lat: 37.2431,
        lng: 127.0766,
        altitude: 1245,
        speed: 45.2,
        heading: 270,
        yaw: 268.5,
        pitch: -2.1,
        roll: 1.3,
        battery: 87,
        flightTime: '00:42:15',
        distanceHome: 2847,
        satellites: 12
      },
      mission: {
        id: 'PATROL-ALPHA-001',
        status: 'ACTIVE',
        progress: 65,
        currentWaypoint: 3,
        totalWaypoints: 6,
        eta: '14:30'
      },
      payload: {
        camera: { active: true, zoom: 1.0, mode: 'EO' },
        sensors: { radar: false, lidar: true, thermal: false }
      }
    }
  });

  const updateTelemetry = useCallback(() => {
    if (controlMode === 'MANUAL') {
      // 수동 조작 중일 때 조작값 반영
      setDroneData(prev => ({
        ...prev,
        [selectedDrone]: {
          ...prev[selectedDrone],
          telemetry: {
            ...prev[selectedDrone].telemetry,
            altitude: flightControls.altitude,
            speed: flightControls.speed,
            heading: flightControls.heading,
            yaw: flightControls.heading + (Math.random() - 0.5) * 2,
            pitch: flightControls.pitch + (Math.random() - 0.5) * 1,
            roll: flightControls.roll + (Math.random() - 0.5) * 1
          }
        }
      }));
    } else {
      // 자동 모드에서는 시뮬레이션 업데이트
      setDroneData(prev => ({
        ...prev,
        [selectedDrone]: {
          ...prev[selectedDrone],
          telemetry: {
            ...prev[selectedDrone].telemetry,
            yaw: (prev[selectedDrone].telemetry.yaw + (Math.random() - 0.5) * 2) % 360,
            speed: Math.max(20, prev[selectedDrone].telemetry.speed + (Math.random() - 0.5) * 3),
            altitude: Math.max(100, prev[selectedDrone].telemetry.altitude + (Math.random() - 0.5) * 10)
          }
        }
      }));
    }

    // 시스템 상태 업데이트
    setSystemStatus(prev => ({
      ...prev,
      battery: Math.max(20, prev.battery - Math.random() * 0.1),
      signal: Math.max(-90, Math.min(-50, prev.signal + (Math.random() - 0.5) * 5)),
      temperature: Math.max(40, Math.min(80, prev.temperature + (Math.random() - 0.5) * 2))
    }));
  }, [controlMode, flightControls, selectedDrone]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateTelemetry();
    }, 1000);

    return () => clearInterval(timer);
  }, [updateTelemetry]);

  // 비행 제어 함수들
  const handleArmDisarm = () => {
    setSystemStatus(prev => ({ ...prev, armed: !prev.armed }));
    addNotification(systemStatus.armed ? 'DISARMED' : 'ARMED', 'info');
  };

  const handleTakeoff = () => {
    if (systemStatus.armed) {
      setFlightControls(prev => ({ ...prev, altitude: 100 }));
      addNotification('TAKEOFF INITIATED', 'success');
    }
  };

  const handleLand = () => {
    setFlightControls(prev => ({ ...prev, altitude: 0, throttle: 0 }));
    addNotification('LANDING INITIATED', 'info');
  };

  const handleEmergencyStop = () => {
    setEmergencyMode(true);
    setFlightControls(prev => ({ ...prev, throttle: 0 }));
    addNotification('EMERGENCY STOP ACTIVATED', 'error');
    setTimeout(() => setEmergencyMode(false), 5000);
  };

  const handleReturnToBase = () => {
    setControlMode('AUTO');
    addNotification('RETURN TO BASE INITIATED', 'info');
  };

  const switchControlMode = (mode: ControlMode) => {
    setControlMode(mode);
    addNotification(`CONTROL MODE: ${mode}`, 'info');
  };

  // 영상 제어 함수들
  const handleVideoControl = (action: string, value?: number) => {
    setVideoFeed(prev => {
      switch(action) {
        case 'zoom_in':
          return { ...prev, zoom: Math.min(prev.zoom + 0.5, 10) };
        case 'zoom_out':
          return { ...prev, zoom: Math.max(prev.zoom - 0.5, 1) };
        case 'brightness':
          if (value !== undefined) {
            return { ...prev, brightness: value };
          }
          return prev;
        case 'contrast':
          if (value !== undefined) {
            return { ...prev, contrast: value };
          }
          return prev;
        case 'thermal':
          return { ...prev, thermal: !prev.thermal };
        case 'recording':
          return { ...prev, recording: !prev.recording };
        case 'crosshair':
          return { ...prev, crosshair: !prev.crosshair };
        case 'grid':
          return { ...prev, grid: !prev.grid };
        default:
          return prev;
      }
    });
  };

  const addNotification = (message: string, type: NotificationType) => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [notification, ...prev.slice(0, 4)]);
  };

  const getSignalIcon = (strength: number) => {
    if (strength > -60) return <Wifi className="w-4 h-4 text-green-400" />;
    if (strength > -80) return <Wifi className="w-4 h-4 text-yellow-400" />;
    return <WifiOff className="w-4 h-4 text-red-400" />;
  };

  const getNotificationColor = (type: NotificationType) => {
    switch(type) {
      case 'error': return 'border-red-500 bg-red-900/30 text-red-300';
      case 'warning': return 'border-yellow-500 bg-yellow-900/30 text-yellow-300';
      case 'success': return 'border-green-500 bg-green-900/30 text-green-300';
      default: return 'border-blue-500 bg-blue-900/30 text-blue-300';
    }
  };

  const getCurrentDroneData = () => droneData[selectedDrone];

  return (
    <div className="h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Top Control Bar */}
      <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Gamepad2 className="w-6 h-6 text-green-400" />
            <span className="text-xl font-bold font-mono">OPERATOR STATION</span>
            <span className="text-xs text-green-400 font-mono">[PILOT]</span>
          </div>
          
          <div className="h-6 w-px bg-gray-600"></div>
          
          {/* Drone Selection */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-mono text-gray-300">ACTIVE DRONE:</span>
            <select 
              value={selectedDrone}
              onChange={(e) => setSelectedDrone(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm font-mono text-green-400"
            >
              {availableDrones.map(drone => (
                <option key={drone.id} value={drone.id}>
                  {drone.id} - {drone.name}
                </option>
              ))}
            </select>
          </div>

          {/* Control Mode */}
          <div className="flex items-center space-x-1">
            {(['AUTO', 'ASSIST', 'MANUAL'] as ControlMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => switchControlMode(mode)}
                className={`px-3 py-1 rounded text-sm font-mono transition-colors ${
                  controlMode === mode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Emergency Button */}
          <button
            onClick={handleEmergencyStop}
            className={`px-4 py-2 rounded font-mono text-sm font-bold transition-colors ${
              emergencyMode 
                ? 'bg-red-600 text-white animate-pulse' 
                : 'bg-red-700 hover:bg-red-600 text-white'
            }`}
          >
            EMERGENCY STOP
          </button>

          {/* Armed Status */}
          <div className={`flex items-center space-x-2 px-3 py-1 rounded ${
            systemStatus.armed ? 'bg-red-600 text-white' : 'bg-gray-600 text-gray-300'
          }`}>
            {systemStatus.armed ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            <span className="text-sm font-mono">{systemStatus.armed ? 'ARMED' : 'DISARMED'}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-mono">{currentTime.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Left Panel - Flight Controls */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 p-4 space-y-4 overflow-y-auto">
          
          {/* Primary Flight Controls */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-4 font-mono text-green-400">PRIMARY CONTROLS</div>
            
            {/* Arm/Disarm */}
            <div className="mb-4">
              <button
                onClick={handleArmDisarm}
                className={`w-full py-3 rounded font-mono font-bold transition-colors ${
                  systemStatus.armed 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {systemStatus.armed ? (
                  <>
                    <Unlock className="w-4 h-4 inline mr-2" />
                    DISARM
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 inline mr-2" />
                    ARM
                  </>
                )}
              </button>
            </div>

            {/* Flight Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={handleTakeoff}
                disabled={!systemStatus.armed}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-3 rounded font-mono text-sm transition-colors"
              >
                <ArrowUp className="w-4 h-4 inline mr-1" />
                TAKEOFF
              </button>
              <button
                onClick={handleLand}
                className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-3 rounded font-mono text-sm transition-colors"
              >
                <ArrowDown className="w-4 h-4 inline mr-1" />
                LAND
              </button>
              <button
                onClick={handleReturnToBase}
                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded font-mono text-sm transition-colors"
              >
                <Home className="w-4 h-4 inline mr-1" />
                RTB
              </button>
              <button
                className="bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-3 rounded font-mono text-sm transition-colors"
              >
                <Pause className="w-4 h-4 inline mr-1" />
                HOVER
              </button>
            </div>
          </div>

          {/* Manual Flight Controls */}
          {controlMode === 'MANUAL' && (
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm font-medium mb-4 font-mono text-yellow-400">MANUAL CONTROLS</div>
              
              {/* Throttle Control */}
              <div className="mb-4">
                <label className="text-xs font-mono text-gray-300 block mb-2">THROTTLE</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={flightControls.throttle}
                    onChange={(e) => setFlightControls(prev => ({ ...prev, throttle: parseInt(e.target.value) }))}
                    className="flex-1"
                  />
                  <span className="text-sm font-mono w-12 text-right">{flightControls.throttle}%</span>
                </div>
              </div>

              {/* Altitude Control */}
              <div className="mb-4">
                <label className="text-xs font-mono text-gray-300 block mb-2">ALTITUDE (m)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="3000"
                    value={flightControls.altitude}
                    onChange={(e) => setFlightControls(prev => ({ ...prev, altitude: parseInt(e.target.value) }))}
                    className="flex-1 bg-gray-600 border border-gray-500 rounded px-2 py-1 text-sm font-mono"
                  />
                  <div className="flex flex-col space-y-1">
                    <button 
                      onClick={() => setFlightControls(prev => ({ ...prev, altitude: prev.altitude + 50 }))}
                      className="bg-gray-600 hover:bg-gray-500 p-1 rounded"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => setFlightControls(prev => ({ ...prev, altitude: Math.max(0, prev.altitude - 50) }))}
                      className="bg-gray-600 hover:bg-gray-500 p-1 rounded"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Speed Control */}
              <div className="mb-4">
                <label className="text-xs font-mono text-gray-300 block mb-2">SPEED (km/h)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="120"
                    value={flightControls.speed}
                    onChange={(e) => setFlightControls(prev => ({ ...prev, speed: parseInt(e.target.value) }))}
                    className="flex-1"
                  />
                  <span className="text-sm font-mono w-12 text-right">{flightControls.speed}</span>
                </div>
              </div>

              {/* Heading Control */}
              <div className="mb-4">
                <label className="text-xs font-mono text-gray-300 block mb-2">HEADING (°)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="359"
                    value={flightControls.heading}
                    onChange={(e) => setFlightControls(prev => ({ ...prev, heading: parseInt(e.target.value) }))}
                    className="flex-1"
                  />
                  <span className="text-sm font-mono w-12 text-right">{flightControls.heading}°</span>
                </div>
              </div>

              {/* Direction Pad */}
              <div className="grid grid-cols-3 gap-1 w-24 mx-auto">
                <div></div>
                <button className="bg-gray-600 hover:bg-gray-500 p-2 rounded">
                  <ArrowUp className="w-4 h-4" />
                </button>
                <div></div>
                <button className="bg-gray-600 hover:bg-gray-500 p-2 rounded">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button className="bg-gray-600 hover:bg-gray-500 p-2 rounded">
                  <Circle className="w-4 h-4" />
                </button>
                <button className="bg-gray-600 hover:bg-gray-500 p-2 rounded">
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div></div>
                <button className="bg-gray-600 hover:bg-gray-500 p-2 rounded">
                  <ArrowDown className="w-4 h-4" />
                </button>
                <div></div>
              </div>
            </div>
          )}

          {/* System Status */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-4 font-mono text-cyan-400">SYSTEM STATUS</div>
            
            <div className="space-y-3">
              {/* Battery */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Battery className="w-4 h-4" />
                  <span className="text-xs font-mono">BATTERY</span>
                </div>
                <span className={`text-sm font-mono ${
                  systemStatus.battery > 70 ? 'text-green-400' :
                  systemStatus.battery > 30 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {systemStatus.battery.toFixed(1)}%
                </span>
              </div>

              {/* Signal Strength */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getSignalIcon(systemStatus.signal)}
                  <span className="text-xs font-mono">SIGNAL</span>
                </div>
                <span className="text-sm font-mono text-cyan-400">
                  {systemStatus.signal.toFixed(0)} dBm
                </span>
              </div>

              {/* Temperature */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-4 h-4" />
                  <span className="text-xs font-mono">TEMP</span>
                </div>
                <span className={`text-sm font-mono ${
                  systemStatus.temperature > 75 ? 'text-red-400' : 'text-green-400'
                }`}>
                  {systemStatus.temperature.toFixed(1)}°C
                </span>
              </div>

              {/* GPS Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Navigation className="w-4 h-4" />
                  <span className="text-xs font-mono">GPS</span>
                </div>
                <span className={`text-sm font-mono ${systemStatus.gps ? 'text-green-400' : 'text-red-400'}`}>
                  {systemStatus.gps ? 'LOCKED' : 'SEARCHING'}
                </span>
              </div>

              {/* Motor Status */}
              <div>
                <div className="text-xs font-mono text-gray-300 mb-2">MOTORS</div>
                <div className="grid grid-cols-2 gap-2">
                  {systemStatus.motors.map((motor, index) => (
                    <div key={index} className="bg-gray-600 rounded p-2 text-center">
                      <div className="text-xs font-mono text-gray-400">M{index + 1}</div>
                      <div className={`text-sm font-mono ${motor > 95 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {motor}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono text-yellow-400">NOTIFICATIONS</div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {notifications.map(notification => (
                <div key={notification.id} className={`p-2 rounded border-l-4 text-xs ${getNotificationColor(notification.type)}`}>
                  <div className="font-mono text-white">{notification.message}</div>
                  <div className="text-gray-400 font-mono">
                    {notification.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Video Feed */}
        <div className="flex-1 relative bg-black">
          {/* Video Feed Display */}
          <div className="absolute inset-0">
            {videoFeed.active ? (
              <div className="relative h-full bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900">
                {/* Video Overlays */}
                {videoFeed.grid && (
                  <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
                    <defs>
                      <pattern id="videoGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00FF00" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#videoGrid)" />
                  </svg>
                )}

                {videoFeed.crosshair && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Crosshair className="w-12 h-12 text-green-400 opacity-70" />
                  </div>
                )}

                {/* Targeting Reticle */}
                <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-16 h-16 border-2 border-red-400 rounded-full opacity-80">
                    <div className="absolute inset-0 border border-red-400 rounded-full m-2"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-red-400 rounded-full"></div>
                  </div>
                </div>

                {/* Video HUD */}
                <div className="absolute top-4 left-4 space-y-2 pointer-events-none">
                  <div className="bg-black/70 px-3 py-2 rounded font-mono text-green-400">
                    {videoFeed.thermal ? 'THERMAL' : 'EO'} | ZOOM: {videoFeed.zoom.toFixed(1)}x
                  </div>
                  <div className="bg-black/70 px-3 py-2 rounded font-mono text-green-400">
                    ALT: {getCurrentDroneData()?.telemetry.altitude.toFixed(0)}m
                  </div>
                  <div className="bg-black/70 px-3 py-2 rounded font-mono text-green-400">
                    SPD: {getCurrentDroneData()?.telemetry.speed.toFixed(1)} km/h
                  </div>
                </div>

                {/* Recording Indicator */}
                {videoFeed.recording && (
                  <div className="absolute top-4 right-4 flex items-center space-x-2 pointer-events-none">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-400 font-mono font-bold">REC</span>
                  </div>
                )}

                {/* Coordinates */}
                <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-2 rounded font-mono text-green-400 pointer-events-none">
                  {getCurrentDroneData()?.telemetry.lat.toFixed(6)}, {getCurrentDroneData()?.telemetry.lng.toFixed(6)}
                </div>

                {/* Timestamp */}
                <div className="absolute bottom-4 right-4 bg-black/70 px-3 py-2 rounded font-mono text-green-400 pointer-events-none">
                  {currentTime.toISOString().slice(11,19)}Z
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Monitor className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                  <div className="text-xl font-mono text-gray-400">NO VIDEO SIGNAL</div>
                </div>
              </div>
            )}
          </div>

          {/* Video Controls Overlay */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-800/90 rounded-lg p-2 flex items-center space-x-2">
            <button 
              onClick={() => handleVideoControl('zoom_out')}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm font-mono px-2">{videoFeed.zoom.toFixed(1)}x</span>
            <button 
              onClick={() => handleVideoControl('zoom_in')}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-gray-600"></div>
            <button 
              onClick={() => handleVideoControl('thermal')}
              className={`p-2 rounded ${videoFeed.thermal ? 'bg-orange-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {videoFeed.thermal ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => handleVideoControl('recording')}
              className={`p-2 rounded ${videoFeed.recording ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              <Square className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleVideoControl('crosshair')}
              className={`p-2 rounded ${videoFeed.crosshair ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              <Crosshair className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleVideoControl('grid')}
              className={`p-2 rounded ${videoFeed.grid ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Panel - Telemetry & Mission */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 space-y-4 overflow-y-auto">
          
          {/* Current Drone Info */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono text-blue-400">{selectedDrone} STATUS</div>
            
            {getCurrentDroneData() && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <div className="text-gray-400">MISSION</div>
                    <div className="text-white">{getCurrentDroneData().mission.id}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">STATUS</div>
                    <div className="text-green-400">{getCurrentDroneData().mission.status}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">PROGRESS</div>
                    <div className="text-blue-400">{getCurrentDroneData().mission.progress}%</div>
                  </div>
                  <div>
                    <div className="text-gray-400">ETA</div>
                    <div className="text-yellow-400">{getCurrentDroneData().mission.eta}</div>
                  </div>
                </div>

                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-blue-400 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${getCurrentDroneData().mission.progress}%` }}
                  ></div>
                </div>

                <div className="text-xs font-mono text-gray-300">
                  Waypoint {getCurrentDroneData().mission.currentWaypoint} of {getCurrentDroneData().mission.totalWaypoints}
                </div>
              </div>
            )}
          </div>

          {/* Detailed Telemetry */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono text-purple-400">TELEMETRY</div>
            
            {getCurrentDroneData() && (
              <div className="space-y-3">
                {/* Position */}
                <div>
                  <div className="text-xs font-mono text-gray-400 mb-1">POSITION</div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <div className="text-gray-400">LAT</div>
                      <div className="text-green-400">{getCurrentDroneData().telemetry.lat.toFixed(6)}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">LNG</div>
                      <div className="text-green-400">{getCurrentDroneData().telemetry.lng.toFixed(6)}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">ALT</div>
                      <div className="text-green-400">{getCurrentDroneData().telemetry.altitude.toFixed(0)}m</div>
                    </div>
                    <div>
                      <div className="text-gray-400">HOME</div>
                      <div className="text-green-400">{getCurrentDroneData().telemetry.distanceHome.toFixed(0)}m</div>
                    </div>
                  </div>
                </div>

                {/* Attitude */}
                <div>
                  <div className="text-xs font-mono text-gray-400 mb-1">ATTITUDE</div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <div>
                      <div className="text-gray-400">YAW</div>
                      <div className="text-yellow-400">{getCurrentDroneData().telemetry.yaw.toFixed(1)}°</div>
                    </div>
                    <div>
                      <div className="text-gray-400">PITCH</div>
                      <div className="text-yellow-400">{getCurrentDroneData().telemetry.pitch.toFixed(1)}°</div>
                    </div>
                    <div>
                      <div className="text-gray-400">ROLL</div>
                      <div className="text-yellow-400">{getCurrentDroneData().telemetry.roll.toFixed(1)}°</div>
                    </div>
                  </div>
                </div>

                {/* Flight Data */}
                <div>
                  <div className="text-xs font-mono text-gray-400 mb-1">FLIGHT DATA</div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <div className="text-gray-400">SPEED</div>
                      <div className="text-blue-400">{getCurrentDroneData().telemetry.speed.toFixed(1)} km/h</div>
                    </div>
                    <div>
                      <div className="text-gray-400">HEADING</div>
                      <div className="text-blue-400">{getCurrentDroneData().telemetry.heading.toFixed(0)}°</div>
                    </div>
                    <div>
                      <div className="text-gray-400">FLIGHT TIME</div>
                      <div className="text-blue-400">{getCurrentDroneData().telemetry.flightTime}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">GPS SATS</div>
                      <div className="text-blue-400">{getCurrentDroneData().telemetry.satellites}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payload Control */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono text-cyan-400">PAYLOAD CONTROL</div>
            
            <div className="space-y-3">
              {/* Camera Control */}
              <div>
                <div className="text-xs font-mono text-gray-400 mb-2">CAMERA</div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded text-xs font-mono">
                    <Camera className="w-3 h-3 inline mr-1" />
                    SNAPSHOT
                  </button>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white py-1 px-2 rounded text-xs font-mono">
                    <Focus className="w-3 h-3 inline mr-1" />
                    AUTOFOCUS
                  </button>
                </div>
              </div>

              {/* Sensor Control */}
              <div>
                <div className="text-xs font-mono text-gray-400 mb-2">SENSORS</div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span>RADAR</span>
                    <button className="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded">
                      OFF
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span>LIDAR</span>
                    <button className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded">
                      ON
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span>THERMAL</span>
                    <button className={`px-2 py-1 rounded ${
                      videoFeed.thermal ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-600 hover:bg-gray-500'
                    }`}>
                      {videoFeed.thermal ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono text-green-400">QUICK ACTIONS</div>
            
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-3 rounded font-mono text-xs">
                <Navigation className="w-3 h-3 inline mr-1" />
                GOTO WP
              </button>
              <button className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-3 rounded font-mono text-xs">
                <Target className="w-3 h-3 inline mr-1" />
                TARGET
              </button>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded font-mono text-xs">
                <Activity className="w-3 h-3 inline mr-1" />
                ORBIT
              </button>
              <button className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-3 rounded font-mono text-xs">
                <Eye className="w-3 h-3 inline mr-1" />
                TRACK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorView;
