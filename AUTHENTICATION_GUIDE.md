# Authentication Toggle Guide

This application currently bypasses authentication and goes directly to the dashboard. Here's how to restore login/registration functionality when needed:

## Quick Toggle Method (Recommended)

1. **Open `src/App.tsx`**
2. **Find this line:**
   ```typescript
   const ENABLE_AUTH = false; // Set to true to enable login/registration forms
   ```
3. **Change it to:**
   ```typescript
   const ENABLE_AUTH = true; // Set to true to enable login/registration forms
   ```

## Manual Restoration Method

If you need to fully restore the original login form:

### Step 1: Restore LoginForm Component
1. Delete `src/components/Auth/LoginForm.tsx`
2. Rename `src/components/Auth/LoginForm.backup.tsx` to `src/components/Auth/LoginForm.tsx`

### Step 2: Restore RegistrationForm Component
1. You'll need to recreate the RegistrationForm component (it was removed)
2. The original registration form code would need to be restored from git history or rewritten

### Step 3: Update App.tsx
Remove the `ENABLE_AUTH` toggle and restore the original authentication logic:

```typescript
import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import RegistrationForm from './components/Auth/RegistrationForm';

const App: React.FC = () => {
  const { user, profile, isLoading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <div className="fade-in">
        {showRegister ? (
          <RegistrationForm onSwitchToLogin={() => setShowRegister(false)} />
        ) : (
          <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
        )}
      </div>
    );
  }

  // Rest of the app...
};
```

## Current State

- **Authentication**: Disabled
- **Direct Access**: Dashboard loads immediately
- **Login Form**: Replaced with empty stub
- **Registration Form**: Replaced with empty stub
- **Original Code**: Backed up in `LoginForm.backup.tsx`

## Benefits of Toggle Method

- ✅ Quick enable/disable without code changes
- ✅ Preserves original functionality
- ✅ Easy testing between modes
- ✅ No risk of losing code

## When to Use Each Method

- **Toggle Method**: For temporary changes, testing, or quick switches
- **Manual Method**: For permanent changes or when you need to modify the forms

## Dependencies

When authentication is enabled, make sure these are working:
- Supabase connection
- AuthContext provider
- Database migrations
- Environment variables
