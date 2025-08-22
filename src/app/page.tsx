'use client';

import React from 'react';

const jsonData = {
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "🚁 Drone Control System UI Design - 4-Tier Architecture"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*차세대 군사 드론 관제 시스템*\n각 역할이 전문성을 극대화하면서도 완벽하게 연계되어 작동하는 통합 시스템입니다."
      }
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*📋 시스템 구성 요소*"
      }
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*전체 구성*\n• 4개 전문 역할 인터페이스\n• 실시간 3D 지도 통합\n• 작전구역 관리 (AO/TAO/EZ)\n• 멀티 에셋 관리"
        },
        {
          "type": "mrkdwn",
          "text": "*핵심 기능*\n• 실시간 상황 인식\n• 임무 계획 및 실행\n• 인텔리전스 분석\n• 위협 평가 및 대응"
        }
      ]
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*👑 Commander View - 최고 지휘관 인터페이스*"
      },
      "accessory": {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": "View Interface"
        },
        "url": "/commander",
        "action_id": "commander_view"
      }
    },
    {
      "type": "context",
      "elements": [
        {
          "type": "mrkdwn",
          "text": "🎯 *핵심 기능:* 전체 상황 인식, 최고 의사결정, 긴급 상황 대응"
        }
      ]
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*대형 모니터 최적화*\n• 20인치+ 대형 디스플레이 대응\n• 상황실 벽면 설치 최적화\n• 원거리 가독성 고려 설계\n• 한눈에 파악 가능한 레이아웃"
        },
        {
          "type": "mrkdwn",
          "text": "*지휘관 권한 중심*\n• 전체 작전 승인/거부\n• 긴급 정지 권한 (ALL STOP)\n• 임무 우선순위 실시간 조정\n• 자원 할당 의사결정"
        }
      ]
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*실시간 상황 모니터링*\n• 8대 드론 실시간 추적\n• 배터리/연료 상태 색상 코딩\n• 활성 임무 진행률 표시\n• 위협 수준 자동 업데이트"
        },
        {
          "type": "mrkdwn",
          "text": "*시스템 상태 관리*\n• 6대 핵심 시스템 모니터링\n• 85% 전체 준비태세 표시\n• NATO 표준 컬러 스킴\n• 음성 알림 시스템 제어"
        }
      ]
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*🎮 Operator View - 드론 조작자 인터페이스*"
      },
      "accessory": {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": "View Interface"
        },
        "url": "/operator",
        "action_id": "operator_view"
      }
    },
    {
      "type": "context",
      "elements": [
        {
          "type": "mrkdwn",
          "text": "🕹️ *핵심 기능:* 개별 드론 정밀 조작, 실시간 제어, 텔레메트리 모니터링"
        }
      ]
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*정밀 조작 제어*\n• 실시간 드론 조작 인터페이스\n• 세밀한 방향/고도 제어\n• 즉시 응답 제어 시스템\n• 긴급 상황 즉시 대응"
        },
        {
          "type": "mrkdwn",
          "text": "*실시간 모니터링*\n• 라이브 영상 피드 수신\n• 확대/축소 기능\n• 센서 데이터 실시간 표시\n• 텔레메트리 정보 추적"
        }
      ]
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*다중 드론 관리*\n• 8대 드론 동시 모니터링\n• 드론별 상태 카드 표시\n• 우선순위 기반 알림\n• 효율적인 작업 전환"
        },
        {
          "type": "mrkdwn",
          "text": "*특수 시스템 제어*\n• 엔진 상태 모니터링\n• 특수 장비 제어\n• 페이로드 관리\n• 연료/배터리 최적화"
        }
      ]
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*🗺️ Planner View - 임무 계획자 인터페이스*"
      },
      "accessory": {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": "View Interface"
        },
        "url": "/planner",
        "action_id": "planner_view"
      }
    },
    {
      "type": "context",
      "elements": [
        {
          "type": "mrkdwn",
          "text": "📊 *핵심 기능:* 전문적인 임무 설계, 협업 계획, AI 지원 분석"
        }
      ]
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*전문적 임무 설계*\n• 템플릿 기반 계획 시스템\n• 3D 지형 활용 경로 설정\n• 웨이포인트 정밀 배치\n• 고도 프로파일 최적화"
        },
        {
          "type": "mrkdwn",
          "text": "*AI 지원 분석*\n• 성공률 예측 (87%)\n• 위험 요소 자동 식별\n• 연료 소모량 정확 계산\n• 날씨/위협 분석 통합"
        }
      ]
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*실시간 협업*\n• 다중 사용자 동시 편집\n• 역할별 권한 관리\n• 실시간 댓글 시스템\n• 변경사항 실시간 동기화"
        },
        {
          "type": "mrkdwn",
          "text": "*시뮬레이션 & 검증*\n• 3D 임무 시뮬레이션\n• 위험도 평가 (Medium)\n• 대안 시나리오 분석\n• 승인 워크플로우 관리"
        }
      ]
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*🧠 Analyst View - 인텔리전스 분석 인터페이스*"
      },
      "accessory": {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": "View Interface"
        },
        "url": "/analyst",
        "action_id": "analyst_view"
      }
    },
    {
      "type": "context",
      "elements": [
        {
          "type": "mrkdwn",
          "text": "🔍 *핵심 기능:* 다중 인텔리전스 분석, 위협 평가, 패턴 인식"
        }
      ]
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*Multi-INT 융합*\n• SIGINT + GEOINT + ELINT\n• 24개 누적 보고서 분석\n• 자동 상관관계 분석\n• 패턴 인식 및 예측"
        },
        {
          "type": "mrkdwn",
          "text": "*고급 분석 도구*\n• AI 기반 위협 평가\n• 실시간 정보 품질 검증\n• 지리적/시간적 패턴 분석\n• 예측 분석 (35% 확산 가능성)"
        }
      ]
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*협업 분석*\n• 실시간 동료 분석가 상태\n• 역할별 정보 공유\n• 인앱 메시징 시스템\n• 공유 분석 세션"
        },
        {
          "type": "mrkdwn",
          "text": "*의사결정 지원*\n• 구체적 후속 조치 권장\n• 다차원 위험도 분석\n• 대안 시나리오 제시\n• 자동 보고서 생성"
        }
      ]
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*🔄 시스템 연계 구조*"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "```\nCommander ← Intelligence Summaries ← Analyst\n    ↓              ↗                    ↓\nOperator ← Threat Updates ← Real-time Intel\n    ↓              ↗                    ↓  \nPlanner ← Risk Assessment ← Analysis Results\n```"
      }
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*정보 흐름*\n• Analyst → Commander: 상황 브리핑\n• Analyst → Operator: 즉시 위협 알림\n• Analyst → Planner: 위험 평가 정보\n• 모든 역할 ↔ Analyst: 양방향 소통"
        },
        {
          "type": "mrkdwn",
          "text": "*실시간 협업*\n• 즉시 정보 공유\n• 상황 변화 자동 알림\n• 우선순위 기반 라우팅\n• 통합 커뮤니케이션"
        }
      ]
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*🎯 시스템 특장점*"
      }
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*기술적 우수성*\n• 3D 실시간 지도 통합\n• AI 기반 예측 분석\n• 멀티 에셋 동시 관리\n• 클라우드 기반 확장성"
        },
        {
          "type": "mrkdwn",
          "text": "*운용적 효율성*\n• 70% 계획 시간 단축\n• 50% 실패율 감소\n• 85% 시스템 가동률\n• 실시간 의사결정 지원"
        }
      ]
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*보안 및 신뢰성*\n• NATO 표준 준수\n• 분류 정보 자동 처리\n• 역할 기반 접근 제어\n• 감사 추적 시스템"
        },
        {
          "type": "mrkdwn",
          "text": "*사용자 경험*\n• 직관적 인터페이스\n• 상황별 최적화 설계\n• 다양한 디스플레이 지원\n• 음성 알림 시스템"
        }
      ]
    },
    {
      "type": "divider"
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "👑 Commander View"
          },
          "style": "primary",
          "url": "/commander",
          "action_id": "view_commander"
        },
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "🎮 Operator View"
          },
          "style": "primary",
          "url": "/operator",
          "action_id": "view_operator"
        },
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "🗺️ Planner View"
          },
          "style": "primary",
          "url": "/planner",
          "action_id": "view_planner"
        },
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "🧠 Analyst View"
          },
          "style": "primary",
          "url": "/analyst",
          "action_id": "view_analyst"
        }
      ]
    },
    {
      "type": "context",
      "elements": [
        {
          "type": "mrkdwn",
          "text": "💡 *각 인터페이스를 클릭하여 상세한 UI 디자인을 확인하실 수 있습니다.*"
        }
      ]
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*📝 추가 정보*\n\n이 시스템은 Anduril과 Palantir의 군사/보안 분야 UI 디자인 철학을 참고하여 설계되었습니다. 각 역할별 전문성을 극대화하면서도 완벽한 통합 운용이 가능한 차세대 군사 드론 관제 시스템입니다.\n\n모든 인터페이스는 실전 운용 환경을 고려하여 설계되었으며, 사용자의 안전과 임무 성공을 최우선으로 하는 설계 원칙을 따릅니다."
      }
    }
  ]
};

