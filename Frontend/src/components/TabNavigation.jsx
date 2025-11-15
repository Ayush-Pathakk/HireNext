import React from 'react';
import './TabNavigation.css';

const TabNavigation = ({ currentStep, onStepChange, steps }) => {
  return (
    <div className="tab-navigation">
      {steps.map((step, index) => (
        <button
          key={index}
          type="button"
          className={`tab-item ${currentStep === index ? 'active' : ''} ${currentStep > index ? 'completed' : ''}`}
          onClick={() => onStepChange(index)}
        >
          <span className="tab-icon">{step.icon}</span>
          <span className="tab-label">{step.label}</span>
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;