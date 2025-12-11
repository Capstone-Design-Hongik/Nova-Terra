import {createPublicClient, http, parseAbi } from 'viem';
import {sepolia, giwaSepolia} from "viem/chains";

// Giwa Sepolia RPC
const client = createPublicClient({
  chain: giwaSepolia,
  transport: http(),
  // transport: http('https://sepolia-rpc.giwa.io/')
});


const contracts = {
  DojangScroll: '0xd5077b67dcb56caC8b270C7788FC3E6ee03F17B9',
  AttestationIndexer: '0x9C9Bf29880448aB39795a11b669e22A0f1d790ec',
  DojangAttesterBook: '0xDA282E89244424E297Ce8e78089B54D043FB28B6',
  EAS: '0x4200000000000000000000000000000000000021',
};

const UPBIT_KOREA = '0xd99b42e778498aa3c9c1f6a012359130252780511687a35982e8e52735453034' as const;

// 이미지에서 본 Upbit Attester Address (수정!)
const UPBIT_ATTESTER_ADDRESS = '0x4097bF3Cb731AEB3E501b910B33B2aF9Fa68E388' as const;

// Schema UID - 이미지에서 Verified Address 스키마 (수정!)
// Testnet Schema ID: 0x568eb581cdf80b03d3bdfa414f3203b...
const VERIFIED_ADDRESS_SCHEMA = '0x568eb581cdf80b03d3bdfa414f3203bfdcc4bba4e66355612bd0e879da812f06' as const;

const dojangScrollAbi = parseAbi([
  'function isVerified(address, bytes32) view returns (bool)',
  'function getVerifiedAddressAttestationUid(address, bytes32) view returns (bytes32)',
]);

const easAbi = [{"inputs":[{"internalType":"bytes32","name":"uid","type":"bytes32"}],"name":"getAttestation","outputs":[{"components":[{"internalType":"bytes32","name":"uid","type":"bytes32"},{"internalType":"bytes32","name":"schema","type":"bytes32"},{"internalType":"uint64","name":"time","type":"uint64"},{"internalType":"uint64","name":"expirationTime","type":"uint64"},{"internalType":"uint64","name":"revocationTime","type":"uint64"},{"internalType":"bytes32","name":"refUID","type":"bytes32"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"address","name":"attester","type":"address"},{"internalType":"bool","name":"revocable","type":"bool"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"structAttestation","name":"","type":"tuple"}],"stateMutability":"view","type":"function"}];

async function main() {
  console.log('========================================');
  console.log('       Giwa Dojang 컨트랙트 조회         ');
  console.log('========================================\n');

  // 1. DojangScroll - 몇 개 주소 KYC 확인
  console.log('=== 1. DojangScroll - KYC 확인 ===');
  const testAddresses = [
    '0x0000000000000000000000000000000000000001',
    '0x0000000000000000000000000000000000000002',
  ];

  for (const addr of testAddresses) {
    try {
      const isVerified = await client.readContract({
        address: contracts.DojangScroll as `0x${string}`,
        abi: dojangScrollAbi,
        functionName: 'isVerified',
        args: [addr as `0x${string}`, UPBIT_KOREA],
      });
      console.log(`${addr}: ${isVerified ? '✅ Verified' : '❌ Not verified'}`);
    } catch (e: any) {
      console.log(`${addr}: Error - ${e.message?.slice(0, 100)}`);
    }
  }

  // 2. EAS에서 직접 Attested 이벤트 로그 가져오기
  console.log('\n=== 2. EAS Attested 이벤트 조회 ===');
  try {
    const logs = await client.getLogs({
      address: contracts.EAS as `0x${string}`,
      event: {
        type: 'event',
        name: 'Attested',
        inputs: [
          { type: 'address', name: 'recipient', indexed: true },
          { type: 'address', name: 'attester', indexed: true },
          { type: 'bytes32', name: 'uid', indexed: false },
          { type: 'bytes32', name: 'schema', indexed: true },
        ],
      },
      fromBlock: 0n,
      toBlock: 'latest',
    });

    console.log(`Total attestations found: ${logs.length}`);
    
    if (logs.length > 0) {
      console.log('\n--- 첫 5개 attestation ---');
      for (let i = 0; i < Math.min(5, logs.length); i++) {
        const log = logs[i];
        console.log(`\n[${i + 1}]`);
        console.log('  recipient:', log.args.recipient);
        console.log('  attester:', log.args.attester);
        console.log('  uid:', log.args.uid);
        
        // 이 recipient로 isVerified 확인
        if (log.args.recipient) {
          const verified = await client.readContract({
            address: contracts.DojangScroll as `0x${string}`,
            abi: dojangScrollAbi,
            functionName: 'isVerified',
            args: [log.args.recipient, UPBIT_KOREA],
          });
          console.log('  isVerified:', verified ? '✅' : '❌');
        }
      }
    }
  } catch (e: any) {
    console.log('Error:', e.message?.slice(0, 200));
  }
}

main().catch(console.error);