"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Camera, Shield, Clock, Bell, X, Square, ZoomIn, ZoomOut, Volume2, VolumeX, Monitor, Grid3X3, Crosshair, Sun, Moon } from 'lucide-react';

const IntegratedOperationsDashboard = () => {
  interface Notification {
    id: number;
    type: string;
    message: string;
    priority: string;
    timestamp: Date;
  }

  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  interface FeedData {
    timestamp: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    targeting: {
      crosshairX: number;
      crosshairY: number;
      zoom: number;
      locked: boolean;
    };
    quality: number;
    bitrate: number;
  }

  const [videoFeeds, setVideoFeeds] = useState<{[key: string]: FeedData}>({});
  const [activeVideoFeed, setActiveVideoFeed] = useState<string | null>(null);
  const [videoControls, setVideoControls] = useState({
    zoom: 1,
    brightness: 50,
    contrast: 50,
    isRecording: false,
    isFullscreen: false,
    showCrosshair: true,
    showGrid: false,
    thermalMode: false,
    volume: 80,
    isMuted: false
  });

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
      hasCamera: true,
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
      hasCamera: true,
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
      hasCamera: true,
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
      hasCamera: false,
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
      hasCamera: true,
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

  const generateVideoFrame = useCallback((): FeedData => {
    const timestamp = new Date().toISOString();
    const frameData = {
      timestamp,
      coordinates: {
        lat: 37.2431 + (Math.random() - 0.5) * 0.001,
        lng: 127.0766 + (Math.random() - 0.5) * 0.001
      },
      targeting: {
        crosshairX: 50 + (Math.random() - 0.5) * 20,
        crosshairY: 50 + (Math.random() - 0.5) * 20,
        zoom: videoControls.zoom,
        locked: Math.random() > 0.8
      },
      quality: 85 + Math.random() * 15,
      bitrate: 2048 + Math.random() * 512
    };
    return frameData;
  }, [videoControls.zoom]);

  const updateVideoFeeds = useCallback(() => {
    setVideoFeeds(prev => {
      const newFeeds = { ...prev };
      assets.forEach(asset => {
        if (asset.status === 'active' && (asset.type === 'uav-surveillance' || asset.type === 'uav-reconnaissance' || asset.type === 'uav-attack')) {
          newFeeds[asset.id] = generateVideoFrame();
        }
      });
      return newFeeds;
    });
  }, [assets, generateVideoFrame]);

  const updateTelemetryData = useCallback(() => {
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
  }, []);

  const generateRandomNotification = useCallback(() => {
    const notificationTypes = [
      { type: 'warning', message: '▲ UAV-003 배터리 임계치 접근', priority: 'medium' },
      { type: 'info', message: '📹 UAV-001 영상 품질 개선됨', priority: 'low' },
      { type: 'error', message: '✗ UAV-004 영상 피드 손실', priority: 'high' },
      { type: 'success', message: '✓ UAV-002 타겟 락온 완료', priority: 'low' },
      { type: 'warning', message: '⚠ UAV-005 열화상 모드 전환', priority: 'medium' }
    ];

    const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    const newNotification: Notification = {
      id: Date.now(),
      ...randomNotification,
      timestamp: new Date()
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateTelemetryData();
      updateVideoFeeds();
      if (Math.random() < 0.08) {
        generateRandomNotification();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [updateTelemetryData, updateVideoFeeds, generateRandomNotification]);

  // Military Symbol Components
  interface MilitarySymbolProps {
    type: string;
    affiliation?: string;
    status?: string;
    size?: number;
    echelon?: string | null;
    uniqueDesignation?: string;
    additionalInfo?: string;
  }

  const MilitarySymbol: React.FC<MilitarySymbolProps> = ({ type, affiliation = "friend", status = "present", size = 32, echelon = null, uniqueDesignation = "", additionalInfo = "" }) => {
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
          <path
            d={getSymbolPath()}
            fill="none"
            stroke={getAffiliationColor()}
            strokeWidth="2"
            {...(status !== 'present' ? { [getStatusIndicator().split('=')[0]]: getStatusIndicator().split('=')[1] } : {})}
          />
          {status === 'present' && (
            <path
              d={getSymbolPath()}
              fill={getAffiliationColor()}
              fillOpacity="0.2"
            />
          )}
        </svg>
        
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

  // Video Feed Component
  interface VideoFeedDisplayProps {
    assetId: string;
    feedData: FeedData;
    isActive: boolean;
    onSelect: (assetId: string) => void;
  }

  const VideoFeedDisplay: React.FC<VideoFeedDisplayProps> = ({ assetId, feedData, isActive, onSelect }) => {
    const asset = assets.find(a => a.id === assetId);
    if (!asset || !feedData) return null;

    return (
      <div 
        className={'relative bg-black rounded-lg overflow-hidden cursor-pointer transition-all ' + (isActive ? 'ring-2 ring-green-400' : 'hover:ring-1 hover:ring-gray-400')}
        onClick={() => onSelect(assetId)}
      >
        {/* Simulated Video Feed */}
        <div className="aspect-video bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 relative">
          {/* Video Overlay Elements */}
          <div className="absolute inset-0">
            {/* Grid Overlay */}
            {videoControls.showGrid && (
              <svg className="absolute inset-0 w-full h-full opacity-30">
                <defs>
                  <pattern id="videoGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00FF00" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#videoGrid)" />
              </svg>
            )}
            
            {/* Crosshair */}
            {videoControls.showCrosshair && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Crosshair className="w-8 h-8 text-green-400 opacity-60" />
              </div>
            )}
            
            {/* Targeting Reticle */}
            <div 
              className="absolute w-12 h-12 border-2 border-red-400 rounded-full opacity-80"
              style={{
                left: `${feedData.targeting.crosshairX}%`,
                top: `${feedData.targeting.crosshairY}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="absolute inset-0 border border-red-400 rounded-full m-2"></div>
              {feedData.targeting.locked && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-red-400 text-xs font-mono">
                  TGT LOCK
                </div>
              )}
            </div>

            {/* Video Quality Indicators */}
            <div className="absolute top-2 left-2 space-y-1">
              <div className="bg-black/70 px-2 py-1 rounded text-xs font-mono text-green-400">
                {videoControls.thermalMode ? 'THERMAL' : 'EO'}
              </div>
              <div className="bg-black/70 px-2 py-1 rounded text-xs font-mono text-green-400">
                ZOOM: {videoControls.zoom.toFixed(1)}x
              </div>
            </div>

            {/* Recording Indicator */}
            {videoControls.isRecording && (
              <div className="absolute top-2 right-2 flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-400 text-xs font-mono">REC</span>
              </div>
            )}

            {/* Coordinates Overlay */}
            <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs font-mono text-green-400">
              {feedData.coordinates.lat.toFixed(6)}, {feedData.coordinates.lng.toFixed(6)}
            </div>

            {/* Quality/Bitrate Info */}
            <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs font-mono text-green-400">
              Q: {feedData.quality.toFixed(0)}% | {(feedData.bitrate/1024).toFixed(1)}Mbps
            </div>

            {/* Timestamp */}
            <div className="absolute top-2 right-20 bg-black/70 px-2 py-1 rounded text-xs font-mono text-green-400">
              {feedData.timestamp.slice(11,19)}Z
            </div>
          </div>
        </div>

        {/* Asset Info Bar */}
        <div className="bg-gray-800 p-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MilitarySymbol 
              type={asset.type}
              affiliation={asset.affiliation}
              size={16}
            />
            <span className="text-sm font-mono text-green-400">{asset.id}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Camera className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-mono text-gray-300">
              {asset.telemetry.altitude.toFixed(0)}m
            </span>
          </div>
        </div>
      </div>
    );
  };

  const dismissNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationColor = (type: string) => {
    switch(type) {
      case 'error': return 'border-red-500 bg-red-900/30 text-red-300';
      case 'warning': return 'border-yellow-500 bg-yellow-900/30 text-yellow-300';
      case 'success': return 'border-green-500 bg-green-900/30 text-green-300';
      default: return 'border-blue-500 bg-blue-900/30 text-blue-300';
    }
  };

  const getFlightModeColor = (mode: string) => {
    switch(mode) {
      case 'AUTO': return 'text-green-400';
      case 'GUIDED': return 'text-blue-400';
      case 'LOITER': return 'text-yellow-400';
      case 'STANDBY': return 'text-gray-400';
      case 'OFFLINE': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  // Video control functions
  const handleVideoControl = (action: string) => {
    setVideoControls(prev => {
      switch(action) {
        case 'zoom_in':
          return { ...prev, zoom: Math.min(prev.zoom + 0.5, 10) };
        case 'zoom_out':
          return { ...prev, zoom: Math.max(prev.zoom - 0.5, 1) };
        case 'toggle_recording':
          return { ...prev, isRecording: !prev.isRecording };
        case 'toggle_crosshair':
          return { ...prev, showCrosshair: !prev.showCrosshair };
        case 'toggle_grid':
          return { ...prev, showGrid: !prev.showGrid };
        case 'toggle_thermal':
          return { ...prev, thermalMode: !prev.thermalMode };
        case 'toggle_fullscreen':
          return { ...prev, isFullscreen: !prev.isFullscreen };
        case 'toggle_mute':
          return { ...prev, isMuted: !prev.isMuted };
        default:
          return prev;
      }
    });
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
          {/* Video Feed Status */}
          <div className="flex items-center space-x-2">
            <Monitor className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-mono">
              {Object.keys(videoFeeds).length} VIDEO FEEDS
            </span>
          </div>

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
            
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-3 border-b border-gray-600 font-medium font-mono">SITREP // ALERTS</div>
                {notifications.length === 0 ? (
                  <div className="p-4 text-gray-400 text-center font-mono">NO ACTIVE ALERTS</div>
                ) : (
                  notifications.map(notification => (
                    <div key={notification.id} className={'p-3 border-b border-gray-700 last:border-b-0 ' + getNotificationColor(notification.type) + ' border-l-4'}>
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
        {/* Left Sidebar - Video Feeds */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 p-4 space-y-4 overflow-y-auto">
          <div className="text-lg font-semibold mb-4 font-mono">VIDEO FEEDS</div>
          
          {/* Active Video Feeds */}
          <div className="space-y-3">
            {Object.entries(videoFeeds).map(([assetId, feedData]) => (
              <VideoFeedDisplay
                key={assetId}
                assetId={assetId}
                feedData={feedData}
                isActive={activeVideoFeed === assetId}
                onSelect={setActiveVideoFeed}
              />
            ))}
          </div>

          {/* Video Controls Panel */}
          {activeVideoFeed && (
            <div className="bg-gray-700 rounded-lg p-4 space-y-3">
              <div className="text-sm font-medium mb-3 font-mono">VIDEO CONTROLS</div>
              
              {/* Zoom Controls */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono">ZOOM</span>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleVideoControl('zoom_out')}
                    className="p-1 bg-gray-600 hover:bg-gray-500 rounded"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono w-12 text-center">
                    {videoControls.zoom.toFixed(1)}x
                  </span>
                  <button 
                    onClick={() => handleVideoControl('zoom_in')}
                    className="p-1 bg-gray-600 hover:bg-gray-500 rounded"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Toggle Controls */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button 
                  onClick={() => handleVideoControl('toggle_recording')}
                  className={'p-2 rounded font-mono flex items-center justify-center space-x-1 ' + (videoControls.isRecording ? 'bg-red-600 text-white' : 'bg-gray-600 hover:bg-gray-500')}
                >
                  <Square className="w-3 h-3" />
                  <span>REC</span>
                </button>
                <button 
                  onClick={() => handleVideoControl('toggle_thermal')}
                  className={'p-2 rounded font-mono flex items-center justify-center space-x-1 ' + (videoControls.thermalMode ? 'bg-orange-600 text-white' : 'bg-gray-600 hover:bg-gray-500')}
                >
                  {videoControls.thermalMode ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                  <span>THERM</span>
                </button>
                <button 
                  onClick={() => handleVideoControl('toggle_crosshair')}
                  className={'p-2 rounded font-mono flex items-center justify-center space-x-1 ' + (videoControls.showCrosshair ? 'bg-green-600 text-white' : 'bg-gray-600 hover:bg-gray-500')}
                >
                  <Crosshair className="w-3 h-3" />
                  <span>CROSS</span>
                </button>
                <button 
                  onClick={() => handleVideoControl('toggle_grid')}
                  className={'p-2 rounded font-mono flex items-center justify-center space-x-1 ' + (videoControls.showGrid ? 'bg-blue-600 text-white' : 'bg-gray-600 hover:bg-gray-500')}
                >
                  <Grid3X3 className="w-3 h-3" />
                  <span>GRID</span>
                </button>
              </div>

              {/* Audio Controls */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono">AUDIO</span>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleVideoControl('toggle_mute')}
                    className="p-1 bg-gray-600 hover:bg-gray-500 rounded"
                  >
                    {videoControls.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <span className="text-xs font-mono w-8 text-center">
                    {videoControls.isMuted ? '0' : videoControls.volume}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Video Statistics */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono">VIDEO STATS</div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span>ACTIVE FEEDS:</span>
                <span className="text-green-400">{Object.keys(videoFeeds).length}</span>
              </div>
              <div className="flex justify-between">
                <span>RECORDING:</span>
                <span className={videoControls.isRecording ? 'text-red-400' : 'text-gray-400'}>
                  {videoControls.isRecording ? 'ACTIVE' : 'STANDBY'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>BANDWIDTH:</span>
                <span className="text-blue-400">15.3 Mbps</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Display Area */}
        <div className="flex-1 flex flex-col">
          {/* Main Video Display */}
          {activeVideoFeed && videoFeeds[activeVideoFeed] && (
            <div className="flex-1 bg-black p-4">
              <div className="h-full bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-lg relative overflow-hidden">
                {/* Large Video Feed Display */}
                <div className="absolute inset-4">
                  {/* Grid Overlay */}
                  {videoControls.showGrid && (
                    <svg className="absolute inset-0 w-full h-full opacity-20">
                      <defs>
                        <pattern id="mainVideoGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00FF00" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#mainVideoGrid)" />
                    </svg>
                  )}
                  
                  {/* Crosshair */}
                  {videoControls.showCrosshair && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Crosshair className="w-16 h-16 text-green-400 opacity-60" />
                    </div>
                  )}
                  
                  {/* Targeting System */}
                  <div 
                    className="absolute w-24 h-24 border-4 border-red-400 rounded-full opacity-80"
                    style={{
                      left: `${videoFeeds[activeVideoFeed].targeting.crosshairX}%`,
                      top: `${videoFeeds[activeVideoFeed].targeting.crosshairY}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="absolute inset-0 border-2 border-red-400 rounded-full m-4"></div>
                    <div className="absolute inset-0 border border-red-400 rounded-full m-8"></div>
                    {videoFeeds[activeVideoFeed].targeting.locked && (
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-red-400 text-lg font-mono font-bold">
                        TARGET ACQUIRED
                      </div>
                    )}
                  </div>

                  {/* HUD Overlays */}
                  <div className="absolute top-4 left-4 space-y-2">
                    <div className="bg-black/70 px-3 py-2 rounded text-lg font-mono text-green-400">
                      {videoControls.thermalMode ? 'THERMAL IMAGING' : 'ELECTRO-OPTICAL'}
                    </div>
                    <div className="bg-black/70 px-3 py-2 rounded text-lg font-mono text-green-400">
                      ZOOM: {videoControls.zoom.toFixed(1)}x
                    </div>
                    <div className="bg-black/70 px-3 py-2 rounded text-lg font-mono text-green-400">
                      ALT: {assets.find(a => a.id === activeVideoFeed)?.telemetry.altitude.toFixed(0)}m
                    </div>
                  </div>

                  {/* Recording Status */}
                  {videoControls.isRecording && (
                    <div className="absolute top-4 right-4 flex items-center space-x-3">
                      <div className="w-6 h-6 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-400 text-xl font-mono font-bold">RECORDING</span>
                    </div>
                  )}

                  {/* Bottom Info Bar */}
                  <div className="absolute bottom-4 left-4 right-4 bg-black/70 rounded px-4 py-3">
                    <div className="flex justify-between items-center text-lg font-mono">
                      <div className="text-green-400">
                        {videoFeeds[activeVideoFeed].coordinates.lat.toFixed(6)}, {videoFeeds[activeVideoFeed].coordinates.lng.toFixed(6)}
                      </div>
                      <div className="text-green-400">
                        {assets.find(a => a.id === activeVideoFeed)?.id} - {assets.find(a => a.id === activeVideoFeed)?.militaryDesignation}
                      </div>
                      <div className="text-green-400">
                        Q: {videoFeeds[activeVideoFeed].quality.toFixed(0)}% | {(videoFeeds[activeVideoFeed].bitrate/1024).toFixed(1)}Mbps
                      </div>
                      <div className="text-green-400">
                        {videoFeeds[activeVideoFeed].timestamp.slice(11,19)}Z
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Asset Selection when no video is active */}
          {!activeVideoFeed && (
            <div className="flex-1 flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <Monitor className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                <div className="text-2xl font-mono text-gray-400 mb-2">NO VIDEO FEED SELECTED</div>
                <div className="text-lg font-mono text-gray-500">Select a drone from the left panel to view video feed</div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Asset Status & Map */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 flex flex-col">
          <div className="text-lg font-semibold mb-4 font-mono">TACTICAL MAP</div>
          
          {/* Mini Tactical Map */}
          <div className="h-64 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-lg relative mb-4">
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="miniGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00FF00" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#miniGrid)" />
              </svg>
            </div>

            {/* Asset Positions */}
            {assets.map(asset => (
              <div
                key={asset.id}
                className={'absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ' + (selectedAsset === asset.id ? 'scale-125' : 'hover:scale-110') + ' transition-transform'}
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
                  size={20}
                />
                {asset.hasCamera && asset.status === 'active' && (
                  <div className={'absolute -top-1 -right-1 w-3 h-3 rounded-full ' + (activeVideoFeed === asset.id ? 'bg-red-500 animate-pulse' : 'bg-blue-500')}></div>
                )}
              </div>
            ))}
          </div>

          {/* Asset List */}
          <div className="flex-1 space-y-2 overflow-y-auto">
            <div className="text-sm font-semibold mb-2 font-mono">ASSET STATUS</div>
            {assets.map(asset => (
              <div
                key={asset.id}
                className={'bg-gray-700 rounded-lg p-2 cursor-pointer transition-all border ' + (selectedAsset === asset.id ? 'ring-1 ring-green-400 border-green-400' : 'border-transparent hover:bg-gray-650')}
                onClick={() => {
                  setSelectedAsset(selectedAsset === asset.id ? null : asset.id);
                  if (asset.hasCamera && asset.status === 'active') {
                    setActiveVideoFeed(asset.id);
                  }
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <MilitarySymbol 
                      type={asset.type}
                      affiliation={asset.affiliation}
                      status={asset.status}
                      size={16}
                    />
                    <div>
                      <div className="font-medium text-xs font-mono text-green-400">{asset.id}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {asset.hasCamera && (
                      <Camera className={'w-3 h-3 ' + (activeVideoFeed === asset.id ? 'text-red-400' : 'text-blue-400')} />
                    )}
                    <div className={'w-2 h-2 rounded-full ' + (asset.status === 'active' ? 'bg-green-400' : asset.status === 'standby' ? 'bg-yellow-400' : 'bg-red-400')}></div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-300 space-y-0.5 font-mono">
                  <div className="flex justify-between">
                    <span>{asset.tacticalTask}</span>
                    <span className={getFlightModeColor(asset.telemetry.flightMode)}>
                      {asset.telemetry.flightMode}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>PWR: {asset.battery}%</span>
                    <span>ALT: {asset.telemetry.altitude.toFixed(0)}m</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegratedOperationsDashboard;
