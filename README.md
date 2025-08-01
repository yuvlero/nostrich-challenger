# Nostrich Challenger

Nostrich Challenger is an npm package designed to generate Nostr authentication challenges and integrate with a remote authentication server. It helps developers add Nostr-based QR code authentication to their websites.

## Installation

```bash
npm install nostrich-challenger
```

## Usage

### Environment Variables

- Set `PLATFORM_DOMAIN` to specify the domain name for platform identification. Defaults to 'unknown' if not set.

#### Basic Usage

```typescript
import { NostrChallengeGenerator } from 'nostrich-challenger';

// Ensure environment variable PLATFORM_DOMAIN is set
process.env.PLATFORM_DOMAIN = 'yourdomain.com';

const generator = new NostrChallengeGenerator();

(async () => {
  const challenge = await generator.generateChallengeWithQR();
  const authResult = await generator.listenForAuth(challenge.challengeId);
})();
```

#### With Custom Options

```typescript
const challenge = await generator.generateChallenge({
  authServer: 'https://custom-server.com',
});
```

## API Documentation

### NostrChallengeGenerator

#### Methods:
- `generateChallenge()`: Calls the auth server to return challenge data, now including the platform domain if set.
- `generateChallengeWithQR()`: Generates a challenge and includes a QR code data URL.
- `listenForAuth(challengeId)`: Connects to WebSocket, subscribes to updates, and awaits a `login_success` message to trigger authentication success.

## Error Handling

The package provides graceful error handling with descriptive messages to assist developers in debugging.

## Integration Guide

Nostrich Challenger can be seamlessly integrated with any Nostr signer application to handle authentication requests. The QR code generated allows websites to authenticate users via their Nostr identity conveniently.

## License

MIT
