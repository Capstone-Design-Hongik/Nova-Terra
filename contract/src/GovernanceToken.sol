// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GovernanceToken is ERC20, ERC20Permit, ERC20Votes, Ownable {
    IERC20 public stoToken;

    constructor(address _stoTokenAddress)
        ERC20("GovernanceToken", "GOV")
        ERC20Permit("GovernanceToken")
        Ownable(msg.sender)  // Ownable 생성자에 초기 소유자 전달
    {
        stoToken = IERC20(_stoTokenAddress);
    }

    // STO 토큰 보유량에 따라 거버넌스 토큰 민팅
    function mintGovernanceTokens(address account) external onlyOwner {
        uint256 stoBalance = stoToken.balanceOf(account);
        _mint(account, stoBalance);
    }

    // 거버넌스 토큰 소각 (STO 토큰 감소 시)
    function burnGovernanceTokens(address account) external onlyOwner {
        uint256 stoBalance = stoToken.balanceOf(account);
        uint256 currentBalance = balanceOf(account);
        if (currentBalance > stoBalance) {
            _burn(account, currentBalance - stoBalance);
        }
    }

    // ERC20Votes와 ERC20에서 요구하는 _update 오버라이드
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._update(from, to, amount);
    }

    // ERC20Votes에서 요구하는 nonces 오버라이드
    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}