/**
 * ScreeningTab.jsx
 * Tab Khám sàng lọc — điền kết quả khám, lưu vào note của VaccinationSession
 */

import React, { useState } from 'react';
import { useScreening } from '../hooks/useDoctorWorkspace';
import '../assets/tabstyle.css';

const ScreeningTab = ({ sessionId }) => {
  const { saving, success, error, saveScreening, cancelScreening, SCREENING_QUESTIONS } = useScreening(sessionId);

  const [examType, setExamType] = useState('normal'); // normal | covid
  const [weight, setWeight] = useState('');
  const [temperature, setTemperature] = useState('37.2');
  const [answers, setAnswers] = useState(
    SCREENING_QUESTIONS.map(() => ({ answer: 'no' }))
  );

  const setAnswer = (idx, val) => {
    const newAnswers = [...answers];
    newAnswers[idx] = { answer: val };
    setAnswers(newAnswers);
  };

  const handleSave = async () => {
    await saveScreening({ weight, temperature, answers, examType });
  };

  const handleCancel = () => {
    setWeight('');
    setTemperature('37.2');
    setAnswers(SCREENING_QUESTIONS.map(() => ({ answer: 'no' })));
    cancelScreening();
  };

  return (
    <div className="tab-inner">
      {/* Loại khám */}
      <div className="screening-type-row">
        <label className="screening-radio-label">
          <input
            type="radio"
            name="examType"
            value="normal"
            checked={examType === 'normal'}
            onChange={() => setExamType('normal')}
          />
          <span className="screening-radio-dot screening-radio-dot--blue" />
          Khám thường
        </label>
        <label className="screening-radio-label">
          <input
            type="radio"
            name="examType"
            value="covid"
            checked={examType === 'covid'}
            onChange={() => setExamType('covid')}
          />
          <span className="screening-radio-dot screening-radio-dot--pink" />
          Khám tiêm COVID
        </label>
      </div>

      {/* Vitals */}
      <div className="vitals-row">
        <div className="vital-field">
          <label className="field-label">Cân nặng:</label>
          <input
            type="number"
            className="doc-input vital-input"
            placeholder="(Kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <div className="vital-field">
          <label className="field-label">Thân nhiệt:</label>
          <div className="temp-wrap">
            <input
              type="number"
              step="0.1"
              className="doc-input vital-input"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Câu hỏi sàng lọc */}
      <div className="screening-questions">
        {SCREENING_QUESTIONS.map((q, idx) => (
          <div key={idx} className="sq-row">
            <span className="sq-num">{idx + 1}.</span>
            <span className="sq-text">{q}</span>
            <div className="sq-answers">
              <label className="sq-radio-label">
                <input
                  type="radio"
                  name={`q-${idx}`}
                  value="yes"
                  checked={answers[idx]?.answer === 'yes'}
                  onChange={() => setAnswer(idx, 'yes')}
                />
                <span>Có</span>
              </label>
              <label className="sq-radio-label">
                <input
                  type="radio"
                  name={`q-${idx}`}
                  value="no"
                  checked={answers[idx]?.answer === 'no'}
                  onChange={() => setAnswer(idx, 'no')}
                />
                <span>Không</span>
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {success && <div className="tab-alert tab-alert--success">✓ Đã lưu phiếu khám sàng lọc thành công!</div>}
      {error && <div className="tab-alert tab-alert--error">⚠ {error}</div>}

      {/* Footer */}
      <div className="tab-footer">
        <button className="btn-ghost" onClick={handleCancel} disabled={saving}>
          Hủy phiếu
        </button>
        <button className="btn-solid" onClick={handleSave} disabled={saving}>
          {saving ? 'Đang lưu...' : '💾 Lưu phiếu'}
        </button>
      </div>
    </div>
  );
};

export default ScreeningTab;