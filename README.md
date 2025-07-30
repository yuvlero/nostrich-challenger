# Nostrich Challenger

Nostrich Challenger is an npm package designed to generate Nostr authentication challenges and integrate with a remote authentication server. It helps developers add Nostr-based QR code authentication to their websites.

## Installation

```bash
npm install nostrich-challenger
```

## Usage

#### Basic Usage

```typescript
import { NostrChallengeGenerator } from 'nostrich-challenger';

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
- `generateChallenge()`: Generates a challenge using the default or configured authentication server.
- `generateChallengeWithQR()`: Generates a challenge and returns a QR code data URL.
- `listenForAuth(challengeId)`: Listens for authentication success over WebSocket.

## Error Handling

The package provides graceful error handling with descriptive messages to assist developers in debugging.

## Integration Guide

Nostrich Challenger can be seamlessly integrated with any Nostr signer application to handle authentication requests. The QR code generated allows websites to authenticate users via their Nostr identity conveniently.

## License

MIT
