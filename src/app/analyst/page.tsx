'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, Database, TrendingUp, BarChart3,
  Activity, Camera, Radio, Satellite, Globe, Radar,
  Users, Target, Info,
  CheckCircle, Clock,
  Brain,
  FileText, Download, Share2, Archive,
  Bookmark, Flag,
  RefreshCw,
  Plus,
  MessageSquare,
} from 'lucide-react';

type Source = 'SIGINT' | 'GEOINT' | 'ELINT' | 'IMINT' | 'HUMINT' | 'OSINT';
type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
type Classification = 'SECRET' | 'CONFIDENTIAL' | 'UNCLASSIFIED';
type ThreatLevel = 'HIGH' | 'MEDIUM' | 'LOW';


const AnalystView = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedIntelType, setSelectedIntelType] = useState('ALL');
  const [timeRange, setTimeRange] = useState('24H');
  const [confidenceFilter, setConfidenceFilter] = useState(50);
  const [analysisMode, setAnalysisMode] = useState('realtime');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAnalysis, setActiveAnalysis] = useState([]);

  const [intelReports, setIntelReports] = useState([
    {
      id: 'RPT-2025-001',
      timestamp: new Date(Date.now() - 1800000),
      source: 'SIGINT',
      classification: 'SECRET',
      priority: 'HIGH',
      confidence: 92,
      title: '적 통신 패턴 변화 감지',
      summary: '적 부대의 무선 통신 빈도가 지난 6시간 동안 300% 증가',
      details: 'Grid 4527-4892 구역에서 VHF 대역 통신 급증. 새로운 암호화 패턴 확인됨.',
      location: { lat: 37.2445, lng: 127.0823 },
      tags: ['통신분석', '적활동', '암호화'],
      analyst: 'SGT Park',
      verified: false,
      relatedReports: ['RPT-2025-002', 'RPT-2025-005']
    },
    {
      id: 'RPT-2025-002',
      timestamp: new Date(Date.now() - 3600000),
      source: 'GEOINT',
      classification: 'CONFIDENTIAL',
      priority: 'MEDIUM',
      confidence: 85,
      title: '새로운 차량 이동 확인',
      summary: '위성 영상에서 미확인 차량 3대 북동쪽 이동 포착',
      details: '신형 장갑차로 추정되는 차량들이 주요 도로를 이용하여 이동 중',
      location: { lat: 37.2398, lng: 127.0756 },
      tags: ['위성분석', '차량이동', '장갑차'],
      analyst: 'CPT Kim',
      verified: true,
      relatedReports: ['RPT-2025-001']
    },
    {
      id: 'RPT-2025-003',
      timestamp: new Date(Date.now() - 5400000),
      source: 'HUMINT',
      classification: 'CONFIDENTIAL',
      priority: 'LOW',
      confidence: 67,
      title: '현지 정보원 보고',
      summary: '민간인 목격담 - 군용 헬기 2대 저공비행',
      details: '지역 주민이 어제 저녁 군용 헬기 소음을 들었다고 신고',
      location: { lat: 37.2512, lng: 127.0689 },
      tags: ['인간정보', '항공기', '목격담'],
      analyst: 'LT Lee',
      verified: false,
      relatedReports: []
    }
  ]);

  const [threatAssessment, setThreatAssessment] = useState([
    {
      id: 'THR-001',
      type: 'SAM_SITE',
      threat_level: 'HIGH',
      location: { lat: 37.2445, lng: 127.0823 },
      confidence: 95,
      range: 400,
      description: 'S-400 시스템으로 추정되는 대공미사일 기지'
    },
    {
      id: 'THR-002',
      type: 'ARMOR_UNIT',
      threat_level: 'MEDIUM',
      location: { lat: 37.2398, lng: 127.0756 },
      confidence: 87,
      range: 5,
      description: '기갑부대 중대급 규모 (전차 12대 추정)'
    }
  ]);

  const [analyticsData, setAnalyticsData] = useState({
    totalReports: 156,
    newReports24h: 24,
    highPriorityReports: 8,
    verifiedReports: 89,
    avgConfidence: 82,
    topSources: [
      { source: 'GEOINT', count: 45, reliability: 94 },
      { source: 'SIGINT', count: 38, reliability: 88 },
      { source: 'ELINT', count: 32, reliability: 91 },
      { source: 'IMINT', count: 24, reliability: 86 },
      { source: 'HUMINT', count: 17, reliability: 72 }
    ]
  });

  const [collaborators, setCollaborators] = useState([
    { id: 1, name: 'CPT Johnson', role: 'COMMANDER', status: 'available' },
    { id: 2, name: 'SGT Miller', role: 'OPERATOR', status: 'busy' },
    { id: 3, name: 'MAJ Wilson', role: 'PLANNER', status: 'available' },
    { id: 4, name: 'LT Davis', role: 'ANALYST', status: 'available' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const filteredReports = intelReports.filter(report => {
    const matchesSource = selectedIntelType === 'ALL' || report.source === selectedIntelType;
    const matchesConfidence = report.confidence >= confidenceFilter;
    const matchesSearch = searchQuery === '' || 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSource && matchesConfidence && matchesSearch;
  });

  const getSourceIcon = (source: Source) => {
    switch(source) {
      case 'SIGINT': return <Radio className="w-4 h-4 text-blue-400" />;
      case 'GEOINT': return <Satellite className="w-4 h-4 text-green-400" />;
      case 'ELINT': return <Radar className="w-4 h-4 text-yellow-400" />;
      case 'IMINT': return <Camera className="w-4 h-4 text-purple-400" />;
      case 'HUMINT': return <Users className="w-4 h-4 text-orange-400" />;
      case 'OSINT': return <Globe className="w-4 h-4 text-cyan-400" />;
      default: return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch(priority) {
      case 'HIGH': return 'border-red-500 text-red-400';
      case 'MEDIUM': return 'border-yellow-500 text-yellow-400';
      case 'LOW': return 'border-green-500 text-green-400';
      default: return 'border-gray-500 text-gray-400';
    }
  };

  const getClassificationColor = (classification: Classification) => {
    switch(classification) {
      case 'SECRET': return 'text-red-400 bg-red-900/30';
      case 'CONFIDENTIAL': return 'text-yellow-400 bg-yellow-900/30';
      case 'UNCLASSIFIED': return 'text-green-400 bg-green-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  const getThreatLevelColor = (level: ThreatLevel) => {
    switch(level) {
      case 'HIGH': return 'text-red-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'LOW': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const verifyReport = (reportId: string) => {
    setIntelReports(prev => 
      prev.map(report => 
        report.id === reportId ? { ...report, verified: true } : report
      )
    );
  };

  const correlateReports = (reportId: string) => {
    const report = intelReports.find(r => r.id === reportId);
    if (report) {
      const related = intelReports.filter(r => 
        r.id !== reportId && 
        (r.source === report.source || 
         Math.abs(r.location.lat - report.location.lat) < 0.01 ||
         r.tags.some(tag => report.tags.includes(tag)))
      ).slice(0, 3);
      
      setSelectedReport({
        ...report,
        correlatedReports: related
      });
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Top Analysis Bar */}
      <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold font-mono">INTELLIGENCE ANALYST</span>
            <span className="text-xs text-purple-400 font-mono">[CLASSIFIED]</span>
          </div>
          
          <div className="h-6 w-px bg-gray-600"></div>
          
          <div className="flex items-center space-x-1">
            {['realtime', 'historical', 'predictive'].map(mode => (
              <button
                key={mode}
                onClick={() => setAnalysisMode(mode)}
                className={`px-3 py-1 rounded text-sm font-mono transition-colors ${
                  analysisMode === mode 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                {mode.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-mono text-gray-300">TIMERANGE:</span>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm font-mono"
            >
              <option value="1H">1 HOUR</option>
              <option value="6H">6 HOURS</option>
              <option value="24H">24 HOURS</option>
              <option value="7D">7 DAYS</option>
              <option value="30D">30 DAYS</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-sm font-mono text-green-400">
              {activeAnalysis.length} ACTIVE ANALYSIS
            </span>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-mono text-sm">
            <Download className="w-4 h-4 inline mr-1" />
            EXPORT
          </button>

          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-mono">{currentTime.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Left Panel - Analytics & Filters */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 p-4 space-y-4 overflow-y-auto">
          
          {/* Search & Filters */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono text-cyan-400">SEARCH & FILTERS</div>
            
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reports, tags, locations..."
                className="w-full bg-gray-600 border border-gray-500 rounded pl-10 pr-4 py-2 text-sm font-mono"
              />
            </div>

            <div className="mb-3">
              <label className="text-xs font-mono text-gray-300 block mb-1">INTEL SOURCE</label>
              <select
                value={selectedIntelType}
                onChange={(e) => setSelectedIntelType(e.target.value)}
                className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 text-sm font-mono"
              >
                <option value="ALL">ALL SOURCES</option>
                <option value="SIGINT">SIGINT</option>
                <option value="GEOINT">GEOINT</option>
                <option value="ELINT">ELINT</option>
                <option value="IMINT">IMINT</option>
                <option value="HUMINT">HUMINT</option>
                <option value="OSINT">OSINT</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="text-xs font-mono text-gray-300 block mb-1">
                MIN CONFIDENCE: {confidenceFilter}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={confidenceFilter}
                onChange={(e) => setConfidenceFilter(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="text-xs font-mono text-gray-400">
              {filteredReports.length} reports match filters
            </div>
          </div>

          {/* Analytics Overview */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono text-green-400">ANALYTICS OVERVIEW</div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-600 rounded p-2 text-center">
                <div className="text-xl font-bold font-mono text-blue-400">
                  {analyticsData.totalReports}
                </div>
                <div className="text-xs font-mono text-gray-400">TOTAL REPORTS</div>
              </div>
              <div className="bg-gray-600 rounded p-2 text-center">
                <div className="text-xl font-bold font-mono text-red-400">
                  {analyticsData.newReports24h}
                </div>
                <div className="text-xs font-mono text-gray-400">NEW (24H)</div>
              </div>
              <div className="bg-gray-600 rounded p-2 text-center">
                <div className="text-xl font-bold font-mono text-yellow-400">
                  {analyticsData.highPriorityReports}
                </div>
                <div className="text-xs font-mono text-gray-400">HIGH PRIORITY</div>
              </div>
              <div className="bg-gray-600 rounded p-2 text-center">
                <div className="text-xl font-bold font-mono text-green-400">
                  {analyticsData.avgConfidence}%
                </div>
                <div className="text-xs font-mono text-gray-400">AVG CONFIDENCE</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono text-gray-300 mb-2">SOURCE RELIABILITY</div>
              {analyticsData.topSources.map(source => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getSourceIcon(source.source)}
                    <span className="text-xs font-mono">{source.source}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-600 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full ${
                          source.reliability >= 90 ? 'bg-green-400' :
                          source.reliability >= 80 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${source.reliability}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-mono w-8 text-right">{source.reliability}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Threat Assessment Summary */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono text-red-400">THREAT ASSESSMENT</div>
            
            <div className="space-y-2">
              {threatAssessment.map(threat => (
                <div key={threat.id} className="bg-gray-600 rounded p-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-mono text-white">{threat.type}</div>
                    <div className={`text-xs font-mono ${getThreatLevelColor(threat.threat_level)}`}>
                      {threat.threat_level}
                    </div>
                  </div>
                  <div className="text-xs font-mono text-gray-300">
                    Confidence: {threat.confidence}%
                  </div>
                  <div className="text-xs font-mono text-gray-400">
                    Range: {threat.range}km
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-600">
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div>
                  <div className="text-red-400 font-bold">
                    {threatAssessment.filter(t => t.threat_level === 'HIGH').length}
                  </div>
                  <div className="text-gray-400">HIGH</div>
                </div>
                <div>
                  <div className="text-yellow-400 font-bold">
                    {threatAssessment.filter(t => t.threat_level === 'MEDIUM').length}
                  </div>
                  <div className="text-gray-400">MEDIUM</div>
                </div>
                <div>
                  <div className="text-green-400 font-bold">
                    {threatAssessment.filter(t => t.threat_level === 'LOW').length}
                  </div>
                  <div className="text-gray-400">LOW</div>
                </div>
              </div>
            </div>
          </div>

          {/* Collaboration Panel */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono text-orange-400">COLLABORATION</div>
            
            <div className="space-y-2">
              {collaborators.map(collab => (
                <div key={collab.id} className="flex items-center justify-between p-2 bg-gray-600 rounded">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      collab.status === 'available' ? 'bg-green-400' :
                      collab.status === 'busy' ? 'bg-yellow-400' : 'bg-red-400'
                    }`}></div>
                    <div>
                      <div className="text-sm font-mono text-white">{collab.name}</div>
                      <div className="text-xs font-mono text-gray-400">{collab.role}</div>
                    </div>
                  </div>
                  <button className="text-blue-400 hover:text-blue-300">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Intel Reports */}
        <div className="flex-1 flex flex-col">
          {/* Reports Header */}
          <div className="bg-gray-800 border-b border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-bold font-mono text-purple-400">INTELLIGENCE REPORTS</h2>
                <div className="text-sm font-mono text-gray-400">
                  {filteredReports.length} of {intelReports.length} reports
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded font-mono text-sm">
                  <Plus className="w-4 h-4 inline mr-1" />
                  NEW ANALYSIS
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded font-mono text-sm">
                  <RefreshCw className="w-4 h-4 inline mr-1" />
                  REFRESH
                </button>
              </div>
            </div>
          </div>

          {/* Reports List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredReports.map(report => (
              <div
                key={report.id}
                className={`bg-gray-700 rounded-lg p-4 border-l-4 cursor-pointer transition-all hover:bg-gray-650 ${
                  selectedReport?.id === report.id 
                    ? 'border-purple-500 bg-gray-600' 
                    : getPriorityColor(report.priority)
                }`}
                onClick={() => setSelectedReport(report)}
              >
                {/* Report Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {getSourceIcon(report.source)}
                    <div>
                      <div className="font-mono font-bold text-white">{report.title}</div>
                      <div className="text-xs font-mono text-gray-400">
                        {report.id} • {report.analyst}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {report.verified && <CheckCircle className="w-4 h-4 text-green-400" />}
                    <div className={`px-2 py-1 rounded text-xs font-mono ${getClassificationColor(report.classification)}`}>
                      {report.classification}
                    </div>
                    <div className="text-xs font-mono text-gray-400">
                      {Math.floor((new Date() - report.timestamp) / 60000)}m ago
                    </div>
                  </div>
                </div>

                {/* Report Content */}
                <div className="mb-3">
                  <div className="text-sm font-mono text-gray-200 mb-2">{report.summary}</div>
                  <div className="flex items-center space-x-4 text-xs font-mono text-gray-400">
                    <span>Confidence: {report.confidence}%</span>
                    <span>Priority: {report.priority}</span>
                    <span>Source: {report.source}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex items-center space-x-2 mb-3">
                  {report.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-600 rounded text-xs font-mono text-cyan-400">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {!report.verified && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); verifyReport(report.id); }}
                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs font-mono"
                      >
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                        VERIFY
                      </button>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); correlateReports(report.id); }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-mono"
                    >
                      <Activity className="w-3 h-3 inline mr-1" />
                      CORRELATE
                    </button>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs font-mono">
                      <Brain className="w-3 h-3 inline mr-1" />
                      ANALYZE
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button className="text-gray-400 hover:text-white">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-white">
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-white">
                      <Flag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Detailed Analysis */}
        <div className="w-96 bg-gray-800 border-l border-gray-700 p-4 space-y-4 overflow-y-auto">
          
          {selectedReport ? (
            <>
              {/* Selected Report Details */}
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-medium mb-3 font-mono text-blue-400">DETAILED ANALYSIS</div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-mono text-gray-400 mb-1">REPORT ID</div>
                    <div className="font-mono text-white">{selectedReport.id}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-mono text-gray-400 mb-1">FULL DETAILS</div>
                    <div className="text-sm font-mono text-gray-200 bg-gray-600 rounded p-2">
                      {selectedReport.details}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs font-mono text-gray-400 mb-1">CONFIDENCE</div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-600 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              selectedReport.confidence >= 80 ? 'bg-green-400' :
                              selectedReport.confidence >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                            }`}
                            style={{ width: `${selectedReport.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-mono text-white">{selectedReport.confidence}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs font-mono text-gray-400 mb-1">PRIORITY</div>
                      <div className={`px-2 py-1 rounded text-xs font-mono ${getPriorityColor(selectedReport.priority)}`}>
                        {selectedReport.priority}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-mono text-gray-400 mb-1">LOCATION</div>
                    <div className="text-sm font-mono text-cyan-400">
                      {selectedReport.location.lat.toFixed(6)}, {selectedReport.location.lng.toFixed(6)}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-mono text-gray-400 mb-1">TIMESTAMP</div>
                    <div className="text-sm font-mono text-white">
                      {selectedReport.timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Correlation Analysis */}
              {selectedReport.correlatedReports && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm font-medium mb-3 font-mono text-green-400">CORRELATED REPORTS</div>
                  
                  <div className="space-y-2">
                    {selectedReport.correlatedReports.map(related => (
                      <div key={related.id} className="bg-gray-600 rounded p-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-mono text-white">{related.id}</div>
                          <div className="text-xs font-mono text-gray-400">{related.source}</div>
                        </div>
                        <div className="text-xs font-mono text-gray-300">{related.title}</div>
                        <div className="text-xs font-mono text-cyan-400">
                          Similarity: {Math.floor(Math.random() * 30 + 70)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Analysis */}
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-medium mb-3 font-mono text-pink-400">AI ANALYSIS</div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-mono text-gray-400 mb-1">THREAT ASSESSMENT</div>
                    <div className="text-sm font-mono text-yellow-400">
                      MODERATE - Requires continued monitoring
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-mono text-gray-400 mb-1">RECOMMENDATIONS</div>
                    <ul className="text-sm font-mono text-gray-200 space-y-1">
                      <li>• Increase surveillance in target area</li>
                      <li>• Correlate with HUMINT sources</li>
                      <li>• Monitor communication frequencies</li>
                    </ul>
                  </div>
                  
                  <div>
                    <div className="text-xs font-mono text-gray-400 mb-1">PREDICTED OUTCOMES</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span>Escalation Probability:</span>
                        <span className="text-yellow-400">35%</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span>Intel Accuracy:</span>
                        <span className="text-green-400">87%</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span>Response Time Required:</span>
                        <span className="text-cyan-400">&lt; 2 hours</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* No Report Selected */
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <Database className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <div className="text-lg font-mono text-gray-400 mb-2">NO REPORT SELECTED</div>
              <div className="text-sm font-mono text-gray-500">
                Click on a report to view detailed analysis
              </div>
            </div>
          )}

          {/* Quick Analysis Tools */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono text-cyan-400">ANALYSIS TOOLS</div>
            
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded font-mono text-xs">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                TREND
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded font-mono text-xs">
                <BarChart3 className="w-3 h-3 inline mr-1" />
                STATS
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded font-mono text-xs">
                <Brain className="w-3 h-3 inline mr-1" />
                AI ASSIST
              </button>
              <button className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-3 rounded font-mono text-xs">
                <Target className="w-3 h-3 inline mr-1" />
                PREDICT
              </button>
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3 font-mono text-yellow-400">EXPORT & SHARE</div>
            
            <div className="space-y-2">
              <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-3 rounded font-mono text-sm">
                <FileText className="w-4 h-4 inline mr-2" />
                GENERATE REPORT
              </button>
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded font-mono text-sm">
                <Share2 className="w-4 h-4 inline mr-2" />
                SHARE ANALYSIS
              </button>
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded font-mono text-sm">
                <Archive className="w-4 h-4 inline mr-2" />
                ARCHIVE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalystView;
