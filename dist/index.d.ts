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
declare class NostrChallengeGenerator {
    private authServer;
    constructor(authServer?: string);
    generateChallenge(): Promise<ChallengeData>;
    generateChallengeWithQR(): Promise<ChallengeData>;
    listenForAuth(challengeId: string): Promise<AuthResult>;
}
export { NostrChallengeGenerator };
