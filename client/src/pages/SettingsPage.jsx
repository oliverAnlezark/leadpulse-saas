import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { User, Link2, Shield, Save, Plus, Trash2, CheckCircle, Zap } from 'lucide-react';

export default function SettingsPage() {
  const { agent, setAgent } = useAuthStore();
  const [profile, setProfile] = useState({
    fullName: agent?.fullName || '',
    companyName: agent?.companyName || '',
    phone: agent?.phone || '',
    timezone: agent?.timezone || 'Australia/Sydney',
    aiResponseTemplate: agent?.aiResponseTemplate || '',
  });
  const [integrations, setIntegrations] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showIntModal, setShowIntModal] = useState(false);
  const [newInt, setNewInt] = useState({ name: '', type: 'webhook', url: '' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchInts = async () => {
      try {
        const res = await axios.get('/api/integrations', { headers: { Authorization: `Bearer ${token}` } });
        setIntegrations(res.data || []);
      } catch { setIntegrations([]); }
    };
    if (token) fetchInts();
  }, [token]);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await axios.put('/api/agents/profile', profile, { headers: { Authorization: `Bearer ${token}` } });
      if (setAgent) setAgent(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const addIntegration = async () => {
    try {
      await axios.post('/api/integrations', newInt, { headers: { Authorization: `Bearer ${token}` } });
      setShowIntModal(false);
      setNewInt({ name: '', type: 'webhook', url: '' });
      const res = await axios.get('/api/integrations', { headers: { Authorization: `Bearer ${token}` } });
      setIntegrations(res.data || []);
    } catch (err) { console.error(err); }
  };

  const deleteIntegration = async (id) => {
    if (!window.confirm('Delete this integration?')) return;
    try {
      await axios.delete(`/api/integrations/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setIntegrations(prev => prev.filter(i => i._id !== id && i.id !== id));
    } catch (err) { console.error(err); }
  };

  const inp = { width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', color: '#111827', outline: 'none', boxSizing: 'border-box', background: 'white' };
  const lbl = { fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', borderRadius: '16px', padding: '28px 36px', color: 'white', boxShadow: '0 8px 32px rgba(124,58,237,0.2)' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', margin: '0 0 6px 0', color: 'white' }}>Settings</h1>
        <p style={{ margin: 0, opacity: 0.85, fontSize: '14px' }}>Manage your account, integrations, and AI configuration</p>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', padding: '28px', border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <div style={{ width: '36px', height: '36px', background: '#f3e8ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={18} color="#7c3aed" />
          </div>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: 0 }}>Profile Settings</h2>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Update your personal and business information</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div><label style={lbl}>Full Name</label><input value={profile.fullName} onChange={e => setProfile(p => ({ ...p, fullName: e.target.value }))} placeholder="Your full name" style={inp} /></div>
          <div><label style={lbl}>Company Name</label><input value={profile.companyName} onChange={e => setProfile(p => ({ ...p, companyName: e.target.value }))} placeholder="Your agency name" style={inp} /></div>
          <div><label style={lbl}>Phone</label><input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="+61 400 000 000" style={inp} /></div>
          <div>
            <label style={lbl}>Timezone</label>
            <select value={profile.timezone} onChange={e => setProfile(p => ({ ...p, timezone: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}>
              <option value="Australia/Sydney">Australia/Sydney</option>
              <option value="Australia/Melbourne">Australia/Melbourne</option>
              <option value="Australia/Brisbane">Australia/Brisbane</option>
              <option value="Australia/Perth">Australia/Perth</option>
              <option value="Australia/Adelaide">Australia/Adelaide</option>
            </select>
          </div>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={lbl}>AI Response Template</label>
          <textarea value={profile.aiResponseTemplate} onChange={e => setProfile(p => ({ ...p, aiResponseTemplate: e.target.value }))} placeholder="Customize how the AI responds to leads. Use variables like {firstName}, {propertyType}, {budget}..." rows={4} style={{ ...inp, resize: 'vertical', lineHeight: '1.5' }} />
          <p style={{ fontSize: '12px', color: '#9ca3af', margin: '6px 0 0 0' }}>Available variables: {'{firstName}'}, {'{propertyType}'}, {'{budget}'}, {'{agentName}'}</p>
        </div>
        <button onClick={saveProfile} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', border: 'none', borderRadius: '8px', background: saved ? '#10b981' : '#7c3aed', color: 'white', fontSize: '14px', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 0.2s ease' }}>
          {saved ? <><CheckCircle size={16} /> Saved!</> : saving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', padding: '28px', border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', background: '#dbeafe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Link2 size={18} color="#3b82f6" />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: 0 }}>CRM Integrations</h2>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Connect your CRM to sync leads automatically</p>
            </div>
          </div>
          <button onClick={() => setShowIntModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', border: 'none', borderRadius: '8px', background: '#7c3aed', color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
            <Plus size={15} /> Add Integration
          </button>
        </div>
        {integrations.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', background: '#f9fafb', borderRadius: '10px', border: '1px dashed #e5e7eb' }}>
            <div style={{ width: '48px', height: '48px', background: '#f3e8ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Link2 size={22} color="#7c3aed" />
            </div>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: '0 0 4px 0' }}>No integrations configured yet</p>
            <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>Connect your CRM to sync leads automatically</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {integrations.map((int) => (
              <div key={int._id || int.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#f9fafb', borderRadius: '10px', border: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', background: '#dbeafe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={16} color="#3b82f6" />
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>{int.name}</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0, textTransform: 'capitalize' }}>{int.type}</p>
                  </div>
                </div>
                <button onClick={() => deleteIntegration(int._id || int.id)} style={{ width: '32px', height: '32px', border: '1px solid #fee2e2', borderRadius: '6px', background: '#fff5f5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={14} color="#ef4444" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '18px 20px', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <Shield size={18} color="#3b82f6" style={{ flexShrink: 0, marginTop: '1px' }} />
        <div>
          <p style={{ fontSize: '14px', fontWeight: '700', color: '#1d4ed8', margin: '0 0 3px 0' }}>Security Notice</p>
          <p style={{ fontSize: '13px', color: '#3b82f6', margin: 0 }}>Your API keys and secrets are encrypted and stored securely. Never share your credentials with anyone.</p>
        </div>
      </div>

      {showIntModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: '0 0 6px 0' }}>Add Integration</h2>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 24px 0' }}>Connect a new CRM or webhook integration</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[{ key: 'name', label: 'Integration Name', placeholder: 'e.g. REA Group Webhook' }, { key: 'url', label: 'Webhook URL', placeholder: 'https://...' }].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label style={lbl}>{label}</label>
                  <input value={newInt[key]} onChange={e => setNewInt(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} style={inp} />
                </div>
              ))}
              <div>
                <label style={lbl}>Type</label>
                <select value={newInt.type} onChange={e => setNewInt(p => ({ ...p, type: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}>
                  <option value="webhook">Webhook</option>
                  <option value="crm">CRM</option>
                  <option value="email">Email</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <button onClick={() => setShowIntModal(false)} style={{ flex: 1, padding: '11px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#374151', background: 'white', cursor: 'pointer' }}>Cancel</button>
              <button onClick={addIntegration} style={{ flex: 1, padding: '11px', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', color: 'white', background: '#7c3aed', cursor: 'pointer' }}>Add Integration</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
