import { SignUp } from '@clerk/nextjs'

const Register = () => {
  return (
    <div className='flex justify-center items-center h-screen'>
      <SignUp/>
    </div>
  )
}

export default Register