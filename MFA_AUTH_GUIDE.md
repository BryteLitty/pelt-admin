# 🔒 Multi-Factor Authentication (MFA) Integration Guide

## Table of Contents
- [Overview](#overview)
- [API Reference](#api-reference)
- [MFA Login Flow](#-mfa-login-flow)
- [MFA Management Endpoints](#mfa-management-endpoints)
- [Frontend Integration](#frontend-integration)
- [Mobile Integration](#mobile-integration)
- [Security Best Practices](#security-best-practices)
- [Testing Guide](#testing-guide)
- [User Experience Guidelines](#user-experience-guidelines)
- [Troubleshooting](#troubleshooting)

## Overview

The Bitspenda Core Backend provides a complete Multi-Factor Authentication (MFA) system using Time-based One-Time Passwords (TOTP). This guide covers everything you need to integrate MFA into your frontend applications.

### 🎯 **What's Included:**
- **Login MFA Verification**: Two-step login process for users with MFA enabled
- **TOTP Authentication**: Compatible with Google Authenticator, Authy, etc.
- **QR Code Setup**: Automatic QR code generation for easy setup
- **Backup Codes**: 10 single-use recovery codes
- **Email Notifications**: Automatic notifications for all MFA events
- **Encrypted Storage**: Secure storage of MFA secrets

### 🔑 **Key Features:**
- **Seamless Login Flow**: When MFA is enabled, users verify with a 6-digit code after password authentication
- **No Token on MFA Required**: Access tokens are only issued after successful MFA verification
- **Secure Token Management**: Tokens are properly scoped to prevent unauthorized access

### 🔧 **Supported MFA Types:**
- `TOTP` - Time-based One-Time Password (Primary)
- `SMS` - SMS-based codes (Future implementation)
- `EMAIL` - Email-based codes (Future implementation)

---

## API Reference

### Base URL
```
https://your-api-domain.com/api/v1
```

### Authentication
Most MFA endpoints require JWT authentication (except login MFA verification):
```http
Authorization: Bearer <access_token>
```

---

## 🔐 MFA Login Flow

When a user has MFA enabled, the login process requires an additional verification step.

### Login with MFA Enabled

**Step 1: Initial Login**

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "userPassword123"
}
```

**Response (MFA Enabled):**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "mfaEnabled": true,
    // ... other user fields (no tokens!)
  },
  "mfaRequired": true
}
```

**Response (MFA Disabled):**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "mfaEnabled": false,
    // ... other user fields
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Step 2: Verify MFA Code**

**Endpoint:** `POST /auth/verify-login-mfa`

**Request Body:**
```json
{
  "email": "user@example.com",
  "token": "123456"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    // ... other user fields
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Implementation Example

```javascript
const login = async (email, password) => {
  try {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    // Check if MFA is required
    if (data.mfaRequired) {
      // Store email temporarily for MFA verification
      sessionStorage.setItem('mfa_email', email);

      // Redirect to MFA verification page
      return { requiresMfa: true, user: data.user };
    }

    // No MFA required, proceed with login
    localStorage.setItem('accessToken', data.accessToken);
    return { requiresMfa: false, user: data.user };

  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

const verifyLoginMfa = async (email, totpCode) => {
  try {
    const response = await fetch('/api/v1/auth/verify-login-mfa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        token: totpCode
      })
    });

    if (!response.ok) {
      throw new Error('Invalid MFA code');
    }

    const data = await response.json();

    // Store access token
    localStorage.setItem('accessToken', data.accessToken);

    // Clear temporary email storage
    sessionStorage.removeItem('mfa_email');

    return { success: true, user: data.user };

  } catch (error) {
    console.error('MFA verification failed:', error);
    throw error;
  }
};
```

### React Login Flow Example

```jsx
import React, { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.mfaRequired) {
        // Show MFA input
        setMfaRequired(true);
      } else {
        // Login successful
        localStorage.setItem('accessToken', data.accessToken);
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const handleMfaVerification = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/v1/auth/verify-login-mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: mfaCode })
      });

      if (!response.ok) {
        throw new Error('Invalid MFA code');
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Invalid MFA code. Please try again.');
    }
  };

  if (mfaRequired) {
    return (
      <div className="mfa-verification">
        <h2>Two-Factor Authentication</h2>
        <p>Enter the 6-digit code from your authenticator app</p>

        <form onSubmit={handleMfaVerification}>
          <input
            type="text"
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value)}
            placeholder="000000"
            maxLength={6}
            pattern="[0-9]{6}"
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Verify</button>
          <button type="button" onClick={() => setMfaRequired(false)}>
            Back to Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
```

### Vue.js Login Flow Example

```vue
<template>
  <div class="login-container">
    <div v-if="!mfaRequired" class="login-form">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
        />
        <p v-if="error" class="error">{{ error }}</p>
        <button type="submit">Login</button>
      </form>
    </div>

    <div v-else class="mfa-verification">
      <h2>Two-Factor Authentication</h2>
      <p>Enter the 6-digit code from your authenticator app</p>
      <form @submit.prevent="handleMfaVerification">
        <input
          v-model="mfaCode"
          type="text"
          placeholder="000000"
          maxlength="6"
          pattern="[0-9]{6}"
          required
        />
        <p v-if="error" class="error">{{ error }}</p>
        <button type="submit">Verify</button>
        <button type="button" @click="mfaRequired = false">Back to Login</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      mfaRequired: false,
      mfaCode: '',
      error: ''
    };
  },
  methods: {
    async handleLogin() {
      this.error = '';

      try {
        const response = await this.$http.post('/api/v1/auth/login', {
          email: this.email,
          password: this.password
        });

        if (response.data.mfaRequired) {
          this.mfaRequired = true;
        } else {
          localStorage.setItem('accessToken', response.data.accessToken);
          this.$router.push('/dashboard');
        }
      } catch (err) {
        this.error = 'Invalid credentials';
      }
    },

    async handleMfaVerification() {
      this.error = '';

      try {
        const response = await this.$http.post('/api/v1/auth/verify-login-mfa', {
          email: this.email,
          token: this.mfaCode
        });

        localStorage.setItem('accessToken', response.data.accessToken);
        this.$router.push('/dashboard');
      } catch (err) {
        this.error = 'Invalid MFA code. Please try again.';
      }
    }
  }
};
</script>
```

### React Native Login Flow Example

```jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaCode, setMfaCode] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.mfaRequired) {
        setMfaRequired(true);
      } else {
        await AsyncStorage.setItem('accessToken', data.accessToken);
        navigation.navigate('Dashboard');
      }
    } catch (error) {
      Alert.alert('Error', 'Invalid credentials');
    }
  };

  const handleMfaVerification = async () => {
    try {
      const response = await fetch('/api/v1/auth/verify-login-mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: mfaCode })
      });

      if (!response.ok) {
        throw new Error('Invalid MFA code');
      }

      const data = await response.json();
      await AsyncStorage.setItem('accessToken', data.accessToken);
      navigation.navigate('Dashboard');
    } catch (error) {
      Alert.alert('Error', 'Invalid MFA code. Please try again.');
    }
  };

  if (mfaRequired) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Two-Factor Authentication</Text>
        <Text style={styles.subtitle}>Enter 6-digit code from your app</Text>

        <TextInput
          style={styles.input}
          value={mfaCode}
          onChangeText={setMfaCode}
          placeholder="000000"
          keyboardType="numeric"
          maxLength={6}
        />

        <TouchableOpacity style={styles.button} onPress={handleMfaVerification}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMfaRequired(false)}>
          <Text style={styles.linkText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 5, marginBottom: 10 },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  linkText: { color: '#007bff', textAlign: 'center', marginTop: 10 }
};

