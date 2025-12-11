import { createPublicClient, http, parseAbi } from 'viem';

const client = createPublicClient({
  transport: http('https://sepolia-rpc.giwa.io/')
});

const DOJANG_SCROLL = '0xd5077b67dcb56caC8b270C7788FC3E6ee03F17B9';
const UPBIT_KOREA = '0xd99b42e778498aa3c9c1f6a012359130252780511687a35982e8e52735453034';

const abi = parseAbi([
  'function isVerified(address, bytes32) view returns (bool)',
]);

async function check(address: string) {
  const result = await client.readContract({
    address: DOJANG_SCROLL as `0x${string}`,
    abi,
    functionName: 'isVerified',
    args: [address as `0x${string}`, UPBIT_KOREA as `0x${string}`],
  });
  console.log(`${address}: ${result ? '✅ Verified!' : '❌ Not verified'}`);
}

// 여기에 네 업비트 지갑 주소 넣어봐
check('0x0e99e6a1eb0f4c3f31c5be2a49e39bdb964e9d5e');
check('0x4097bF3Cb731AEB3E501b910B33B2aF9Fa68E388');
check('0x0000000000000000000000000000000000000000');