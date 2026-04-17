import { useScrollAnimation } from '../../hooks/useScrollAnimation';

function TimelineItem({ periode, deskripsi, index }) {
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        marginBottom: '40px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(-40px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        transitionDelay: `${index * 0.1}s`,
      }}
    >
      <div style={{
        minWidth: '16px',
        height: '16px',
        borderRadius: '50%',
        backgroundColor: '#1a3a6b',
        marginTop: '4px',
      }} />

      <div>
        <h4 style={{
          margin: '0 0 4px',
          fontWeight: '600',
          color: '#1a3a6b',
          fontSize: '18px',
        }}>
          {periode}
        </h4>
        <p style={{ margin: 0, color: '#444', fontSize: '15px' }}>
          {deskripsi}
        </p>
      </div>
    </div>
  );
}

export default TimelineItem;