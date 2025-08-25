"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Target, Route, Clock, Save, Upload,
  X, Check,
  Crosshair,
  Wind, Thermometer, CloudRain, Brain, Cpu,
  Sparkles, RefreshCw
} from 'lucide-react';

const MissionPlanningSystem = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedAsset, setSelectedAsset] = useState<string | null>('UAV-001');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [missionMode, setMissionMode] = useState('planning');
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
  const [selectedTool, setSelectedTool] = useState('waypoint');
  const [aiOptimizing, setAiOptimizing] = useState(false);
  interface OptimizationResult {
    optimizedWaypoints: Waypoint[];
    metrics: {
      convergenceRate: number;
      generations: number;
      bestFitness: number;
      avgFitness: number;
    };
  }

  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult | null>(null);
  const [aiSettings, setAiSettings] = useState({
    priority: 'balanced', // fuel, time, safety, stealth
    avoidance: ['threats', 'weather', 'restricted'],
    algorithm: 'genetic', // genetic, a-star, neural
    iterations: 1000,
    population: 50
  });
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [missionParams, setMissionParams] = useState({
    altitude: 1500,
    speed: 50,
    loiterTime: 300,
    payload: 'camera',
    returnToBase: true,
    emergencyLanding: true
  });

  interface EnvironmentData {
    threats: { id: number; x: number; y: number; radius: number; type: string; severity: string; }[];
    weather: { id: number; x: number; y: number; radius: number; type: string; severity: string; }[];
    terrain: { id: number; x: number; y: number; radius: number; type: string; elevation: number; }[];
    restrictedAreas: { id: number; x: number; y: number; radius: number; type: string; priority: string; }[];
  }

  // 위협 및 환경 데이터
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [environmentData, setEnvironmentData] = useState<EnvironmentData>({
    threats: [
      { id: 1, x: 25, y: 45, radius: 15, type: 'sam', severity: 'high' },
      { id: 2, x: 70, y: 30, radius: 10, type: 'radar', severity: 'medium' },
      { id: 3, x: 60, y: 75, radius: 20, type: 'aa_gun', severity: 'low' }
    ],
    weather: [
      { id: 1, x: 40, y: 20, radius: 25, type: 'storm', severity: 'high' },
      { id: 2, x: 80, y: 60, radius: 15, type: 'fog', severity: 'medium' }
    ],
    terrain: [
      { id: 1, x: 15, y: 70, radius: 12, type: 'mountain', elevation: 2000 },
      { id: 2, x: 85, y: 40, radius: 18, type: 'mountain', elevation: 1800 }
    ],
    restrictedAreas: [
      { id: 1, x: 50, y: 85, radius: 20, type: 'civilian', priority: 'critical' }
    ]
  });

  const [aiMetrics, setAiMetrics] = useState({
    optimizationScore: 0,
    fuelEfficiency: 0,
    timeEfficiency: 0,
    safetyScore: 0,
    stealthScore: 0,
    threatAvoidance: 0,
    algorithmPerformance: {
      convergenceRate: 0,
      generations: 0,
      bestFitness: 0,
      avgFitness: 0
    }
  });

  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // AI 최적화 알고리즘들
  const geneticAlgorithm = (waypoints: Waypoint[]): Promise<OptimizationResult> => {
    console.log('Running Genetic Algorithm...');
    return new Promise((resolve) => {
      let generation = 0;
      const maxGenerations = aiSettings.iterations / 50;
      let bestSolution = [...waypoints];
      let bestFitness = calculateFitness(waypoints);
      
      const evolve = () => {
        if (generation >= maxGenerations) {
          resolve({
            optimizedWaypoints: bestSolution,
            metrics: {
              convergenceRate: parseFloat((bestFitness / 100).toFixed(2)),
              generations: generation,
              bestFitness: parseFloat(bestFitness.toFixed(2)),
              avgFitness: parseFloat((bestFitness * 0.8).toFixed(2))
            }
          });
          return;
        }

        // 유전자 알고리즘 시뮬레이션
        const population = generatePopulation(waypoints, aiSettings.population);
        const evolved = selection(population);
        const mutated = mutation(evolved);
        
        const currentBest = mutated.reduce((best: Waypoint[], current: Waypoint[]) => {
          const fitness = calculateFitness(current);
          return fitness > calculateFitness(best) ? current : best;
        });

        const currentFitness = calculateFitness(currentBest);
        if (currentFitness > bestFitness) {
          bestSolution = currentBest;
          bestFitness = currentFitness;
        }

        generation++;
        
        // 실시간 업데이트
        setAiMetrics(prev => ({
          ...prev,
          algorithmPerformance: {
              convergenceRate: parseFloat((bestFitness / 100).toFixed(2)),
            generations: generation,
              bestFitness: parseFloat(bestFitness.toFixed(2)),
              avgFitness: parseFloat((bestFitness * 0.8).toFixed(2))
          }
        }));

        setTimeout(evolve, 50); // 시각적 효과를 위한 지연
      };

      evolve();
    });
  };

  const aStarAlgorithm = (waypoints: Waypoint[]): Promise<OptimizationResult> => {
    console.log('Running A* Algorithm...');
    return new Promise((resolve) => {
      setTimeout(() => {
        const optimized = [...waypoints];
        // A* 알고리즘 시뮬레이션 - 장애물 회피 최적화
        optimized.forEach((wp, index) => {
          if (index > 0 && index < optimized.length - 1) {
            const threats = findNearbyThreats(wp.x, wp.y);
            if (threats.length > 0) {
              const avoidance = calculateAvoidanceVector(threats);
              optimized[index] = {
                ...wp,
                x: Math.max(5, Math.min(95, wp.x + avoidance.x)),
                y: Math.max(5, Math.min(95, wp.y + avoidance.y))
              };
            }
          }
        });
        
        resolve({
          optimizedWaypoints: optimized,
          metrics: {
            convergenceRate: 0.95,
            generations: 1,
            bestFitness: parseFloat(calculateFitness(optimized).toFixed(2)),
            avgFitness: parseFloat(calculateFitness(optimized).toFixed(2))
          }
        });
      }, 2000);
    });
  };

  const neuralNetworkAlgorithm = (waypoints: Waypoint[]): Promise<OptimizationResult> => {
    console.log('Running Neural Network...');
    return new Promise((resolve) => {
      let epoch = 0;
      const maxEpochs = 100;
      let bestSolution = [...waypoints];
      
      const train = () => {
        if (epoch >= maxEpochs) {
          resolve({
            optimizedWaypoints: bestSolution,
            metrics: {
              convergenceRate: 0.93,
              generations: epoch,
              bestFitness: parseFloat(calculateFitness(bestSolution).toFixed(2)),
              avgFitness: parseFloat((calculateFitness(bestSolution) * 0.85).toFixed(2))
            }
          });
          return;
        }

        // 신경망 학습 시뮬레이션
        bestSolution = bestSolution.map(wp => ({
          ...wp,
          x: Math.max(5, Math.min(95, wp.x + (Math.random() - 0.5) * 2)),
          y: Math.max(5, Math.min(95, wp.y + (Math.random() - 0.5) * 2))
        }));

        epoch++;
        
        setAiMetrics(prev => ({
          ...prev,
          algorithmPerformance: {
              convergenceRate: parseFloat((epoch / maxEpochs).toFixed(2)),
            generations: epoch,
              bestFitness: parseFloat(calculateFitness(bestSolution).toFixed(2)),
              avgFitness: parseFloat((calculateFitness(bestSolution) * 0.85).toFixed(2))
          }
        }));

        setTimeout(train, 30);
      };

      train();
    });
  };

  // 유틸리티 함수들
  const calculateFitness = (waypoints: Waypoint[]) => {
    if (waypoints.length < 2) return 0;
    
    let score = 100;
    let totalDistance = 0;
    let threatPenalty = 0;
    let fuelScore = 100;
    let safetyScore = 100;

    // 거리 계산
    for (let i = 1; i < waypoints.length; i++) {
      const dx = waypoints[i].x - waypoints[i-1].x;
      const dy = waypoints[i].y - waypoints[i-1].y;
      totalDistance += Math.sqrt(dx*dx + dy*dy);
    }

    // 연료 효율성 (거리가 짧을수록 좋음)
    fuelScore = Math.max(0, 100 - (totalDistance / 5));

    // 위협 회피 점수
    waypoints.forEach(wp => {
      environmentData.threats.forEach(threat => {
        const distance = Math.sqrt((wp.x - threat.x)**2 + (wp.y - threat.y)**2);
        if (distance < threat.radius) {
          const penalty = threat.severity === 'high' ? 30 : threat.severity === 'medium' ? 15 : 5;
          threatPenalty += penalty;
        }
      });
    });

    safetyScore = Math.max(0, 100 - threatPenalty);

    // 우선순위에 따른 가중 점수
    switch(aiSettings.priority) {
      case 'fuel':
        score = fuelScore * 0.7 + safetyScore * 0.3;
        break;
      case 'safety':
        score = safetyScore * 0.7 + fuelScore * 0.3;
        break;
      case 'time':
        score = fuelScore * 0.5 + safetyScore * 0.5;
        break;
      default: // balanced
        score = (fuelScore + safetyScore) / 2;
    }

    return Math.max(0, Math.min(100, score));
  };

  const generatePopulation = (baseWaypoints: Waypoint[], size: number) => {
    const population = [];
    for (let i = 0; i < size; i++) {
      const individual = baseWaypoints.map(wp => ({
        ...wp,
        x: Math.max(5, Math.min(95, wp.x + (Math.random() - 0.5) * 20)),
        y: Math.max(5, Math.min(95, wp.y + (Math.random() - 0.5) * 20))
      }));
      population.push(individual);
    }
    return population;
  };

  const selection = (population: Waypoint[][]) => {
    return population.sort((a, b) => calculateFitness(b) - calculateFitness(a)).slice(0, population.length / 2);
  };

  const mutation = (population: Waypoint[][]) => {
    return population.map(individual => 
      individual.map(wp => ({
        ...wp,
        x: Math.max(5, Math.min(95, wp.x + (Math.random() - 0.5) * 5)),
        y: Math.max(5, Math.min(95, wp.y + (Math.random() - 0.5) * 5))
      }))
    );
  };

  const findNearbyThreats = (x: number, y: number, radius = 20) => {
    return environmentData.threats.filter(threat => {
      const distance = Math.sqrt((x - threat.x)**2 + (y - threat.y)**2);
      return distance < radius;
    });
  };

  const calculateAvoidanceVector = (threats: { id: number; x: number; y: number; radius: number; type: string; severity: string; }[]) => {
    let avoidX = 0, avoidY = 0;
    threats.forEach(threat => {
      const strength = threat.severity === 'high' ? 10 : threat.severity === 'medium' ? 5 : 2;
      avoidX += strength * (Math.random() - 0.5);
      avoidY += strength * (Math.random() - 0.5);
    });
    return { x: avoidX, y: avoidY };
  };

  const runAIOptimization = async () => {
    if (waypoints.length < 2) {
      alert('최소 2개의 웨이포인트가 필요합니다.');
      return;
    }

    setAiOptimizing(true);
    setOptimizationResults(null);

    try {
      interface OptimizationResult {
        optimizedWaypoints: Waypoint[];
        metrics: {
          convergenceRate: number;
          generations: number;
          bestFitness: number;
          avgFitness: number;
        };
      }

      let result: OptimizationResult;
      switch(aiSettings.algorithm) {
        case 'genetic':
          result = await geneticAlgorithm(waypoints);
          break;
        case 'a-star':
          result = await aStarAlgorithm(waypoints);
          break;
        case 'neural':
          result = await neuralNetworkAlgorithm(waypoints);
          break;
        default:
          result = await geneticAlgorithm(waypoints);
      }

      // 최적화된 웨이포인트 적용
      const optimizedWaypoints = result.optimizedWaypoints.map((wp) => ({
        ...wp,
        coordinates: {
          lat: 37.2431 + (wp.y - 50) * 0.001,
          lng: 127.0766 + (wp.x - 50) * 0.001
        }
      }));

      setWaypoints(optimizedWaypoints);
      setOptimizationResults(result);

      // AI 메트릭 업데이트
      const optimizedStats = calculateMissionStats(optimizedWaypoints);
      const originalStats = calculateMissionStats(waypoints);
      
      setAiMetrics(prev => ({
        ...prev,
        optimizationScore: calculateFitness(optimizedWaypoints),
        fuelEfficiency: Math.max(0, 100 - (optimizedStats.fuel / originalStats.fuel * 100 - 100)),
        timeEfficiency: Math.max(0, 100 - (optimizedStats.duration / originalStats.duration * 100 - 100)),
        safetyScore: 100 - (findThreatsInPath(optimizedWaypoints).length * 10),
        stealthScore: calculateStealthScore(optimizedWaypoints),
        threatAvoidance: calculateThreatAvoidance(optimizedWaypoints)
      }));

    } catch (error) {
      console.error('AI Optimization failed:', error);
    } finally {
      setAiOptimizing(false);
    }
  };

  const calculateStealthScore = (waypoints: Waypoint[]) => {
    let score = 100;
    waypoints.forEach(wp => {
      environmentData.threats.forEach(threat => {
        if (threat.type === 'radar') {
          const distance = Math.sqrt((wp.x - threat.x)**2 + (wp.y - threat.y)**2);
          if (distance < threat.radius * 1.5) {
            score -= 10;
          }
        }
      });
    });
    return Math.max(0, score);
  };

  const calculateThreatAvoidance = (waypoints: Waypoint[]) => {
    const threatsInPath = findThreatsInPath(waypoints);
    return Math.max(0, 100 - (threatsInPath.length * 15));
  };

  const findThreatsInPath = (waypoints: Waypoint[]) => {
    const threats: { id: number; x: number; y: number; radius: number; type: string; severity: string; }[] = [];
    waypoints.forEach(wp => {
      environmentData.threats.forEach(threat => {
        const distance = Math.sqrt((wp.x - threat.x)**2 + (wp.y - threat.y)**2);
        if (distance < threat.radius) {
          threats.push(threat);
        }
      });
    });
    return threats;
  };

  // 기존 함수들 (간소화)
  const addWaypoint = (x: number, y: number) => {
    const newWaypoint = {
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

  const calculateMissionStats = (wps: Waypoint[] = waypoints) => {
    if (wps.length < 2) return { distance: 0, duration: 0, fuel: 0 };
    
    let totalDistance = 0;
    for (let i = 1; i < wps.length; i++) {
      const dx = wps[i].x - wps[i-1].x;
      const dy = wps[i].y - wps[i-1].y;
      totalDistance += Math.sqrt(dx*dx + dy*dy) * 10;
    }
    
    const avgSpeed = missionParams.speed;
    const duration = (totalDistance / avgSpeed) * 60;
    const fuel = Math.min(100, duration * 0.8);
    
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

  const getEnvironmentColor = (type: string, severity: string) => {
    if (type === 'sam' || type === 'aa_gun') return severity === 'high' ? '#FF4444' : severity === 'medium' ? '#FF8844' : '#FFAA44';
    if (type === 'radar') return '#FF44FF';
    if (type === 'storm') return '#4444FF';
    if (type === 'fog') return '#888888';
    if (type === 'mountain') return '#8B4513';
    if (type === 'civilian') return '#FFFF00';
    return '#FFFFFF';
  };

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

  const missionTemplates = [
    { id: 1, name: 'AREA RECONNAISSANCE', type: 'recon', duration: '45min', waypoints: 8 },
    { id: 2, name: 'PATROL ROUTE', type: 'patrol', duration: '60min', waypoints: 6 },
    { id: 3, name: 'TARGET SURVEILLANCE', type: 'surveillance', duration: '120min', waypoints: 4 },
    { id: 4, name: 'CONVOY ESCORT', type: 'escort', duration: '90min', waypoints: 12 }
  ];

  return (
    <div className="h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Header */}
      <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold font-mono">AI MISSION PLANNER</span>
            <span className="text-xs text-purple-400 font-mono">[AI-ENABLED]</span>
          </div>
          <div className="h-6 w-px bg-gray-600"></div>
          <span className="text-sm text-gray-300 font-mono">
            OP GUARDIAN SHIELD // AI OPTIMIZATION v3.0
          </span>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* AI Status */}
          <div className="flex items-center space-x-2">
            <Cpu className={`w-4 h-4 ${aiOptimizing ? 'text-purple-400 animate-pulse' : 'text-green-400'}`} />
            <span className="text-sm font-mono">
              {aiOptimizing ? 'AI OPTIMIZING...' : 'AI READY'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-mono">{currentTime.toISOString().slice(11,19)}Z</span>
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Left Panel - AI Tools & Mission Tools */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 p-4 space-y-4 overflow-y-auto">
          
          {/* AI Optimization Panel */}
          <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono flex items-center space-x-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span>AI OPTIMIZATION</span>
            </div>
            
            {/* Algorithm Selection */}
            <div className="mb-3">
              <label className="text-xs font-mono text-gray-300 block mb-1">ALGORITHM</label>
              <select 
                value={aiSettings.algorithm}
                onChange={(e) => setAiSettings({...aiSettings, algorithm: e.target.value})}
                className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 text-sm font-mono"
                disabled={aiOptimizing}
              >
                <option value="genetic">GENETIC ALGORITHM</option>
                <option value="a-star">A* PATHFINDING</option>
                <option value="neural">NEURAL NETWORK</option>
              </select>
            </div>

            {/* Priority Selection */}
            <div className="mb-3">
              <label className="text-xs font-mono text-gray-300 block mb-1">PRIORITY</label>
              <select 
                value={aiSettings.priority}
                onChange={(e) => setAiSettings({...aiSettings, priority: e.target.value})}
                className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 text-sm font-mono"
                disabled={aiOptimizing}
              >
                <option value="balanced">BALANCED</option>
                <option value="fuel">FUEL EFFICIENCY</option>
                <option value="time">TIME OPTIMAL</option>
                <option value="safety">MAXIMUM SAFETY</option>
                <option value="stealth">STEALTH MODE</option>
              </select>
            </div>

            {/* Optimization Button */}
            <button
              onClick={runAIOptimization}
              disabled={aiOptimizing || waypoints.length < 2}
              className={`w-full py-2 px-4 rounded font-mono text-sm transition-colors flex items-center justify-center space-x-2 ${
                aiOptimizing 
                  ? 'bg-purple-600/50 text-purple-200 cursor-not-allowed' 
                  : waypoints.length < 2
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {aiOptimizing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>OPTIMIZING...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>OPTIMIZE ROUTE</span>
                </>
              )}
            </button>

            {/* AI Metrics */}
            {(aiMetrics.optimizationScore > 0 || aiOptimizing) && (
              <div className="mt-3 pt-3 border-t border-purple-500/30">
                <div className="text-xs font-mono text-purple-400 mb-2">AI PERFORMANCE</div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between">
                    <span>OPTIMIZATION:</span>
                    <span className="text-green-400">{aiMetrics.optimizationScore.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FUEL EFFICIENCY:</span>
                    <span className="text-blue-400">{aiMetrics.fuelEfficiency.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SAFETY SCORE:</span>
                    <span className="text-yellow-400">{aiMetrics.safetyScore.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>THREAT AVOID:</span>
                    <span className="text-red-400">{aiMetrics.threatAvoidance.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Algorithm Performance */}
            {aiOptimizing && aiMetrics.algorithmPerformance.generations > 0 && (
              <div className="mt-3 pt-3 border-t border-purple-500/30">
                <div className="text-xs font-mono text-purple-400 mb-2">ALGORITHM STATUS</div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between">
                    <span>GENERATIONS:</span>
                    <span className="text-cyan-400">{aiMetrics.algorithmPerformance.generations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BEST FITNESS:</span>
                    <span className="text-green-400">{aiMetrics.algorithmPerformance.bestFitness}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CONVERGENCE:</span>
                    <span className="text-blue-400">{(aiMetrics.algorithmPerformance.convergenceRate * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-purple-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${aiMetrics.algorithmPerformance.convergenceRate * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

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
                  disabled={aiOptimizing}
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

          {/* Mission Statistics */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono">MISSION ANALYSIS</div>
            {(() => {
              const stats = calculateMissionStats();
              return (
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span>DISTANCE:</span>
                    <span className="text-blue-400">{stats.distance} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DURATION:</span>
                    <span className="text-blue-400">{stats.duration} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FUEL REQ:</span>
                    <span className={`${stats.fuel > 80 ? 'text-red-400' : 'text-green-400'}`}>
                      {stats.fuel}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>WAYPOINTS:</span>
                    <span className="text-blue-400">{waypoints.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>THREATS:</span>
                    <span className="text-red-400">{findThreatsInPath(waypoints).length}</span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button 
              disabled={aiOptimizing}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded font-mono text-sm transition-colors"
            >
              <Save className="w-4 h-4 inline mr-2" />
              SAVE MISSION
            </button>
            <button 
              disabled={aiOptimizing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded font-mono text-sm transition-colors"
            >
              <Upload className="w-4 h-4 inline mr-2" />
              UPLOAD TO ASSET
            </button>
            <button 
              onClick={() => setWaypoints([])}
              disabled={aiOptimizing}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded font-mono text-sm transition-colors"
            >
              <X className="w-4 h-4 inline mr-2" />
              CLEAR MISSION
            </button>
          </div>
        </div>

        {/* Main Planning Area */}
        <div className="flex-1 relative">
          <div 
            ref={mapRef}
            className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 cursor-crosshair"
            onClick={(e) => {
              if (selectedTool === 'waypoint' && missionMode === 'planning' && !aiOptimizing && mapRef.current) {
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
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#militaryGrid)" />
              </svg>
            </div>

            {/* Environmental Hazards */}
            {environmentData.threats.map(threat => (
              <div
                key={`threat-${threat.id}`}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  left: `${threat.x}%`,
                  top: `${threat.y}%`,
                  width: `${threat.radius * 2}%`,
                  height: `${threat.radius * 2}%`
                }}
              >
                <div 
                  className="w-full h-full rounded-full border-2 opacity-60"
                  style={{ 
                    borderColor: getEnvironmentColor(threat.type, threat.severity),
                    backgroundColor: getEnvironmentColor(threat.type, threat.severity) + '20'
                  }}
                ></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-mono font-bold text-white">
                  {threat.type.toUpperCase()}
                </div>
              </div>
            ))}

            {/* Weather Hazards */}
            {environmentData.weather.map(weather => (
              <div
                key={`weather-${weather.id}`}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  left: `${weather.x}%`,
                  top: `${weather.y}%`,
                  width: `${weather.radius * 2}%`,
                  height: `${weather.radius * 2}%`
                }}
              >
                <div 
                  className="w-full h-full rounded-full border-2 border-dashed opacity-50"
                  style={{ 
                    borderColor: getEnvironmentColor(weather.type, weather.severity),
                    backgroundColor: getEnvironmentColor(weather.type, weather.severity) + '15'
                  }}
                ></div>
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
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                          refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill={aiOptimizing ? "#9333EA" : "#00BFFF"} />
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
                <div className={aiOptimizing ? "animate-pulse" : ""}>
                  <MilitarySymbol 
                    type="waypoint" 
                    size={24} 
                    label={`WP${waypoint.id}`}
                  />
                </div>
                
                {/* Waypoint Info Popup */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800/90 rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
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
                  {!aiOptimizing && (
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

            {/* AI Optimization Status Overlay */}
            {aiOptimizing && (
              <div className="absolute inset-0 bg-purple-900/20 flex items-center justify-center">
                <div className="bg-gray-800/90 rounded-lg p-6 text-center border border-purple-500">
                  <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-pulse" />
                  <div className="text-lg font-mono text-purple-400 mb-2">AI OPTIMIZATION IN PROGRESS</div>
                  <div className="text-sm font-mono text-gray-300 mb-4">
                    Algorithm: {aiSettings.algorithm.toUpperCase()}
                  </div>
                  <div className="text-sm font-mono text-gray-300">
                    Analyzing {environmentData.threats.length} threats, {environmentData.weather.length} weather patterns
                  </div>
                  {aiMetrics.algorithmPerformance.generations > 0 && (
                    <div className="mt-4 text-xs font-mono text-purple-300">
                      Generation: {aiMetrics.algorithmPerformance.generations} | 
                      Fitness: {aiMetrics.algorithmPerformance.bestFitness}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Current Tool Indicator */}
            <div className="absolute top-4 left-4 bg-gray-800/90 rounded-lg p-2">
              <div className="text-sm font-mono text-blue-400">
                MODE: {selectedTool.toUpperCase()}
              </div>
              {selectedTool === 'waypoint' && !aiOptimizing && (
                <div className="text-xs font-mono text-gray-300">
                  Click to add waypoint
                </div>
              )}
              {aiOptimizing && (
                <div className="text-xs font-mono text-purple-400">
                  AI OPTIMIZING - PLEASE WAIT
                </div>
              )}
            </div>

            {/* Optimization Results */}
            {optimizationResults && !aiOptimizing && (
              <div className="absolute top-4 right-4 bg-gray-800/90 rounded-lg p-3 border border-green-500">
                <div className="text-sm font-mono text-green-400 mb-2 flex items-center space-x-2">
                  <Check className="w-4 h-4" />
                  <span>OPTIMIZATION COMPLETE</span>
                </div>
                <div className="text-xs font-mono text-gray-300">
                  Algorithm: {aiSettings.algorithm.toUpperCase()}
                </div>
                <div className="text-xs font-mono text-gray-300">
                  Generations: {optimizationResults.metrics.generations}
                </div>
                <div className="text-xs font-mono text-gray-300">
                  Final Score: {optimizationResults.metrics.bestFitness}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Enhanced Analytics */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 p-4">
          <div className="text-lg font-semibold mb-4 font-mono">MISSION ANALYTICS</div>
          
          {/* AI Performance Metrics */}
          {aiMetrics.optimizationScore > 0 && (
            <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg p-4 mb-4">
              <div className="text-sm font-medium mb-3 font-mono text-purple-400">AI OPTIMIZATION RESULTS</div>
              <div className="space-y-3">
                {[
                  { label: 'OPTIMIZATION SCORE', value: aiMetrics.optimizationScore, color: 'text-green-400' },
                  { label: 'FUEL EFFICIENCY', value: aiMetrics.fuelEfficiency, color: 'text-blue-400' },
                  { label: 'TIME EFFICIENCY', value: aiMetrics.timeEfficiency, color: 'text-cyan-400' },
                  { label: 'SAFETY SCORE', value: aiMetrics.safetyScore, color: 'text-yellow-400' },
                  { label: 'STEALTH SCORE', value: aiMetrics.stealthScore, color: 'text-purple-400' },
                  { label: 'THREAT AVOIDANCE', value: aiMetrics.threatAvoidance, color: 'text-red-400' }
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span>{metric.label}:</span>
                      <span className={metric.color}>{metric.value.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          metric.value >= 80 ? 'bg-green-400' :
                          metric.value >= 60 ? 'bg-yellow-400' :
                          metric.value >= 40 ? 'bg-orange-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${metric.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Waypoint List */}
          {waypoints.length === 0 ? (
            <div className="text-center text-gray-400 font-mono text-sm mt-8">
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
              NO WAYPOINTS DEFINED
              <br />
              Click on map or use templates
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
              <div className="text-sm font-semibold mb-2 font-mono">WAYPOINT LIST</div>
              {waypoints.map((waypoint) => (
                <div
                  key={waypoint.id}
                  className={`bg-gray-700 rounded-lg p-3 transition-all ${
                    aiOptimizing ? 'opacity-50' : 'hover:bg-gray-650'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span className="font-medium text-sm font-mono text-blue-400">
                        WAYPOINT {waypoint.id}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-300 space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span>ALT:</span>
                      <span className="text-yellow-400">{waypoint.altitude}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SPD:</span>
                      <span className="text-yellow-400">{waypoint.speed} km/h</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Threat Analysis */}
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <div className="text-sm font-medium mb-3 font-mono">THREAT ANALYSIS</div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span>SAM SITES:</span>
                <span className="text-red-400">{environmentData.threats.filter(t => t.type === 'sam').length}</span>
              </div>
              <div className="flex justify-between">
                <span>RADAR:</span>
                <span className="text-yellow-400">{environmentData.threats.filter(t => t.type === 'radar').length}</span>
              </div>
              <div className="flex justify-between">
                <span>AA GUNS:</span>
                <span className="text-orange-400">{environmentData.threats.filter(t => t.type === 'aa_gun').length}</span>
              </div>
              <div className="flex justify-between">
                <span>WEATHER:</span>
                <span className="text-blue-400">{environmentData.weather.length}</span>
              </div>
              <div className="flex justify-between">
                <span>THREATS IN PATH:</span>
                <span className="text-red-400">{findThreatsInPath(waypoints).length}</span>
              </div>
            </div>
          </div>

          {/* Environmental Conditions */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono">ENVIRONMENT</div>
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
                  <span>VISIBILITY:</span>
                </div>
                <span className="text-yellow-400">10+ km</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionPlanningSystem;
