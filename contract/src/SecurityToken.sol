// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// OpenZeppelin 라이브러리 사용
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// ERC-1400 기반 인터페이스 (기본적인 기능 정의)
interface IERC1400 {
    function isWhitelisted(address account) external view returns (bool);
    function lockTokens(address account, uint256 amount) external;
    function unlockTokens(address account, uint256 amount) external;
    function distributeDividends() external payable;
}

contract SecurityToken is IERC20, IERC1400, Ownable {
    // 토큰 정보
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 private _totalSupply;

    // 화이트리스트 및 락업
    mapping(address => bool) private whitelist; // KYC 통과 여부
    mapping(address => uint256) private balances; // 사용자별 잔고
    mapping(address => uint256) private lockedBalances; // 락업된 토큰 수량

    // 배당금 관리
    uint256 public totalDividendsDistributed;
    mapping(address => uint256) private lastDividendClaimed;

    // 이벤트
    event Whitelisted(address indexed account, bool isWhitelisted);
    event TokensLocked(address indexed account, uint256 amount);
    event TokensUnlocked(address indexed account, uint256 amount);
    event DividendsDistributed(uint256 totalDistributed);
    event DividendClaimed(address indexed account, uint256 amount);

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _initialSupply
    ) Ownable(msg.sender) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        _totalSupply = _initialSupply * (10 ** uint256(decimals));
        balances[msg.sender] = _totalSupply;

        emit Transfer(address(0), msg.sender, _totalSupply); // 초기 발행 이벤트
    }

    // ------------------------------
    // ERC-20 기본 기능 구현
    // ------------------------------

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return balances[account];
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        require(isWhitelisted(msg.sender), "Sender is not whitelisted");
        require(isWhitelisted(recipient), "Recipient is not whitelisted");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        require(balances[msg.sender] - lockedBalances[msg.sender] >= amount, "Insufficient unlocked balance");

        balances[msg.sender] -= amount;
        balances[recipient] += amount;

        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        // ERC-20 approve 기능 구현 (생략 가능)
        return true;
    }

    function allowance(address owner, address spender) public view override returns (uint256) {
        // ERC-20 allowance 기능 구현 (생략 가능)
        return 0;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        // ERC-20 transferFrom 기능 구현 (생략 가능)
        return true;
    }

    // ------------------------------
    // ERC-1400 고급 기능 구현
    // ------------------------------

    // 화이트리스트 추가
    function addToWhitelist(address account) external onlyOwner {
        whitelist[account] = true;
        emit Whitelisted(account, true);
    }

    // 화이트리스트 제거
    function removeFromWhitelist(address account) external onlyOwner {
        whitelist[account] = false;
        emit Whitelisted(account, false);
    }

    // 화이트리스트 확인
    function isWhitelisted(address account) public view override returns (bool) {
        return whitelist[account];
    }

    // 토큰 락업
    function lockTokens(address account, uint256 amount) external override onlyOwner {
        require(balances[account] >= amount, "Insufficient balance to lock");
        lockedBalances[account] += amount;
        emit TokensLocked(account, amount);
    }

    // 락업 해제
    function unlockTokens(address account, uint256 amount) external override onlyOwner {
        require(lockedBalances[account] >= amount, "Not enough locked tokens");
        lockedBalances[account] -= amount;
        emit TokensUnlocked(account, amount);
    }

    // 락업된 토큰 확인
    function lockedBalanceOf(address account) public view returns (uint256) {
        return lockedBalances[account];
    }

    // 배당금 분배
    function distributeDividends() external payable override onlyOwner {
        require(msg.value > 0, "No funds sent for dividends");
        uint256 totalDistributed = msg.value;

        for (uint256 i = 0; i < _totalSupply; i++) {
            address recipient = address(uint160(i)); // 각 토큰 보유자 주소
            uint256 balance = balances[recipient];
            if (balance > 0) {
                uint256 userShare = (balance * totalDistributed) / _totalSupply;
                payable(recipient).transfer(userShare);
            }
        }

        totalDividendsDistributed += totalDistributed;
        emit DividendsDistributed(totalDistributed);
    }

    // 배당금 수동 청구
    function claimDividend() external {
        require(isWhitelisted(msg.sender), "Sender is not whitelisted");
        uint256 userBalance = balances[msg.sender];
        require(userBalance > 0, "No tokens owned");

        uint256 totalIncome = totalDividendsDistributed;
        uint256 userShare = (userBalance * totalIncome) / _totalSupply;

        payable(msg.sender).transfer(userShare);
        lastDividendClaimed[msg.sender] = block.timestamp;

        emit DividendClaimed(msg.sender, userShare);
    }

    // 스마트 컨트랙트 잔고 확인
    function contractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // 긴급 상황에서 배당금 수익 출금
    function emergencyWithdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
