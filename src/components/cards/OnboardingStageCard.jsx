import { CheckCircleOutlined, ClockCircleOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import '../../styles/OnboardingStageCard.css';

const toneIcon = {
  approved: CheckCircleOutlined,
  danger: ExclamationCircleOutlined,
  issued: CheckCircleOutlined,
  neutral: ClockCircleOutlined,
  success: CheckCircleOutlined,
  warning: ClockCircleOutlined,
};

export default function OnboardingStageCard({ stages = [] }) {
  return (
    <div className="onboarding-stage-card">
      {stages.map((stage) => {
        const Icon = toneIcon[stage.tone] ?? ClockCircleOutlined;

        return (
          <div className="onboarding-stage-card__item" key={`${stage.title}-${stage.status}`}>
            <span className="onboarding-stage-card__title">{stage.title}</span>
            <button className={`onboarding-stage-card__status onboarding-stage-card__status--${stage.tone}`} type="button">
              <span className="onboarding-stage-card__status-label">
                <Icon className="onboarding-stage-card__status-icon" />
                {stage.status}
              </span>
              <DownOutlined className="onboarding-stage-card__chevron" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
