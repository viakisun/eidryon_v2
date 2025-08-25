# 🚁 Eidryon V2 - 차세대 군사 드론 관제 시스템

이 프로젝트는 차세대 군사 드론 관제 시스템의 UI를 구현한 웹 애플리케이션입니다. 각 역할이 전문성을 극대화하면서도 완벽하게 연계되어 작동하는 4계층 아키텍처 기반의 통합 시스템을 제공합니다.

Anduril과 Palantir의 군사/보안 분야 UI 디자인 철학을 참고하여 설계되었으며, 모든 인터페이스는 실전 운용 환경을 고려하여 사용자의 안전과 임무 성공을 최우선으로 하는 설계 원칙을 따릅니다.

## 1. 시스템 구성 요소

- **전체 구성**: 4개 전문 역할 인터페이스, 실시간 3D 지도 통합, 작전구역 관리(AO/TAO/EZ), 멀티 에셋 관리
- **핵심 기능**: 실시간 상황 인식, 임무 계획 및 실행, 인텔리전스 분석, 위협 평가 및 대응

---

## 2. 4계층 아키텍처: 역할별 인터페이스

### 👑 Commander View - 최고 지휘관 인터페이스

> **🎯 핵심 기능: 전체 상황 인식, 최고 의사결정, 긴급 상황 대응**

지휘관을 위한 인터페이스로, 전체 작전 상황을 한눈에 파악하고 핵심적인 의사결정을 내릴 수 있도록 설계되었습니다.

- **대형 모니터 최적화**: 20인치 이상 대형 디스플레이 및 상황실 벽면 설치에 최적화되어 원거리 가독성을 확보했습니다.
- **지휘관 권한 중심**: 전체 작전 승인/거부, 긴급 정지(ALL STOP), 임무 우선순위 조정 등 최고 지휘관에게 필요한 핵심 권한을 제공합니다.
- **실시간 상황 모니터링**: 다수(8대) 드론의 실시간 위치, 상태(배터리, 연료), 임무 진행률, 위협 수준을 직관적으로 모니터링합니다.
- **시스템 상태 관리**: 핵심 시스템의 준비태세를 NATO 표준 컬러 스킴으로 시각화하여 전체 시스템 상태를 쉽게 관리합니다.

### 🎮 Operator View - 드론 조작자 인터페이스

> **🕹️ 핵심 기능: 개별 드론 정밀 조작, 실시간 제어, 텔레메트리 모니터링**

드론 조작자가 개별 드론을 정밀하게 제어하고 실시간으로 피드백을 받기 위한 인터페이스입니다.

- **정밀 조작 제어**: 세밀한 방향/고도 제어가 가능한 즉시 응답 제어 시스템을 제공하여 긴급 상황에 신속히 대응할 수 있습니다.
- **실시간 모니터링**: 라이브 영상 피드(확대/축소 가능)와 센서 데이터를 실시간으로 확인하며 텔레메트리 정보를 추적합니다.
- **다중 드론 관리**: 여러 대의 드론 상태를 동시에 모니터링하고, 우선순위에 따라 효율적으로 작업을 전환합니다.
- **특수 시스템 제어**: 엔진, 특수 장비, 페이로드 등 드론의 세부 시스템을 직접 제어하고 관리합니다.

### 🗺️ Planner View - 임무 계획자 인터페이스

> **📊 핵심 기능: 전문적인 임무 설계, 협업 계획, AI 지원 분석**

임무 계획자가 전문적이고 효율적으로 임무를 설계하고 검증할 수 있도록 지원하는 인터페이스입니다.

- **전문적 임무 설계**: 템플릿 기반 계획 시스템과 3D 지형 정보를 활용하여 웨이포인트, 고도 프로파일 등 정밀한 임무 경로를 설정합니다.
- **AI 지원 분석**: AI가 임무 성공률, 위험 요소, 연료 소모량을 예측하고 날씨/위협 정보를 통합 분석하여 계획 수립을 지원합니다.
- **실시간 협업**: 다수의 사용자가 동시 편집, 댓글, 역할별 권한 관리를 통해 실시간으로 협업하며 임무를 계획할 수 있습니다.
- **시뮬레이션 & 검증**: 3D 임무 시뮬레이션을 통해 계획을 사전에 검증하고, 위험도 평가 및 대안 시나리오 분석이 가능합니다.

### 🧠 Analyst View - 인텔리전스 분석 인터페이스

> **🔍 핵심 기능: 다중 인텔리전스 분석, 위협 평가, 패턴 인식**

수집된 다양한 정보를 융합하고 분석하여 실행 가능한 인텔리전스를 생성하기 위한 전문 분석 인터페이스입니다.

