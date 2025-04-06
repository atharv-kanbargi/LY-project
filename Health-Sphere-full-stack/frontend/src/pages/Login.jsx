import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  // Main states for controlling the UI view
  const [state, setState] = useState('Sign Up')
  const [showVerification, setShowVerification] = useState(false)
  
  // Input fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  
  // For verification process
  const [userId, setUserId] = useState('')
  const [isResending, setIsResending] = useState(false)
  
  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  const handleSignUp = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })
      
      if (data.success) {
        toast.success(data.message)
        setUserId(data.userId)
        setShowVerification(true)
        
        // For testing: Display email preview link if available
        if (data.previewUrl) {
          console.log('Email preview URL:', data.previewUrl)
          toast.info('Check console for email preview URL')
        }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('An error occurred while registering')
      console.error(error)
    }
  }

  const handleLogin = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })
      
      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        toast.success('Logged in successfully')
      } else if (data.requireVerification) {
        toast.info(data.message)
        setUserId(data.userId)
        setShowVerification(true)
        
        // For testing: Display email preview link if available
        if (data.previewUrl) {
          console.log('Email preview URL:', data.previewUrl)
          toast.info('Check console for email preview URL')
        }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('An error occurred while logging in')
      console.error(error)
    }
  }

  const handleVerifyOTP = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/verify-email', { userId, otp })
      
      if (data.success) {
        toast.success(data.message)
        localStorage.setItem('token', data.token)
        setToken(data.token)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('An error occurred during verification')
      console.error(error)
    }
  }

  const handleResendOTP = async () => {
    try {
      setIsResending(true)
      const { data } = await axios.post(backendUrl + '/api/user/resend-otp', { userId })
      
      if (data.success) {
        toast.success(data.message)
        
        // For testing: Display email preview link if available
        if (data.previewUrl) {
          console.log('Email preview URL:', data.previewUrl)
          toast.info('Check console for email preview URL')
        }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('An error occurred while resending OTP')
      console.error(error)
    } finally {
      setIsResending(false)
    }
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    if (showVerification) {
      handleVerifyOTP()
    } else if (state === 'Sign Up') {
      handleSignUp()
    } else {
      handleLogin()
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  const renderVerificationForm = () => (
    <div className='w-full'>
      <p className='text-2xl font-semibold'>Email Verification</p>
      <p className='mb-4'>Please enter the OTP sent to your email</p>
      
      <div className='w-full mb-4'>
        <p>OTP</p>
        <input 
          onChange={(e) => setOtp(e.target.value)} 
          value={otp} 
          className='border border-[#DADADA] rounded w-full p-2 mt-1' 
          type="text" 
          maxLength="6"
          required 
        />
      </div>
      
      <button 
        className='bg-primary text-white w-full py-2 my-2 rounded-md text-base'
      >
        Verify Email
      </button>
      
      <button 
        onClick={handleResendOTP} 
        disabled={isResending}
        type="button"
        className='bg-gray-100 text-gray-700 w-full py-2 my-2 rounded-md text-base'
      >
        {isResending ? 'Sending...' : 'Resend OTP'}
      </button>
      
      <button 
        onClick={() => setShowVerification(false)} 
        type="button"
        className='text-primary underline cursor-pointer mt-2'
      >
        Back to {state}
      </button>
    </div>
  )

  const renderAuthForm = () => (
    <>
      <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
      <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment</p>
      
      {state === 'Sign Up' && (
        <div className='w-full'>
          <p>Full Name</p>
          <input 
            onChange={(e) => setName(e.target.value)} 
            value={name} 
            className='border border-[#DADADA] rounded w-full p-2 mt-1' 
            type="text" 
            required 
          />
        </div>
      )}
      
      <div className='w-full'>
        <p>Email</p>
        <input 
          onChange={(e) => setEmail(e.target.value)} 
          value={email} 
          className='border border-[#DADADA] rounded w-full p-2 mt-1' 
          type="email" 
          required 
        />
      </div>
      
      <div className='w-full'>
        <p>Password</p>
        <input 
          onChange={(e) => setPassword(e.target.value)} 
          value={password} 
          className='border border-[#DADADA] rounded w-full p-2 mt-1' 
          type="password" 
          required 
        />
      </div>
      
      <button className='bg-primary text-white w-full py-2 my-2 rounded-md text-base'>
        {state === 'Sign Up' ? 'Create account' : 'Login'}
      </button>
      
      {state === 'Sign Up' ? (
        <p>Already have an account? <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>Login here</span></p>
      ) : (
        <p>Create a new account? <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>Click here</span></p>
      )}
    </>
  )

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        {showVerification ? renderVerificationForm() : renderAuthForm()}
      </div>
    </form>
  )
}

export default Login