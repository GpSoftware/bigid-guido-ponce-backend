import { subtle, getRandomValues } from 'crypto';

const deriveKey = async (key: CryptoKey, salt: Uint8Array): Promise<CryptoKey> => {
  try {
    const derivedKey = await subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 1,
        hash: 'SHA-256'
      },
      key,
      {
        name: 'AES-GCM',
        length: 256
      },
      false,
      ['encrypt', 'decrypt']
    );

    return derivedKey;
  } catch (e) {
    throw e;
  }
}

const importKey = async(passphrase: string) => {
  const importedKey = await subtle.importKey('raw', encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return importedKey;
}

const getAESKey = async (passphrase: string, salt: Uint8Array): Promise<CryptoKey> => {
  try {
    const importedKey = await importKey(passphrase);

    const key = await deriveKey(importedKey, salt);

    return key;
  } catch (e) {
    throw e;
  }
}

const encode = (data: string) => {
  const encoder = new TextEncoder();
  return encoder.encode(data);
};

const generateIv = () => {
  return getRandomValues(new Uint8Array(12));
};

const pack = (buffer: ArrayBuffer, stringType: BufferEncoding) => {
  return Buffer.from(buffer).toString(stringType);
};

const Uint8ArrayFromBase64 = (base64: string) => {
  const binaryString = Buffer.from(base64, 'base64');
  return new Uint8Array(binaryString);
}

export const encrypt = async (data: string, passphrase: string) => {
  try {
    const salt = getRandomValues(new Uint8Array(16));
    const key = await getAESKey(passphrase, salt);

    const encoded = encode(data);
    const iv = generateIv();

    const cipher = await subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encoded
    );

    // concat IV + packed + salt
    const ivCipherConcat = pack(iv, 'base64') + pack(cipher, 'base64') + pack(salt, 'base64');

    return ivCipherConcat;
  } catch (e: any) {
    throw new Error(e);
  }
};

export const decrypt = async (plainText: string, passphrase: string): Promise<string | undefined> => {
  try {
    const IV = plainText.substring(0, 16);
    const cipherText = plainText.substring(16, plainText.length - 24);
    const salt = plainText.substring(16 + cipherText.length);

    const IVformatted = Uint8ArrayFromBase64(IV);
    const saltFormatted = Uint8ArrayFromBase64(salt);
    const textFormatted = Uint8ArrayFromBase64(cipherText);

    const importedKey = await getAESKey(passphrase, saltFormatted);
    const encoded = await subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: IVformatted
      },
      importedKey,
      textFormatted
    );

    return pack(encoded, 'utf-8');
  } catch (e: any) {
    throw new Error(e);
  }
}