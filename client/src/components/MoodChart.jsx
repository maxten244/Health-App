export default function MoodChart({ data, title = 'Mood trend' }) {
  if (!data?.length) {
    return (
      <div className="card mood-chart" role="region" aria-label={title}>
        <h3>{title}</h3>
        <p className="text-muted">No data to display yet.</p>
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.average));
  const min = Math.min(...data.map((d) => d.average));

  return (
    <div className="card mood-chart" role="region" aria-label={title}>
      <h3>{title}</h3>
      <div className="chart-bars" role="img" aria-label={`Chart showing mood average by period. Values from ${min.toFixed(1)} to ${max.toFixed(1)}.`}>
        {data.map((item) => (
          <div key={item.period} className="chart-bar-wrap">
            <div
              className="chart-bar"
              style={{
                height: `${((item.average - 1) / 9) * 100}%`,
              }}
              title={`${item.period}: ${item.average.toFixed(1)}`}
            />
            <span className="chart-label">{item.period}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
