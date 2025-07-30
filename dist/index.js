"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NostrChallengeGenerator = void 0;
const QRCode = __importStar(require("qrcode"));
class NostrChallengeGenerator {
    constructor(authServer = 'https://auth.nostrich.pro') {
        this.authServer = authServer;
    }
    async generateChallenge() {
        try {
            const response = await fetch(`${this.authServer}/api/generate-challenge`, {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error(`Failed to generate challenge: ${response.statusText}`);
            }
            const challengeData = await response.json();
            return challengeData;
        }
        catch (error) {
            console.error('Error generating challenge:', error);
            throw new Error('Error generating challenge');
        }
    }
    async generateChallengeWithQR() {
        const challengeData = await this.generateChallenge();
        try {
            challengeData.qrCodeDataUrl = await QRCode.toDataURL(challengeData.nwcUri);
        }
        catch (error) {
            console.error('Error generating QR code:', error);
        }
        return challengeData;
    }
    async listenForAuth(challengeId) {
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
exports.NostrChallengeGenerator = NostrChallengeGenerator;