- **Multi-INT 융합**: 여러 출처(SIGINT, GEOINT, ELINT)의 정보를 자동으로 융합하고 상관관계를 분석하여 패턴을 인식하고 예측합니다.
- **고급 분석 도구**: AI 기반 위협 평가, 정보 품질 검증, 지리적/시간적 패턴 분석 등 예측 분석을 수행합니다.
- **협업 분석**: 동료 분석가와 실시간으로 정보를 공유하고, 인앱 메시징과 공유 분석 세션을 통해 협업합니다.
- **의사결정 지원**: 분석 결과를 바탕으로 구체적인 후속 조치를 권장하고, 다차원 위험도 분석 및 자동 보고서 생성을 통해 의사결정을 지원합니다.

---

## 3. 시스템 연계 구조

각 역할은 유기적으로 정보를 주고받으며 완벽한 통합 운용을 수행합니다.

```
Commander ← Intelligence Summaries ← Analyst
    ↓              ↗                    ↓
Operator ← Threat Updates ← Real-time Intel
    ↓              ↗                    ↓
Planner ← Risk Assessment ← Analysis Results
```

- **정보 흐름**: Analyst는 분석된 정보를 각 역할(Commander, Operator, Planner)에 맞게 가공하여 실시간으로 제공하며, 양방향 소통을 통해 상황 인식을 공유합니다.
- **실시간 협업**: 상황 변화가 자동 알림, 우선순위 기반 라우팅, 통합 커뮤니케이션 시스템을 통해 모든 역할에 즉시 공유됩니다.

---

## 4. 시스템 특장점

- **기술적 우수성**: 3D 실시간 지도, AI 기반 예측 분석, 멀티 에셋 동시 관리, 클라우드 기반 확장성
- **운용적 효율성**: 계획 시간 단축(70%↓), 실패율 감소(50%↓), 시스템 가동률(85%↑), 실시간 의사결정 지원
- **보안 및 신뢰성**: NATO 표준 준수, 역할 기반 접근 제어(RBAC), 모든 활동에 대한 감사 추적 시스템
- **사용자 경험(UX)**: 역할별 최적화된 직관적 인터페이스, 다양한 디스플레이 지원, 음성 알림 시스템

---

## 5. Getting Started

This project is a web application that provides a collection of advanced operational dashboards for drone and mission control. It is built with Next.js, TypeScript, and Tailwind CSS.

### Prerequisites

You need to have [Node.js](https://nodejs.org/en/) (version 18.x or later) and [npm](https://www.npmjs.com/) installed on your machine.

### Installation

1.  Clone the repository to your local machine.
2.  Navigate to the project directory:
    ```bash
    cd eidryon-dashboards
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

Once the dependencies are installed, you can run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Available Dashboards

-   **/commander**: 최고 지휘관 인터페이스
-   **/operator**: 드론 조작자 인터페이스
-   **/planner**: 임무 계획자 인터페이스
-   **/analyst**: 인텔리전스 분석 인터페이스
-   **/drone-ops**: A dashboard for monitoring and controlling drone operations.
-   **/drone-video**: A dashboard for viewing and analyzing drone video feeds.
-   **/live-intelligent-system**: A dashboard for a live intelligent system.
-   **/mission-ai-planning**: A dashboard for AI-driven mission planning.
-   **/mission-planning**: A dashboard for general mission planning.

You can navigate between these dashboards using the sidebar navigation.

---

## 6. Deployment

This site is deployed to GitHub Pages using a GitHub Actions workflow.

### GitHub Pages Configuration

The deployment is handled by the `.github/workflows/deploy.yml` workflow. For the deployment to work correctly, the GitHub Pages settings in the repository must be configured to use **GitHub Actions** as the source.

To configure this:
1.  Go to your repository on GitHub.
2.  Click on the **Settings** tab.
3.  In the left sidebar, click on **Pages**.
4.  Under "Build and deployment", change the **Source** from "Deploy from a branch" to **GitHub Actions**.

### Deployment Configuration

For a successful deployment to GitHub Pages, two settings in `next.config.ts` must be correctly configured.

- **`basePath`**: This should be set to the name of your repository, prefixed with a slash. For this repository, it is `'/eidryon_v2'`.
- **`assetPrefix`**: This should be set to the same value as `basePath`.

Example:
```javascript
const nextConfig = {
  output: 'export',
  basePath: '/eidryon_v2',
  assetPrefix: '/eidryon_v2',
};
```

These settings ensure that both page navigation and static asset links (CSS, JS, fonts) work correctly when the site is served from a subdirectory.
