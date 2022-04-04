import moment from "moment";
import {customAlphabet, nanoid} from "nanoid";
import * as bcrypt from 'bcrypt';

export class AppUtil {

  // Returns unix time in milliseconds
  static currentTime(): number {
    return moment.now();
  }

  static currentUTC(): moment.Moment {
    return moment.utc();
  }

  static currentUTCUnix(): number {
    return this.currentUTC().unix();
  }

  static currentUTCTimestamp(): number {
    return this.currentUTC().toDate().getTime();
  }

  // "V1StGXR8_Z5jdHi6B-myT"
  static nanoId(): string {
    return nanoid();
  }

  static genFriendlyId(length = 9): string {
    const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', length);
    return nanoid().toUpperCase();
  }

  /**
   * AES-256-CBC implementation in nodeJS with built-in Crypto library
   */
  static encrypt(val: string, key: string): string {
    const crypto = require('crypto');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key.substr(0, 32).padStart(32, '*')), iv);
    let encrypted = cipher.update(val);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  static decrypt(encrypted: string, key: string): string | null {
    const crypto = require('crypto');
    const textParts = encrypted.split(':');
    const ivPart = textParts.shift();
    if (ivPart) {
      const iv = Buffer.from(ivPart, 'hex');
      const encryptedText = Buffer.from(textParts.join(':'), 'hex');
      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key.substr(0, 32).padStart(32, '*')), iv);
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
    }
    return null;

  }

  /**
   * Hashing
   * https://docs.nestjs.com/security/encryption-and-hashing
   */
  static async hash(nonHashVal: string): Promise<string> {
    const saltOrRounds = await bcrypt.genSalt();
    return bcrypt.hash(nonHashVal, saltOrRounds);
  }

  static hashVerify(nonHashVal: string, hashedVal: string): Promise<boolean> {
    return bcrypt.compare(nonHashVal, hashedVal);
  }

  static getNetworkConfigByChainId(chainId: string) {
    const config = {
      '0x38': {
        scanApiKey: process.env.BSC_SCAN_API_KEY || '',
        scanApiUrl: process.env.BSC_SCAN_MAINNET_API_URL || '',
        web3ProviderHttps: process.env.BSC_WEB3_PROVIDER_MAINNET_HTTPS || '',
        lockContractAddress: process.env.BSC_LOCK_CONTRACT_MAINNET_ADDRESS,
        stakingContractAddress: process.env.BSC_STAKING_CONTRACT_MAINNET_ADDRESS,
        projectStakingAddress: process.env.BSC_PROJECT_STAKING_CONTRACT_MAINNET_ADDRESS,
        pancakeSwapContract: process.env.PANCAKE_CONTRACT_BSC_MAINNET,
        wrappedBnbToken: process.env.PANCAKE_WBNB_CONTRACT_BSC_MAINNET,
        acceptedTokenSymbol: 'BNB',
        acceptedTokenDecimals: 18,
  
      },
      '0x61': {
        scanApiKey: process.env.BSC_SCAN_API_KEY || '',
        scanApiUrl: process.env.BSC_SCAN_TESTNET_API_URL || '',
        web3ProviderHttps: process.env.BSC_WEB3_PROVIDER_TESTNET_HTTPS || '',
        stakingContractAddress: process.env.BSC_STAKING_CONTRACT_TESTNET_ADDRESS,
        lockContractAddress: process.env.BSC_LOCK_CONTRACT_TESTNET_ADDRESS,
        projectStakingAddress: process.env.BSC_PROJECT_STAKING_CONTRACT_TESTNET_ADDRESS,
        pancakeSwapContract: process.env.PANCAKE_CONTRACT_BSC_TESTNET,
        wrappedBnbToken: process.env.PANCAKE_WBNB_CONTRACT_BSC_TESTNET,
        acceptedTokenSymbol: 'BNB',
        acceptedTokenDecimals: 18,
      },
    }
  
    return config[chainId];
  }
}
