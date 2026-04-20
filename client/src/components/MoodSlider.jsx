import { useRef, useEffect } from 'react';

const LABELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export default function MoodSlider({ value, onChange, disabled, ariaLabel = 'Mood score from 1 to 10' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.value = value;
  }, [value]);

  return (
    <div className="mood-slider-wrap">
      <label id="mood-slider-label" className="visually-hidden">
        {ariaLabel}
      </label>
      <input
        ref={ref}
        type="range"
        min={1}
        max={10}
        step={1}
        defaultValue={value ?? 5}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-valuemin={1}
        aria-valuemax={10}
        aria-valuenow={value ?? 5}
        aria-valuetext={`Mood ${value ?? 5} out of 10`}
        className="mood-slider"
      />
      <div className="mood-slider-labels" role="presentation" aria-hidden="true">
        {LABELS.map((n) => (
          <span key={n} className={Number(n) === (value ?? 5) ? 'active' : ''}>
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}
