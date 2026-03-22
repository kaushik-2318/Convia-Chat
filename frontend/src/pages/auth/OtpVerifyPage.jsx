import AuthHeader from '@/components/auth/AuthHeader';
import { GlassCard } from '@/components/common/GlassCard';
import { MotionDiv } from '@/components/common/MotionWrapper';
import { ArrowRight, RefreshCw, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@heroui/button';
import { useVerifyOTPMutation, useResendOtpMutation } from '@/services/api';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/redux/slice/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { useToast } from '@/components/common/Toast';

export default function OtpVerifyPage() {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const [verifyOtpMutation, { isLoading }] = useVerifyOTPMutation();
  const [resendOtpMutation, { isLoading: isResendLoading }] = useResendOtpMutation();
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //#Captcha
  // const recaptchaV2Ref = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length < 6) return;

    try {
      // #Captcha
      // const recaptchaToken = await recaptchaV2Ref.current.executeAsync();
      const resp = await verifyOtpMutation({ otp, recaptchaToken: '' }).unwrap();
      if (resp?.success) {
        dispatch(loginSuccess({ user: resp.data.user, token: resp.data.user.token }));
        toast.success('OTP Verified.');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error?.data?.error?.message || 'Verification failed');
    }
  };

  const handleResend = async () => {
    try {
      const resp = await resendOtpMutation().unwrap();
      if (resp?.success) {
        toast.success(resp?.message);
        setTimer(60);
      }
    } catch (error) {
      setTimer(error?.data?.error?.data?.timeLeft || timer);
      toast.error(error?.data?.error?.message || 'Resend failed');
    }
  };

  return (
    <MotionDiv
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="flex h-full w-full items-center justify-center p-5"
    >
      <GlassCard color={'#6366f1'} variant={'transparent'} className={'w-full max-w-md py-6'}>
        <div className="flex flex-col items-center justify-center px-5 sm:px-10">
          <AuthHeader />

          <div className="my-6 text-center text-sm text-slate-300 sm:text-lg">Please enter the four digit verification code we sent to your email.</div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="">
              <InputOTP
                disabled={isResendLoading || isLoading}
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && otp.length > 0) {
                    setOtp((prev) => prev.slice(0, -1));
                  }
                }}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <div className="w-full">
              <Button
                disabled={isLoading || otp.length < 6 || isResendLoading}
                type="submit"
                className="from-indigo via-pink to-purple flex h-14 w-full flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-indigo-500/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Verify'}
              </Button>
            </div>
            {/* #Captcha */}
            {/* <ReCAPTCHA ref={recaptchaV2Ref} sitekey={import.meta.env.VITE_RECAPTCHA_CLIENT} size="invisible" /> */}
          </form>

          <div className="mt-6 flex w-full items-center justify-between text-sm text-slate-500">
            <div className="cursor-pointer transition-colors duration-300 hover:text-slate-300" onClick={() => navigate('/auth/login')}>
              Change Email
            </div>
            <div className={`transition-colors duration-300 ${timer > 0 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:text-slate-300'}`} onClick={timer > 0 ? undefined : handleResend}>
              {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
            </div>
          </div>
        </div>
      </GlassCard>
    </MotionDiv>
  );
}
