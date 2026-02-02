'use client'

export const LogoutButton = () => {
  const handleLogout = () => {
    window.location.href = '/admin/logout'
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: '8px 16px',
        backgroundColor: '#dc2626',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '500',
      }}
    >
      Logout
    </button>
  )
}
