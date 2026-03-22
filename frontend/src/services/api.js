import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout, setCredentials } from '../redux/slice/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/',
  reducerPath: 'api',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (
    result.error &&
    result.error.status === 401 &&
    (result.error.data?.error?.code === 'TOKEN_EXPIRED' || result.error.data?.error?.code === 'INVALID_TOKEN' || result.error.data?.code === 'TOKEN_EXPIRED')
  ) {
    const refreshResult = await baseQuery('/auth/refresh-token', api, extraOptions);
    if (refreshResult.data) {
      api.dispatch(setCredentials({ user: refreshResult.data.data.user }));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,

  endpoints: (builder) => ({
    checkEmail: builder.mutation({
      query: (body) => ({
        url: '/auth/check-email',
        method: 'POST',
        body,
      }),
    }),
    register: builder.mutation({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    login: builder.mutation({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    sendOtp: builder.mutation({
      query: (body) => ({
        url: '/auth/send-otp',
        method: 'POST',
        body,
      }),
    }),
    verifyOTP: builder.mutation({
      query: (body) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body,
      }),
    }),
    resendOtp: builder.mutation({
      query: (body) => ({
        url: '/auth/resend-otp',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useCheckEmailMutation, useRegisterMutation, useLoginMutation, useSendOtpMutation, useVerifyOTPMutation, useResendOtpMutation } = api;