export default LoginScreen;
```

---

## MFA Management Endpoints

### 1. Setup MFA

**Endpoint:** `POST /mfa/setup`

Initiates MFA setup and returns QR code for authenticator app.

**Request Body:**
```json
{
  "type": "TOTP"
}
```

**Response:**
```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCodeUrl": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "backupCodes": [
    "A1B2C3D4",
    "E5F6G7H8",
    // ... 8 more codes
  ]
}
```

**Usage Example:**
```javascript
const setupMfa = async () => {
  try {
    const response = await fetch('/api/v1/mfa/setup', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ type: 'TOTP' })
    });

    const data = await response.json();

    // Display QR code to user
    document.getElementById('qr-code').src = data.qrCodeUrl;

    // Store backup codes securely
    displayBackupCodes(data.backupCodes);

  } catch (error) {
    console.error('MFA setup failed:', error);
  }
};
```

---

### 2. Verify Setup

**Endpoint:** `POST /mfa/verify-setup`

Verifies TOTP code and enables MFA for the user.

**Request Body:**
```json
{
  "token": "123456"
}
```

**Response:**
```json
{
  "success": true
}
```

**Usage Example:**
```javascript
const verifySetup = async (totpCode) => {
  try {
    const response = await fetch('/api/v1/mfa/verify-setup', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: totpCode })
    });

    if (response.ok) {
      // MFA is now enabled
      showSuccessMessage('MFA enabled successfully!');
      redirectToSecuritySettings();
    }
  } catch (error) {
    showErrorMessage('Invalid verification code');
  }
};
```

---

### 3. Verify MFA Code

**Endpoint:** `POST /mfa/verify`

Verifies TOTP code for authentication.

**Request Body:**
```json
{
  "token": "123456"
}
```

**Response:**
```json
{
  "success": true
}
```

**Usage Example:**
```javascript
const verifyMfaCode = async (totpCode) => {
  try {
    const response = await fetch('/api/v1/mfa/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: totpCode })
    });

    const result = await response.json();
    return result.success;
  } catch (error) {
    return false;
  }
};
```

---

### 4. Verify Backup Code

**Endpoint:** `POST /mfa/verify-backup`

Verifies backup code for recovery access.

**Request Body:**
```json
{
  "code": "A1B2C3D4"
}
```

**Response:**
```json
{
  "success": true
}
```

**Usage Example:**
```javascript
const verifyBackupCode = async (backupCode) => {
  try {
    const response = await fetch('/api/v1/mfa/verify-backup', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code: backupCode })
    });

    const result = await response.json();

    if (result.success) {
      // Backup code is valid, warn user it's now used
      showWarning('Backup code used. Consider generating new codes.');
    }

    return result.success;
  } catch (error) {
    return false;
  }
};
```

---

### 5. Regenerate Backup Codes

**Endpoint:** `POST /mfa/regenerate-backup-codes`

Generates new backup codes and invalidates old ones.

**Request Body:** None

**Response:**
```json
{
  "backupCodes": [
    "X1Y2Z3W4",
    "V5U6T7S8",
    // ... 8 more codes
  ]
}
```

**Usage Example:**
```javascript
const regenerateBackupCodes = async () => {
  try {
    const response = await fetch('/api/v1/mfa/regenerate-backup-codes', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const data = await response.json();

    // Display new backup codes
    displayBackupCodes(data.backupCodes);
    showWarning('Old backup codes are no longer valid.');

  } catch (error) {
    showErrorMessage('Failed to regenerate backup codes');
  }
};
```

---

### 6. Disable MFA

**Endpoint:** `POST /mfa/disable`

Disables MFA for the user account.

**Request Body:** None

**Response:**
```json
{
  "success": true
}
```

**Usage Example:**
```javascript
const disableMfa = async () => {
  const confirmed = confirm('Are you sure you want to disable MFA? This will reduce your account security.');

  if (!confirmed) return;

  try {
    const response = await fetch('/api/v1/mfa/disable', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.ok) {
      showSuccessMessage('MFA has been disabled');
      updateSecurityStatus(false);
    }
  } catch (error) {
    showErrorMessage('Failed to disable MFA');
  }
};
```

---

## Frontend Integration

### React Implementation Example

```jsx
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const MfaSetup = ({ accessToken }) => {
  const [step, setStep] = useState('setup');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [verificationCode, setVerificationCode] = useState('');

  const startSetup = async () => {
    try {
      const response = await fetch('/api/v1/mfa/setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: 'TOTP' })
      });

      const data = await response.json();
      setQrCodeUrl(data.qrCodeUrl);
      setBackupCodes(data.backupCodes);
      setStep('verify');
    } catch (error) {
      console.error('Setup failed:', error);
    }
  };

  const verifySetup = async () => {
    try {
      const response = await fetch('/api/v1/mfa/verify-setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: verificationCode })
      });

      if (response.ok) {
        setStep('complete');
      } else {
        alert('Invalid verification code');
      }
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  return (
    <div className="mfa-setup">
      {step === 'setup' && (
        <div>
          <h2>Enable Two-Factor Authentication</h2>
          <p>Secure your account with an additional layer of protection.</p>
          <button onClick={startSetup}>Setup MFA</button>
        </div>
      )}

      {step === 'verify' && (
        <div>
          <h2>Scan QR Code</h2>
          <div className="qr-section">
            <img src={qrCodeUrl} alt="MFA QR Code" />
            <p>Scan this QR code with your authenticator app</p>
          </div>

          <div className="verification-section">
            <h3>Enter Verification Code</h3>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
            />
            <button onClick={verifySetup}>Verify</button>
          </div>

          <div className="backup-codes">
            <h3>Backup Codes</h3>
            <p>Save these codes in a secure location:</p>
            <div className="codes-grid">
              {backupCodes.map((code, index) => (
                <code key={index}>{code}</code>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 'complete' && (
        <div>
          <h2>✅ MFA Enabled Successfully!</h2>
          <p>Your account is now protected with two-factor authentication.</p>
        </div>
      )}
    </div>
  );
};

export default MfaSetup;
```

### Vue.js Implementation Example

```vue
<template>
  <div class="mfa-setup">
    <div v-if="step === 'setup'">
      <h2>Enable Two-Factor Authentication</h2>
      <button @click="startSetup">Setup MFA</button>
    </div>

    <div v-if="step === 'verify'">
      <h2>Scan QR Code</h2>
      <img :src="qrCodeUrl" alt="MFA QR Code" />

      <input
        v-model="verificationCode"
        type="text"
        placeholder="Enter 6-digit code"
        maxlength="6"
      />
      <button @click="verifySetup">Verify</button>
    </div>

    <div v-if="step === 'complete'">
      <h2>✅ MFA Enabled Successfully!</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MfaSetup',
  props: ['accessToken'],
  data() {
    return {
      step: 'setup',
      qrCodeUrl: '',
      verificationCode: '',
      backupCodes: []
    };
  },
  methods: {
    async startSetup() {
      try {
        const response = await this.$http.post('/api/v1/mfa/setup',
          { type: 'TOTP' },
          { headers: { Authorization: `Bearer ${this.accessToken}` } }
        );

        this.qrCodeUrl = response.data.qrCodeUrl;
        this.backupCodes = response.data.backupCodes;
        this.step = 'verify';
      } catch (error) {
        console.error('Setup failed:', error);
      }
    },

    async verifySetup() {
      try {
        await this.$http.post('/api/v1/mfa/verify-setup',
          { token: this.verificationCode },
          { headers: { Authorization: `Bearer ${this.accessToken}` } }
        );

        this.step = 'complete';
      } catch (error) {
        alert('Invalid verification code');
      }
    }
  }
};
</script>
```

---

## Mobile Integration

### React Native Example

```jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { Camera } from 'expo-camera';

const MfaSetup = ({ accessToken }) => {
  const [step, setStep] = useState('setup');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const startSetup = async () => {
    try {
      const response = await fetch('/api/v1/mfa/setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: 'TOTP' })
      });

      const data = await response.json();
      setQrCodeUrl(data.qrCodeUrl);
      setStep('verify');
    } catch (error) {
      console.error('Setup failed:', error);
    }
  };

  const verifySetup = async () => {
    try {
      const response = await fetch('/api/v1/mfa/verify-setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: verificationCode })
      });

      if (response.ok) {
        setStep('complete');
      } else {
        Alert.alert('Error', 'Invalid verification code');
      }
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      {step === 'setup' && (
        <View>
          <Text style={styles.title}>Enable Two-Factor Authentication</Text>
          <TouchableOpacity style={styles.button} onPress={startSetup}>
            <Text style={styles.buttonText}>Setup MFA</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 'verify' && (
        <View>
          <Text style={styles.title}>Scan QR Code</Text>
          <Image source={{ uri: qrCodeUrl }} style={styles.qrCode} />

          <TextInput
            style={styles.input}
            value={verificationCode}
            onChangeText={setVerificationCode}
            placeholder="Enter 6-digit code"
            keyboardType="numeric"
            maxLength={6}
          />

          <TouchableOpacity style={styles.button} onPress={verifySetup}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 'complete' && (
        <View>
          <Text style={styles.title}>✅ MFA Enabled Successfully!</Text>
        </View>
      )}
    </View>
  );
};

const styles = {
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  qrCode: { width: 200, height: 200, alignSelf: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20 },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 5 },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' }
};

export default MfaSetup;
```

### iOS Swift Example

```swift
import UIKit

class MFASetupViewController: UIViewController {
    @IBOutlet weak var qrImageView: UIImageView!
    @IBOutlet weak var verificationTextField: UITextField!

    private let accessToken = UserDefaults.standard.string(forKey: "accessToken")
    private var setupData: MFASetupResponse?

    @IBAction func setupMFAPressed(_ sender: UIButton) {
        setupMFA()
    }

    @IBAction func verifyPressed(_ sender: UIButton) {
        verifySetup()
    }

    private func setupMFA() {
        guard let token = accessToken else { return }

        let url = URL(string: "https://your-api.com/api/v1/mfa/setup")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body = ["type": "TOTP"]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)

        URLSession.shared.dataTask(with: request) { data, response, error in
            guard let data = data else { return }

            do {
                let setupResponse = try JSONDecoder().decode(MFASetupResponse.self, from: data)
                self.setupData = setupResponse

                DispatchQueue.main.async {
                    self.displayQRCode(setupResponse.qrCodeUrl)
                }
            } catch {
                print("Setup failed: \(error)")
            }
        }.resume()
    }

    private func verifySetup() {
        guard let token = accessToken,
              let code = verificationTextField.text else { return }

        let url = URL(string: "https://your-api.com/api/v1/mfa/verify-setup")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body = ["token": code]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)

        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                if let httpResponse = response as? HTTPURLResponse,
                   httpResponse.statusCode == 200 {
                    self.showSuccessAlert()
                } else {
                    self.showErrorAlert("Invalid verification code")
                }
            }
        }.resume()
    }

    private func displayQRCode(_ base64String: String) {
        // Convert base64 to image and display
        if let data = Data(base64Encoded: base64String),
           let image = UIImage(data: data) {
            qrImageView.image = image
        }
    }
}

