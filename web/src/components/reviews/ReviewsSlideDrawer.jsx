import { useEffect } from "react";
import { X, Star } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Maria S.',
    rating: 5,
    date: '2 weeks ago',
    text: 'BHH has been a blessing for my elderly mother. The caregivers are professional, kind, and always on time. I can finally have peace of mind knowing she\'s in good hands.',
  },
  {
    id: 2,
    name: 'James T.',
    rating: 5,
    date: '1 month ago',
    text: 'Outstanding service! The transportation help for my medical appointments has made such a difference. Drivers are courteous and the scheduling is seamless.',
  },
  {
    id: 3,
    name: 'Patricia L.',
    rating: 5,
    date: '1 month ago',
    text: 'As a family caregiver, I needed respite care support. BHH matched us with wonderful helpers who truly care. Highly recommend their services!',
  },
  {
    id: 4,
    name: 'Robert K.',
    rating: 4,
    date: '2 months ago',
    text: 'Very reliable home care services. The team is responsive and always follows up to ensure everything is going well. Great communication throughout.',
  },
  {
    id: 5,
    name: 'Linda M.',
    rating: 5,
    date: '2 months ago',
    text: 'The companion care service has been wonderful for my father who lives alone. His caregiver has become like family. Thank you BHH!',
  },
  {
    id: 6,
    name: 'David H.',
    rating: 5,
    date: '3 months ago',
    text: 'Professional and compassionate care. The entire process from signup to receiving care was smooth. Their customer support is excellent.',
  }
];

export default function ReviewsSlideDrawer({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div>
            <div style={styles.title}>Reviews</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#0b2a4a' }}>4.9</span>
              <div style={{ display: 'flex' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} style={{ width: 14, height: 14, color: '#fbbf24', fill: '#fbbf24' }} />
                ))}
              </div>
              <span style={{ fontSize: 13, color: '#6b7280' }}>Verified feedback</span>
            </div>
          </div>
          <button style={styles.close} onClick={onClose} aria-label="Close reviews">
            <X style={{ width: 20, height: 20 }} />
          </button>
        </div>

        <div style={styles.body}>
          {reviews.map((review) => (
            <div key={review.id} style={styles.reviewCard}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2F80ED, #2BB0A6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: 14
                  }}>
                    {review.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#1F3A5F' }}>{review.name}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{review.date}</div>
                  </div>
                </div>
                <div style={{ display: 'flex' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      style={{ 
                        width: 14, 
                        height: 14, 
                        color: i < review.rating ? '#fbbf24' : '#d1d5db',
                        fill: i < review.rating ? '#fbbf24' : '#d1d5db'
                      }} 
                    />
                  ))}
                </div>
              </div>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>
                {review.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    zIndex: 9999,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  sheet: {
    width: "100%",
    maxWidth: 520,
    height: "75vh",
    background: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    boxShadow: "0 -20px 40px rgba(0,0,0,0.18)",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: "16px 18px",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: 17,
    fontWeight: 800,
    color: "#0b2a4a",
  },
  close: {
    border: "none",
    background: "transparent",
    fontSize: 18,
    cursor: "pointer",
    padding: 6,
    lineHeight: 1,
    color: "#0b2a4a",
  },
  body: {
    padding: 16,
    overflowY: "auto",
    height: "calc(75vh - 80px)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  reviewCard: {
    background: "#f9fafb",
    borderRadius: 12,
    padding: 14,
    border: "1px solid #e5e7eb",
  }
};