const MrkdwnText = ({ text }) => {
  const html = text
    .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
    .replace(/•/g, '<br/>•')
    .replace(/```(.*?)```/gs, '<pre class="bg-gray-800 p-4 rounded-lg text-sm whitespace-pre-wrap"><code>$1</code></pre>')
     .replace(/\n/g, '<br />');

  return <p className="text-gray-300" dangerouslySetInnerHTML={{ __html: html }} />;
};

const BlockRenderer = ({ block }) => {
  switch (block.type) {
    case 'header':
      return <h1 className="text-4xl font-bold text-white mb-4">{block.text.text}</h1>;
    case 'section':
      return (
        <div className="mb-6">
          {block.text && <MrkdwnText text={block.text.text} />}
          {block.fields && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
              {block.fields.map((field, index) => (
                <div key={index}>
                  <MrkdwnText text={field.text} />
                </div>
              ))}
            </div>
          )}
          {block.accessory && block.accessory.type === 'button' && (
            <div className="mt-4">
               <a
                href={block.accessory.url}
                onClick={(e) => {
                    e.preventDefault();
                    const targetUrl = e.currentTarget.href;
                    if (document.fullscreenElement) {
                        document.exitFullscreen().then(() => window.open(targetUrl, '_self'));
                    } else {
                        document.documentElement.requestFullscreen().then(() => window.open(targetUrl, '_self'));
                    }
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                {block.accessory.text.text}
              </a>
            </div>
          )}
        </div>
      );
    case 'divider':
      return <hr className="my-8 border-gray-700" />;
    case 'context':
      return (
        <div className="text-sm text-gray-500 mt-2 mb-4">
          {block.elements.map((element, index) => (
            <MrkdwnText key={index} text={element.text} />
          ))}
        </div>
      );
    case 'actions':
        return (
            <div className="flex flex-wrap gap-4 mt-8">
              {block.elements.map((element, index) => (
                <a
                  key={index}
                  href={element.url}
                  onClick={(e) => {
                    e.preventDefault();
                    const targetUrl = e.currentTarget.href;
                    if (document.fullscreenElement) {
                        document.exitFullscreen().then(() => window.open(targetUrl, '_self'));
                    } else {
                        document.documentElement.requestFullscreen().then(() => window.open(targetUrl, '_self'));
                    }
                  }}
                  className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg flex items-center justify-center space-x-2
                    ${element.style === 'primary' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                >
                  <span>{element.text.text.split(' ')[0]}</span>
                  <span>{element.text.text.split(' ').slice(1).join(' ')}</span>
                </a>
              ))}
            </div>
          );
    default:
      return null;
  }
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
                {jsonData.blocks.map((block, index) => (
                    <BlockRenderer key={index} block={block} />
                ))}
            </div>
        </div>
    </main>
  );
}