struct MFASetupResponse: Codable {
    let secret: String
    let qrCodeUrl: String
    let backupCodes: [String]
}
```

---

## Security Best Practices

### 1. Token Validation

**❌ Don't do this:**
```javascript
// Never trust client-side validation alone
if (totpCode.length === 6) {
  // Assume it's valid
  allowAccess();
}
```

**✅ Do this:**
```javascript
// Always validate on server
const isValid = await verifyMfaCode(totpCode);
if (isValid) {
  allowAccess();
} else {
  showError('Invalid code');
}
```

### 2. Backup Code Handling

**❌ Don't do this:**
```javascript
// Never store backup codes in plain text
localStorage.setItem('backupCodes', JSON.stringify(codes));
```

**✅ Do this:**
```javascript
// Display codes once and require user to save them
displayBackupCodesModal(codes);
// Never store them in browser storage
```

### 3. Error Messages

**❌ Don't do this:**
```javascript
// Too specific error messages can help attackers
if (error.code === 'INVALID_TOKEN') {
  showError('TOTP token is invalid');
} else if (error.code === 'EXPIRED_TOKEN') {
  showError('TOTP token has expired');
}
```

**✅ Do this:**
```javascript
// Generic error messages
showError('Invalid verification code. Please try again.');
```

### 4. Rate Limiting

**✅ Implement client-side rate limiting:**
```javascript
let attemptCount = 0;
const MAX_ATTEMPTS = 3;

