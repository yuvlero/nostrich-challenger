import * as QRCode from 'qrcode';
import { nanoid } from 'nanoid';

interface ChallengeData {
  challengeId: string;
  secret: string;
  relay: string;
  nwcUri: string;
  qrCodeDataUrl?: string;
}

interface AuthResult {
  success: boolean;
  eventId?: string;
  signerPubkey?: string;
  timestamp?: number;
}

class NostrChallengeGenerator {
  private authServer: string;

  constructor(authServer = 'https://auth.nostrich.pro') {
    this.authServer = authServer;
  }

  async generateChallenge(): Promise<ChallengeData> {
    const platformDomain = process.env.PLATFORM_DOMAIN || 'unknown';  // Use environment variable or fallback

    try {
      const response = await fetch(`${this.authServer}/api/generate-challenge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platformDomain }) // Pass domain to server
      });

      if (!response.ok) {
        throw new Error(`Failed to generate challenge: ${response.statusText}`);
      }

      const challengeData: ChallengeData = await response.json();
      return challengeData;
    } catch (error) {
      console.error('Error generating challenge:', error);
      throw new Error('Error generating challenge');
    }
  }

  async generateChallengeWithQR(): Promise<ChallengeData> {
    const challengeData = await this.generateChallenge();
    try {
      challengeData.qrCodeDataUrl = await QRCode.toDataURL(challengeData.nwcUri);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
    return challengeData;
  }


  async listenForAuth(challengeId: string): Promise<AuthResult> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(`${this.authServer.replace(/^http/, 'ws')}/api/ws`);
      ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'subscribe', challengeId }));
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'login_success') {
          resolve({
            success: true,
            eventId: message.eventId,
            signerPubkey: message.signerPubkey,
            timestamp: message.timestamp,
          });
          ws.close();
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(new Error('WebSocket error during authentication'));
        ws.close();
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };
    });
  }
}

export { NostrChallengeGenerator };
