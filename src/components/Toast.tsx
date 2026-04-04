import { Toaster } from 'react-hot-toast'

export default function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#0a1628',
          color: '#e5eef8',
          border: '1px solid rgba(0, 200, 200, 0.3)',
        },
      }}
    />
  )
}