const verifyWithRateLimit = async (code) => {
  if (attemptCount >= MAX_ATTEMPTS) {
    showError('Too many attempts. Please wait before trying again.');
    return;
  }

  attemptCount++;
  const result = await verifyMfaCode(code);

  if (result.success) {
    attemptCount = 0; // Reset on success
  }

  return result;
};
```

### 5. Secure Storage

**✅ For sensitive data:**
```javascript
// Use secure storage for tokens
const secureStorage = {
  setItem: (key, value) => {
    // Use platform-specific secure storage
    // iOS: Keychain, Android: Keystore, Web: Encrypted storage
  },
  getItem: (key) => {
    // Retrieve from secure storage
  }
};
```

---

## Testing Guide

### Unit Testing Example (Jest)

```javascript
describe('MFA Integration', () => {
  test('should setup MFA successfully', async () => {
    const mockResponse = {
      secret: 'JBSWY3DPEHPK3PXP',
      qrCodeUrl: 'data:image/png;base64,mock-data',
      backupCodes: ['A1B2C3D4', 'E5F6G7H8']
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await setupMfa('TOTP');

    expect(result.secret).toBe('JBSWY3DPEHPK3PXP');
    expect(result.backupCodes).toHaveLength(2);
  });

  test('should verify TOTP code', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });

    const result = await verifyMfaCode('123456');
    expect(result).toBe(true);
  });

  test('should handle invalid TOTP code', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401
    });

    const result = await verifyMfaCode('invalid');
    expect(result).toBe(false);
  });
});
```

### Integration Testing with Cypress

```javascript
describe('MFA Setup Flow', () => {
  it('should complete MFA setup successfully', () => {
    cy.visit('/security/settings');
    cy.get('[data-testid="setup-mfa-button"]').click();

    // Mock API response
    cy.intercept('POST', '/api/v1/mfa/setup', {
      fixture: 'mfa-setup-response.json'
    }).as('setupMfa');

    cy.get('[data-testid="start-setup"]').click();
    cy.wait('@setupMfa');

    // Verify QR code is displayed
    cy.get('[data-testid="qr-code"]').should('be.visible');

    // Enter verification code
    cy.get('[data-testid="verification-input"]').type('123456');

    cy.intercept('POST', '/api/v1/mfa/verify-setup', {
      body: { success: true }
    }).as('verifySetup');

    cy.get('[data-testid="verify-button"]').click();
    cy.wait('@verifySetup');

    // Verify success message
    cy.get('[data-testid="success-message"]').should('contain', 'MFA enabled successfully');
  });
});
```

### Postman Testing

Use the provided Postman collection for API testing:

1. Import `Bitspenda-Core-Backend-API-v2.postman_collection.json`
2. Set environment variables:
   - `baseUrl`: Your API base URL
   - `accessToken`: Valid JWT token
3. Run the MFA folder tests in sequence

---

## User Experience Guidelines

### 1. Setup Flow

**Recommended User Journey:**
1. **Security Settings Page** → Clear benefits of MFA
2. **Setup Initiation** → Simple "Enable MFA" button
3. **QR Code Display** → Clear instructions for app download
4. **Verification** → Input field with real-time validation
5. **Backup Codes** → Mandatory display with download option
6. **Confirmation** → Success message with next steps

### 2. UI/UX Best Practices

**QR Code Display:**
```jsx
<div className="qr-section">
  <h3>Scan with Authenticator App</h3>
  <div className="app-suggestions">
    <p>Recommended apps:</p>
    <ul>
      <li>Google Authenticator</li>
      <li>Authy</li>
      <li>Microsoft Authenticator</li>
    </ul>
  </div>
  <div className="qr-container">
    <img src={qrCodeUrl} alt="MFA Setup QR Code" />
    <p className="manual-entry">
      Can't scan? <button onClick={showManualEntry}>Enter code manually</button>
    </p>
  </div>
