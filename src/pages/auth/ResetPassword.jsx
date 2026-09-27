import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../../services/api';
import PageTransition from '../../components/common/PageTransition';
import './ResetPassword.css';

export default function ResetPassword() {
  const { token } = useParams();
  const nav = useNavigate();

  const [form, setForm] = useState({
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [state, setState] = useState({
    busy: false,
    msg: ''
  });

  const passwordChecks = useMemo(() => ({
    length: form.password.length >= 8,
    uppercase: /[A-Z]/.test(form.password),
    number: /\d/.test(form.password),
    special: /[^A-Za-z0-9]/.test(form.password)
  }), [form.password]);

  const passedChecks = Object.values(passwordChecks).filter(Boolean).length;
  const strength = form.password
    ? Math.max(1, Math.min(4, passedChecks))
    : 0;

  const passwordsMatch =
    form.confirmPassword.length > 0 &&
    form.password === form.confirmPassword;

  const submit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setState({
        busy: false,
        msg: 'Passwords do not match.'
      });
      return;
    }

    setState({ busy: true, msg: '' });

    try {
      const { data } = await api.put(
        `/auth/reset-password/${token}`,
        form
      );

      if (data.token) {
        localStorage.setItem('fanhub_token', data.token);
      }

      if (data.user) {
        localStorage.setItem(
          'fanhub_user',
          JSON.stringify(data.user)
        );
      }

      nav('/dashboard');
    } catch (err) {
      setState({
        busy: false,
        msg: getErrorMessage(err)
      });
    }
  };

  return (
    <PageTransition>
      <section className="auth-simple reset-page">
        <div className="reset-shell">
          <aside className="reset-aside">
            <div className="reset-aside-glow" />

            <span className="reset-security-icon" aria-hidden="true">
              <ShieldCheck />
            </span>

            <div className="reset-aside-copy">
              <span className="reset-eyebrow">
                SECURE ACCOUNT
              </span>

              <h1>
                Choose a new password.
              </h1>

              <p>
                Create a strong password to secure your Fan Hub Plus
                account and get back to your fandom universe.
              </p>
            </div>

            <div
              className="reset-steps"
              aria-label="Password reset progress"
            >
              <span className="complete">
                <b>01</b>
                <span>
                  <strong>Verify reset link</strong>
                  <small>Secure request confirmed</small>
                </span>
                <Check size={15} />
              </span>

              <span className="active">
                <b>02</b>
                <span>
                  <strong>Enter new password</strong>
                  <small>Create your new credential</small>
                </span>
              </span>

              <span>
                <b>03</b>
                <span>
                  <strong>Sign in again</strong>
                  <small>Continue to your account</small>
                </span>
              </span>
            </div>
          </aside>

          <form
            className="auth-card reset-card"
            onSubmit={submit}
          >
            <div className="reset-card-head">
              <span className="auth-icon reset-lock-icon">
                <LockKeyhole />
              </span>

              <div>
                <span className="reset-kicker">
                  SECURE RESET
                </span>
                <h2>Choose a new password</h2>
              </div>
            </div>

            <p className="reset-description">
              Use a strong password you haven’t used before.
              Your new password will replace the old one immediately.
            </p>

            <label className="reset-field">
              <span>New password</span>

              <div className="reset-password-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  minLength={6}
                  required
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value
                    })
                  }
                  placeholder="Enter new password"
                />

                <button
                  type="button"
                  className="reset-eye-button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </label>

            <div
              className={`reset-strength strength-${strength}`}
              aria-live="polite"
            >
              <div className="reset-strength-bars">
                {[1, 2, 3, 4].map((item) => (
                  <span
                    key={item}
                    className={
                      strength >= item ? 'active' : ''
                    }
                  />
                ))}
              </div>

              <span>
                {!form.password
                  ? 'Password strength'
                  : strength <= 1
                    ? 'Basic'
                    : strength === 2
                      ? 'Fair'
                      : strength === 3
                        ? 'Good'
                        : 'Strong'}
              </span>
            </div>

            <div className="reset-checks">
              <span className={passwordChecks.length ? 'pass' : ''}>
                <Check size={13} />
                8+ characters
              </span>
              <span className={passwordChecks.uppercase ? 'pass' : ''}>
                <Check size={13} />
                Uppercase letter
              </span>
              <span className={passwordChecks.number ? 'pass' : ''}>
                <Check size={13} />
                Number
              </span>
              <span className={passwordChecks.special ? 'pass' : ''}>
                <Check size={13} />
                Special character
              </span>
            </div>

            <label className="reset-field reset-confirm-field">
              <span>Confirm password</span>

              <div className="reset-password-wrap">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  minLength={6}
                  required
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      confirmPassword: e.target.value
                    })
                  }
                  placeholder="Confirm new password"
                />

                <button
                  type="button"
                  className="reset-eye-button"
                  onClick={() =>
                    setShowConfirm((value) => !value)
                  }
                  aria-label={
                    showConfirm
                      ? 'Hide confirm password'
                      : 'Show confirm password'
                  }
                >
                  {showConfirm ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {form.confirmPassword && (
                <small
                  className={`reset-match ${
                    passwordsMatch ? 'match' : 'mismatch'
                  }`}
                >
                  {passwordsMatch
                    ? 'Passwords match'
                    : 'Passwords do not match'}
                </small>
              )}
            </label>

            {state.msg && (
              <div className="form-alert error reset-alert">
                {state.msg}
              </div>
            )}

            <button
              className="button primary full reset-submit"
              disabled={
                state.busy ||
                !form.password ||
                !passwordsMatch
              }
            >
              <LockKeyhole size={17} />
              {state.busy
                ? 'Updating…'
                : 'Reset password'}
            </button>

            <Link
              className="reset-back-link"
              to="/login"
            >
              <ArrowLeft size={16} />
              Back to sign in
            </Link>
          </form>
        </div>
      </section>
    </PageTransition>
  );
}
