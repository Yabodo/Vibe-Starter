import { authenticator } from 'otplib'
import QRCode from 'qrcode'
import { randomBytes } from 'crypto'

export interface TwoFactorSetup {
  secret: string
  qrCodeUrl: string
  backupCodes: string[]
}

export interface TwoFactorVerification {
  isValid: boolean
  usedBackupCode?: boolean
}

/**
 * Generate a new 2FA secret and QR code for user setup
 */
export async function generateTwoFactorSetup(
  userEmail: string,
  appName: string = 'Vibe Starter'
): Promise<TwoFactorSetup> {
  // Generate a secret key
  const secret = authenticator.generateSecret()
  
  // Create the service URL for authenticator apps
  const serviceUrl = authenticator.keyuri(userEmail, appName, secret)
  
  // Generate QR code as data URL
  const qrCodeUrl = await QRCode.toDataURL(serviceUrl)
  
  // Generate backup codes
  const backupCodes = generateBackupCodes()
  
  return {
    secret,
    qrCodeUrl,
    backupCodes
  }
}

/**
 * Verify a TOTP token or backup code
 */
export function verifyTwoFactorCode(
  token: string,
  secret: string,
  backupCodes: string[] = []
): TwoFactorVerification {
  // Remove spaces and convert to uppercase for consistency
  const cleanToken = token.replace(/\s+/g, '').toUpperCase()
  
  // First, try to verify as TOTP token
  const isValidTOTP = authenticator.verify({
    token: cleanToken,
    secret,
    window: 2 // Allow 2 windows (60 seconds) for time drift
  })
  
  if (isValidTOTP) {
    return { isValid: true }
  }
  
  // If TOTP fails, check backup codes
  if (backupCodes.includes(cleanToken)) {
    return { isValid: true, usedBackupCode: true }
  }
  
  return { isValid: false }
}

/**
 * Generate backup codes for 2FA recovery
 */
export function generateBackupCodes(count: number = 8): string[] {
  const codes: string[] = []
  
  for (let i = 0; i < count; i++) {
    // Generate 8-character alphanumeric code
    const code = randomBytes(4).toString('hex').toUpperCase()
    codes.push(code)
  }
  
  return codes
}

/**
 * Remove a used backup code from the list
 */
export function removeUsedBackupCode(backupCodes: string[], usedCode: string): string[] {
  return backupCodes.filter(code => code !== usedCode.toUpperCase())
}

/**
 * Check if user has 2FA enabled
 */
export function isTwoFactorEnabled(user: any): boolean {
  return user.twoFactorEnabled === true && user.twoFactorSecret !== null
}