</div>
```

**Verification Input:**
```jsx
<div className="verification-input">
  <label>Enter 6-digit code from your app:</label>
  <input
    type="text"
    pattern="[0-9]{6}"
    maxLength={6}
    placeholder="000000"
    className="totp-input"
    onChange={handleCodeChange}
  />
  <div className="input-help">
    The code changes every 30 seconds
  </div>
</div>
```

**Backup Codes Display:**
```jsx
<div className="backup-codes-section">
  <h3>⚠️ Save Your Backup Codes</h3>
  <p>Store these codes in a safe place. Each can only be used once.</p>

  <div className="codes-grid">
    {backupCodes.map((code, index) => (
      <div key={index} className="backup-code">
        <code>{code}</code>
        <button onClick={() => copyCode(code)}>Copy</button>
      </div>
    ))}
  </div>

  <div className="save-options">
    <button onClick={downloadCodes}>Download as Text</button>
    <button onClick={printCodes}>Print Codes</button>
  </div>

  <label className="confirmation">
    <input type="checkbox" required />
    I have saved my backup codes in a secure location
  </label>
</div>
```

### 3. Error Handling

**Form Validation:**
```jsx
const [errors, setErrors] = useState({});

const validateCode = (code) => {
  const newErrors = {};

  if (!code) {
    newErrors.code = 'Verification code is required';
  } else if (!/^\d{6}$/.test(code)) {
    newErrors.code = 'Code must be 6 digits';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

**Error Display:**
```jsx
<div className="form-group">
  <input
    type="text"
    className={errors.code ? 'error' : ''}
    value={verificationCode}
    onChange={(e) => setVerificationCode(e.target.value)}
  />
  {errors.code && <span className="error-message">{errors.code}</span>}
</div>
```

### 4. Accessibility

**Screen Reader Support:**
```jsx
<div role="main" aria-labelledby="mfa-setup-title">
  <h1 id="mfa-setup-title">Two-Factor Authentication Setup</h1>

  <div role="img" aria-label="QR code for authenticator app setup">
    <img src={qrCodeUrl} alt="" />
  </div>

  <label htmlFor="verification-code">
    Enter 6-digit verification code
    <span className="sr-only">(from your authenticator app)</span>
  </label>
  <input
    id="verification-code"
    type="text"
    aria-describedby="code-help"
    aria-invalid={errors.code ? 'true' : 'false'}
  />
  <div id="code-help" className="help-text">
    The code changes every 30 seconds in your authenticator app
  </div>
</div>
```

---

## Troubleshooting

### Common Issues

#### 1. QR Code Not Displaying

**Problem:** QR code image not showing
**Solution:**
```javascript
// Ensure proper base64 data URI format
const displayQRCode = (qrCodeUrl) => {
  if (!qrCodeUrl.startsWith('data:image/')) {
    console.error('Invalid QR code format');
    return;
  }

  // Test if image loads
  const img = new Image();
  img.onload = () => setQrCodeUrl(qrCodeUrl);
  img.onerror = () => showError('Failed to load QR code');
  img.src = qrCodeUrl;
};
```

#### 2. TOTP Code Always Invalid

**Problem:** Valid codes being rejected
**Potential Causes:**
- Time synchronization issues
- Wrong secret used
- Code already used (TOTP codes are time-based)

**Solution:**
```javascript
// Check time synchronization
const checkTimeSync = () => {
  const serverTime = new Date(response.headers.get('date'));
  const localTime = new Date();
  const diff = Math.abs(serverTime - localTime);

  if (diff > 30000) { // 30 seconds
    showWarning('Your device time may be out of sync');
  }
};
```

#### 3. Backup Codes Not Working

**Problem:** Backup codes being rejected
**Potential Causes:**
- Code already used
- Incorrect format
- Case sensitivity

**Solution:**
```javascript
// Normalize backup code format
const normalizeBackupCode = (code) => {
  return code.toUpperCase().replace(/\s/g, '');
};
```

#### 4. Network Connectivity Issues

**Problem:** API requests failing
**Solution:**
```javascript
const apiRequest = async (url, options, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
};
```

### Error Codes Reference

| Status Code | Error | Description | Action |
|-------------|-------|-------------|---------|
| 400 | `INVALID_REQUEST` | Invalid request format | Check request body |
| 401 | `INVALID_TOKEN` | Invalid TOTP/backup code | Ask user to try again |
| 401 | `UNAUTHORIZED` | Invalid JWT token | Re-authenticate user |
| 409 | `MFA_ALREADY_ENABLED` | MFA already enabled | Redirect to settings |
| 429 | `RATE_LIMITED` | Too many attempts | Show rate limit message |
| 500 | `SERVER_ERROR` | Internal server error | Show generic error |

### Debugging Tips

1. **Enable Logging:**
```javascript
const debug = process.env.NODE_ENV === 'development';

const apiCall = async (endpoint, options) => {
  if (debug) console.log('API Call:', endpoint, options);

  const response = await fetch(endpoint, options);

  if (debug) console.log('API Response:', response.status, await response.clone().text());

  return response;
};
```

2. **Test with Fixed Codes:**
```javascript
// For development only
const isDevelopment = process.env.NODE_ENV === 'development';

if (isDevelopment && totpCode === '000000') {
  // Allow test code in development
  return { success: true };
}
```

3. **Monitor Network Requests:**
Use browser developer tools or tools like Charles Proxy to monitor API requests and responses.

---

## Support

For additional help with MFA integration:

1. **Check the Postman Collection**: Complete testing scenarios included
2. **Review Error Logs**: Server-side logs contain detailed error information
3. **Test with Multiple Devices**: Ensure compatibility across platforms
4. **Validate Time Synchronization**: TOTP codes are time-sensitive

### Contact Information

- **API Documentation**: Available in Postman collection
- **Testing Guide**: See `postman/API-Testing-Guide.md`
- **Security Issues**: Follow responsible disclosure practices

---

**Last Updated:** September 2025
**API Version:** v1
**MFA Implementation:** Production Ready ✅