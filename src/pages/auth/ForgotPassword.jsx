import { ArrowLeft, KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../../services/api';
import PageTransition from '../../components/common/PageTransition';
import './ForgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ busy: false, msg: '', token: '' });

  const submit = async (e) => {
    e.preventDefault();
    setState({ busy: true, msg: '', token: '' });

    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setState({
        busy: false,
        msg: data.message,
        token: data.devResetToken || ''
      });
    } catch (err) {
      setState({
        busy: false,
        msg: getErrorMessage(err),
        token: ''
      });
    }
  };

  return (
    <PageTransition>
      <section className="auth-simple recovery-page">
        <div className="recovery-shell">
          <aside className="recovery-aside">
            <div className="recovery-aside-glow" />
            <span className="recovery-icon" aria-hidden="true">
              <ShieldCheck />
            </span>

            <div className="recovery-aside-copy">
              <span className="recovery-eyebrow">ACCOUNT RECOVERY</span>
              <h1>Get back to your fandom universe.</h1>
              <p>
                Request a secure reset link and create a new password without
                exposing your account credentials.
              </p>
            </div>

            <div className="recovery-steps" aria-label="Password reset steps">
              <span><b>01</b> Enter email</span>
              <span><b>02</b> Open reset link</span>
              <span><b>03</b> Set new password</span>
            </div>
          </aside>

          <form className="auth-card recovery-card" onSubmit={submit}>
            <div className="recovery-card-head">
              <span className="auth-icon recovery-key-icon">
                <KeyRound />
              </span>
              <div>
                <span className="recovery-kicker">SECURE RESET</span>
                <h2>Reset your password</h2>
              </div>
            </div>

            <p className="recovery-description">
              Enter your registered email and we’ll generate a secure password
              reset request. Production never exposes reset tokens.
            </p>

            <label className="recovery-field">
              <span>Email address</span>
              <div className="recovery-input-wrap">
                <Mail size={18} aria-hidden="true" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            {state.msg && (
              <div className="form-alert success recovery-alert">
                {state.msg}
              </div>
            )}

            {state.token && (
              <div className="dev-token recovery-dev-token">
                <strong>Development reset link</strong>
                <span>Available only for local testing.</span>
                <Link to={`/reset-password/${state.token}`}>
                  Continue to password reset
                </Link>
              </div>
            )}

            <button
              className="button primary full recovery-submit"
              disabled={state.busy}
            >
              <KeyRound size={17} />
              {state.busy ? 'Generating…' : 'Generate reset link'}
            </button>

            <Link className="recovery-back-link" to="/login">
              <ArrowLeft size={16} />
              Back to sign in
            </Link>
          </form>
        </div>
      </section>
    </PageTransition>
  );
}
