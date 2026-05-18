import { RsaPublicKey } from "rsa";

// RSA blind signature verification: checks that signature^e mod n === message.
// A valid signature proves Energetica blind-signed the consumption value.
export function verifyBlindSignature(message: bigint, signature: bigint, pubKey: RsaPublicKey): boolean {
    return pubKey.verify(signature) === message;
}
