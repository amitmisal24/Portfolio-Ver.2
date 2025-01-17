import { Container, ContainerSucces } from './styles'
import { useForm} from '@formspree/react'
import { toast, ToastContainer } from 'react-toastify'
import { useEffect, useState } from 'react'
import validator from 'validator'

export function Form() {
  const [state] = useForm('xknkpqry')
  const [validEmail, setValidEmail] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState<any>({})

  function verifyEmail(email: string) {
    if (validator.isEmail(email)) {
      setValidEmail(true)
    } else {
      setValidEmail(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: any = {}

    // Basic validation checks
    if (!formData.name) newErrors.name = 'Name is required'
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid'
    }
    if (!formData.message) newErrors.message = 'Message is required'

    if (Object.keys(newErrors).length === 0) {
      try {
        // Send data to the backend API
        const response = await fetch('https://backend-portfolio-1-kh3g.onrender.com/api/submitForm', {  // Update URL if deployed
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          toast.success('Form successfully submitted!', {
            position: toast.POSITION.BOTTOM_LEFT,
            pauseOnFocusLoss: false,
            closeOnClick: true,
            hideProgressBar: false,
            toastId: 'succeeded',
          })
          setFormData({ name: '', email: '', message: '' })  // Clear the form
          // Refresh the page after successful submission
          setTimeout(() => {
            window.location.reload()
          }, 2000)  // Delay refresh to allow toast to show

        } else {
          const result = await response.json()
          alert(`Submission failed: ${result.message}`)
        }
      } catch (error) {
        console.error('Error submitting form:', error)
        alert('An error occurred while submitting the form.')
      }
    } else {
      setErrors(newErrors)  // Display validation errors
    }
  }

  useEffect(() => {
    if (state.succeeded) {
      toast.success('Email successfully sent!', {
        position: toast.POSITION.BOTTOM_LEFT,
        pauseOnFocusLoss: false,
        closeOnClick: true,
        hideProgressBar: false,
        toastId: 'succeeded',
      })
      setFormData({ name: '', email: '', message: '' })  // Clear the form
    }
  }, [state.succeeded])

  if (state.succeeded) {
    return (
      <ContainerSucces>
        <h3>Thanks for getting in touch!</h3>
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          Back to the top
        </button>
        <ToastContainer />
      </ContainerSucces>
    )
  }

  return (
    <Container>
      <h2>Get in touch using the form</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          id="name"
          type="text"
          name="name"
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value })
          }}
          required
        />
        {errors.name && <p>{errors.name}</p>}
        
        <input
          placeholder="Email"
          id="email"
          type="email"
          name="email"
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value })
            verifyEmail(e.target.value)
          }}
          required
        />
        {errors.email && <p>{errors.email}</p>}
        
        <textarea
          required
          placeholder="Send a message to get started."
          id="message"
          name="message"
          onChange={(e) => {
            setMessage(e.target.value)
            setFormData({ ...formData, message: e.target.value })
          }}
        />
        {errors.message && <p>{errors.message}</p>}
        
        <button
          type="submit"
          disabled={state.submitting || !validEmail || !message}
        >
          Submit
        </button>
      </form>
      <ToastContainer />
    </Container>
  )
}
