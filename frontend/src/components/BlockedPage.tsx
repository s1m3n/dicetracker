interface BlockedPageProps {
  onSignOut: () => Promise<void>;
}

export const BlockedPage = ({ onSignOut }: BlockedPageProps) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
    }}>
      <div style={{
        maxWidth: '500px',
        textAlign: 'center',
      }}>
        <h1 style={{ color: '#d32f2f', marginBottom: '1rem' }}>
          Access Blocked
        </h1>
        <p style={{ marginBottom: '2rem', color: '#666', fontSize: '18px' }}>
          Your account has been blocked from accessing this application.
          Please contact the administrator if you believe this is an error.
        </p>

        <button
          onClick={onSignOut}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};
