import { useState, useEffect } from 'react';
import { useSequencesStore } from '../store/sequencesStore';
import {
  Zap, Plus, Play, Pause, Trash2, Edit2,
  Clock, Mail, MessageSquare, Users, ChevronRight,
  CheckCircle, Activity, X
} from 'lucide-react';

const STEP_ICONS = { email: Mail, sms: MessageSquare, wait: Clock };
const STEP_COLORS = { email: '#3b82f6', sms: '#10b981', wait: '#f59e0b' };
const STEP_BG = { email: '#dbeafe', sms: '#d1fae5', wait: '#fef3c7' };

export default function SequencesPage() {
  const { sequences, getSequences, createSequence, deleteSequence, toggleSequence, loading } = useSequencesStore();
  const [showModal, setShowModal] = useState(false);
  const [newSeq, setNewSeq] = useState({ name: '', description: '', steps: [] });
  const [selectedSeq, setSelectedSeq] = useState(null);

  useEffect(() => { getSequences(); }, []);

  const handleCreate = async () => {
    try {
      await createSequence(newSeq);
      setShowModal(false);
      setNewSeq({ name: '', description: '', steps: [] });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this sequence?')) {
      try { await deleteSequence(id); } catch (err) { console.error(err); }
    }
  };

  const metricCards = [
    { label: 'Total Sequences', value: sequences.length, sub: 'All sequences', icon: Zap, color: '#7c3aed', bg: '#f3e8ff' },
    { label: 'Active',  value: sequences.filter(s => s.isActive).length, sub: 'Running now', icon: Activity, color: '#10b981', bg: '#d1fae5' },
    { label: 'Enrolled Leads', value: sequences.reduce((a, s) => a + (s.enrolledCount || 0), 0), sub: 'Total enrolled', icon: Users, color: '#3b82f6', bg: '#dbeafe' },
    { label: 'Completed', value: sequences.reduce((a, s) => a + (s.completedCount || 0), 0), sub: 'Finished sequences', icon: CheckCircle, color: '#f59e0b', bg: '#fef3c7' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
        borderRadius: '16px',
        padding: '28px 36px',
        color: 'white',
        boxShadow: '0 8px 32px rgba(124,58,237,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', margin: '0 0 6px 0', color: 'white' }}>
            Follow-Up Sequences
          </h1>
          <p style={{ margin: 0, opacity: 0.85, fontSize: '14px' }}>
            Automate your lead follow-ups with multi-step sequences
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'white', color: '#7c3aed',
            border: 'none', borderRadius: '10px',
            padding: '10px 20px', fontSize: '14px', fontWeight: '700',
            cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <Plus size={16} /> New Sequence
        </button>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} style={{
              background: 'white', borderRadius: '12px', padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6',
              display: 'flex', alignItems: 'flex-start', gap: '14px',
            }}>
              <div style={{
                width: '46px', height: '46px', background: card.bg,
                borderRadius: '10px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={22} color={card.color} />
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</p>
                <p style={{ fontSize: '26px', fontWeight: '700', color: '#111827', margin: '0 0 3px 0', lineHeight: 1 }}>{card.value}</p>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sequences Grid */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
          Loading sequences...
        </div>
      ) : sequences.length === 0 ? (
        <div style={{
          background: 'white', borderRadius: '12px', padding: '60px 40px',
          border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          textAlign: 'center',
        }}>
          <div style={{
            width: '64px', height: '64px', background: '#f3e8ff', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
          }}>
            <Zap size={28} color="#7c3aed" />
          </div>
          <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 6px 0' }}>No sequences yet</p>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px 0' }}>
            Create your first sequence to automate follow-ups with leads
          </p>
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: '#7c3aed', color: 'white', border: 'none',
              borderRadius: '8px', padding: '10px 20px', fontSize: '14px',
              fontWeight: '600', cursor: 'pointer',
            }}
          >
            <Plus size={15} /> Create First Sequence
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {sequences.map((seq) => (
            <div key={seq.id || seq._id} style={{
              background: 'white', borderRadius: '12px', padding: '20px',
              border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '40px', height: '40px', background: '#f3e8ff',
                    borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Zap size={18} color="#7c3aed" />
                  </div>
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: '700', color: '#111827', margin: 0 }}>{seq.name}</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{seq.steps?.length || 0} steps</p>
                  </div>
                </div>
                <span style={{
                  padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                  background: seq.isActive ? '#d1fae5' : '#f3f4f6',
                  color: seq.isActive ? '#10b981' : '#9ca3af',
                }}>
                  {seq.isActive ? '● Active' : '○ Paused'}
                </span>
              </div>

              {seq.description && (
                <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 14px 0', lineHeight: '1.5' }}>{seq.description}</p>
              )}

              {/* Step Preview */}
              {seq.steps?.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
                  {seq.steps.slice(0, 4).map((step, i) => {
                    const StepIcon = STEP_ICONS[step.type] || Mail;
                    return (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        padding: '3px 8px', borderRadius: '6px',
                        background: STEP_BG[step.type] || '#f3f4f6',
                        fontSize: '11px', fontWeight: '600',
                        color: STEP_COLORS[step.type] || '#6b7280',
                      }}>
                        <StepIcon size={11} />
                        {step.type?.charAt(0).toUpperCase() + step.type?.slice(1)}
                      </div>
                    );
                  })}
                  {seq.steps.length > 4 && (
                    <span style={{ fontSize: '11px', color: '#9ca3af', padding: '3px 6px' }}>+{seq.steps.length - 4} more</span>
                  )}
                </div>
              )}

              {/* Stats */}
              <div style={{ display: 'flex', gap: '16px', padding: '12px 0', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6', marginBottom: '14px' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 2px 0', fontWeight: '600', textTransform: 'uppercase' }}>Enrolled</p>
                  <p style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: 0 }}>{seq.enrolledCount || 0}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 2px 0', fontWeight: '600', textTransform: 'uppercase' }}>Completed</p>
                  <p style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: 0 }}>{seq.completedCount || 0}</p>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => toggleSequence && toggleSequence(seq.id || seq._id)}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    padding: '8px', border: '1px solid #e5e7eb', borderRadius: '8px',
                    background: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                    color: seq.isActive ? '#f59e0b' : '#10b981',
                  }}
                >
                  {seq.isActive ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Activate</>}
                </button>
                <button
                  onClick={() => setSelectedSeq(seq)}
                  style={{
                    width: '36px', height: '36px', border: '1px solid #e5e7eb', borderRadius: '8px',
                    background: 'white', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                ><Edit2 size={14} color="#6b7280" /></button>
                <button
                  onClick={() => handleDelete(seq.id || seq._id)}
                  style={{
                    width: '36px', height: '36px', border: '1px solid #fee2e2', borderRadius: '8px',
                    background: '#fff5f5', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                ><Trash2 size={14} color="#ef4444" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Sequence Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px',
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '32px',
            width: '100%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: '0 0 6px 0' }}>New Sequence</h2>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 24px 0' }}>Set up an automated follow-up sequence</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Sequence Name</label>
                <input
                  value={newSeq.name}
                  onChange={e => setNewSeq(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. New Lead Welcome"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', color: '#111827', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Description</label>
                <textarea
                  value={newSeq.description}
                  onChange={e => setNewSeq(p => ({ ...p, description: e.target.value }))}
                  placeholder="Describe what this sequence does..."
                  rows={3}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', color: '#111827', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ flex: 1, padding: '11px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#374151', background: 'white', cursor: 'pointer' }}
              >Cancel</button>
              <button
                onClick={handleCreate}
                style={{ flex: 1, padding: '11px', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', color: 'white', background: '#7c3aed', cursor: 'pointer' }}
              >Create Sequence</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
