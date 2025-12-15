// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IInterfaces.sol";

interface IPermit2 {
    struct TokenPermissions {
        address token;
        uint256 amount;
    }
    
    struct PermitTransferFrom {
        TokenPermissions permitted;
        uint256 nonce;
        uint256 deadline;
    }
    
    struct SignatureTransferDetails {
        address to;
        uint256 requestedAmount;
    }
    
    function permitTransferFrom(
        PermitTransferFrom calldata permit,
        SignatureTransferDetails calldata transferDetails,
        address owner,
        bytes calldata signature
    ) external;
}

/**
 * @title PropertyToken
 * @dev ERC-3643 기반 부동산 Security Token
 *      Permit2를 통한 가스 효율적인 구매 지원
 */
contract PropertyToken is IPropertyToken {
    
    // ============================================
    //                  STATE
    // ============================================
    
    string public name;
    string public symbol;
    uint8 public constant decimals = 18;
    uint256 public maxSupply; //최대 발행량
    uint256 public totalSupply; //현 유통중인 발행량
    bool public initialized;
    
    address public owner;
    bool public paused;
    
    // 외부 컨트랙트 참조
    IIdentityRegistry public identityRegistry;
    IModularCompliance public compliance;
    
    // 결제
    IERC20 public paymentToken; //KRWT
    uint256 public tokenPrice; //STO 1토큰당 가격 (paymentToken 단위)
    
    // Permit2 (모든 체인 동일 주소)
    IPermit2 public constant PERMIT2 = IPermit2(0x000000000022D473030F116dDEE9F6B43aC78BA3);
    
    // 잔액
    mapping(address => uint256) public balanceOf;
    
    // 승인 (ERC-20 호환)
    mapping(address => mapping(address => uint256)) public allowance;
    
    // 부동산 정보
    bytes32 public propertyId;
    string public propertyURI;

    // ============================================
    //              SNAPSHOT STATE
    // ============================================
    
    uint256 public currentSnapshotId;
    
    // 스냅샷 ID => 총 발행량
    mapping(uint256 => uint256) private _snapshotTotalSupply;
    
    // 스냅샷 ID => 주소 => 잔액
    mapping(uint256 => mapping(address => uint256)) private _snapshotBalances;
    
    // 스냅샷 ID => 주소 => 기록 여부
    mapping(uint256 => mapping(address => bool)) private _snapshotted;

    // ============================================
    //                  EVENTS
    // ============================================
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Paused(address account);
    event Unpaused(address account);
    event IdentityRegistrySet(address indexed registry);
    event ComplianceSet(address indexed compliance);
    event InitialMinted(address indexed propertyOwner, uint256 amount);
    event TokensPurchased(address indexed buyer, uint256 amount, uint256 cost);
    event Withdrawn(address indexed to, uint256 amount);
    event TokenPriceUpdated(uint256 oldPrice, uint256 newPrice);
    event SnapshotCreated(uint256 indexed snapshotId, uint256 totalSupply);
    
    // ============================================
    //                MODIFIERS
    // ============================================
    
    modifier onlyOwner() {
        require(msg.sender == owner, "PropertyToken: not owner");
        _;
    }
    
    modifier whenNotPaused() {
        require(!paused, "PropertyToken: paused");
        _;
    }
    
    // ============================================
    //               CONSTRUCTOR
    // ============================================
    
    constructor(
        address _owner,
        string memory _name,
        string memory _symbol,
        bytes32 _propertyId,
        uint256 _maxSupply,
        address _identityRegistry,
        address _compliance,
        address _paymentToken, //KRWT address
        uint256 _tokenPrice //
    ) {
        require(_maxSupply > 0, "PropertyToken: zero max supply");
        require(_identityRegistry != address(0), "PropertyToken: zero registry");
        require(_compliance != address(0), "PropertyToken: zero compliance");
        require(_paymentToken != address(0), "PropertyToken: zero payment token");
        require(_tokenPrice > 0, "PropertyToken: zero price");
        
        name = _name;
        symbol = _symbol;
        propertyId = _propertyId;
        maxSupply = _maxSupply;
        owner = _owner;
        
        identityRegistry = IIdentityRegistry(_identityRegistry);
        compliance = IModularCompliance(_compliance);
        paymentToken = IERC20(_paymentToken);
        tokenPrice = _tokenPrice;
    }

    // ============================================
    //              SNAPSHOT FUNCTIONS
    // ============================================
    
    /**
     * @dev 스냅샷 생성 (배당 기준일)
     */
    function snapshot() external onlyOwner returns (uint256 snapshotId) {
        currentSnapshotId++;
        snapshotId = currentSnapshotId;
        
        _snapshotTotalSupply[snapshotId] = totalSupply;
        
        emit SnapshotCreated(snapshotId, totalSupply);
    }

    /**
     * @dev 스냅샷 시점 잔액 조회
     */
    function balanceOfAt(address account, uint256 snapshotId) 
        external view returns (uint256) 
    {
        require(snapshotId > 0 && snapshotId <= currentSnapshotId, "PropertyToken: invalid snapshot");
        
        // 스냅샷에 기록됐으면 그 값 반환
        if (_snapshotted[snapshotId][account]) {
            return _snapshotBalances[snapshotId][account];
        }
        
        // 기록 안 됐으면 현재 잔액 반환
        // (스냅샷 이후 변동 없었다는 뜻)
        return balanceOf[account];
    }

    /**
     * @dev 스냅샷 시점 총 발행량 조회
     */
    function totalSupplyAt(uint256 snapshotId) external view returns (uint256) {
        require(snapshotId > 0 && snapshotId <= currentSnapshotId, "PropertyToken: invalid snapshot");
        return _snapshotTotalSupply[snapshotId];
    }
    
    /**
     * @dev 스냅샷 업데이트 (내부 함수)
     *      전송 전에 호출해서 현재 잔액 기록
     */
    function _updateSnapshot(address account) private {
        if (currentSnapshotId > 0 && !_snapshotted[currentSnapshotId][account]) {
            _snapshotBalances[currentSnapshotId][account] = balanceOf[account];
            _snapshotted[currentSnapshotId][account] = true;
        }
    }


    
    // ============================================
    //              TOKEN OPERATIONS
    // ============================================
    
    /**
     * @dev 초기 발행 (의뢰인/원소유자에게)
     *      배포 직후 1번만 호출 가능
     */
    function initialMint(address propertyOwner, uint256 ownerAmount) 
        external onlyOwner 
    {
        require(!initialized, "PropertyToken: already initialized");
        require(ownerAmount <= maxSupply, "PropertyToken: exceeds max supply");
        
        if (propertyOwner == address(0)) {
            require(ownerAmount == 0, "PropertyToken: zero address should have zero amount");
        }
        
        initialized = true;
        
        if (ownerAmount > 0) {
            //신원 검증
            require(
              identityRegistry.isVerified(propertyOwner),
              "PropertyToken: owner not verified"
            );

            //컴플라이언스 체크
            require(
              compliance.canTransfer(address(0), propertyOwner, ownerAmount),
              "PropertyToken: compliance failed"
            );

            totalSupply = ownerAmount;
            balanceOf[propertyOwner] = ownerAmount;

            compliance.created(propertyOwner, ownerAmount); 

            emit Transfer(address(0), propertyOwner, ownerAmount);
        }
        
        emit InitialMinted(propertyOwner, ownerAmount);
    }
    
    /**
     * @dev Permit2로 구매 (추천! 서명 1번 + 트랜잭션 1번)
     *      사전에 paymentToken.approve(PERMIT2, unlimited) 필요 (최초 1회)
     */
    function buyWithPermit( //mint
        uint256 amount,
        uint256 nonce,
        uint256 deadline,
        bytes calldata signature
    ) external whenNotPaused {
        require(initialized, "PropertyToken: not initialized");
        require(amount > 0, "PropertyToken: zero amount");
        require(totalSupply + amount <= maxSupply, "PropertyToken: exceeds max supply");
        require(block.timestamp <= deadline, "PropertyToken: permit expired");
        
        // 신원 검증
        require(
            identityRegistry.isVerified(msg.sender),
            "PropertyToken: not verified"
        );
        
        // 컴플라이언스 체크
        require(
            compliance.canTransfer(address(0), msg.sender, amount),
            "PropertyToken: compliance failed"
        );
        
        // Permit2로 결제
        uint256 cost = amount * tokenPrice;
        PERMIT2.permitTransferFrom(
            IPermit2.PermitTransferFrom({
                permitted: IPermit2.TokenPermissions({
                    token: address(paymentToken),
                    amount: cost
                }),
                nonce: nonce,
                deadline: deadline
            }),
            IPermit2.SignatureTransferDetails({
                to: address(this),
                requestedAmount: cost
            }),
            msg.sender,
            signature
        );
        
        // 스냅샷 업데이트
        _updateSnapshot(msg.sender);

        // 발행
        totalSupply += amount;
        balanceOf[msg.sender] += amount;
        
        compliance.created(msg.sender, amount);
        
        emit Transfer(address(0), msg.sender, amount);
        emit TokensPurchased(msg.sender, amount, cost);
    }
    
    /**
     * @dev 일반 구매 (기존 방식 - approve 필요)
     *      사전에 paymentToken.approve(이 컨트랙트, 금액) 필요
     */
    function buy(uint256 amount) external whenNotPaused {
        require(initialized, "PropertyToken: not initialized");
        require(amount > 0, "PropertyToken: zero amount");
        require(totalSupply + amount <= maxSupply, "PropertyToken: exceeds max supply");
        
        // 신원 검증
        require(
            identityRegistry.isVerified(msg.sender),
            "PropertyToken: not verified"
        );
        
        // 컴플라이언스 체크
        require(
            compliance.canTransfer(address(0), msg.sender, amount),
            "PropertyToken: compliance failed"
        );
        
        // 결제 (스테이블코인 → 이 컨트랙트로)
        uint256 cost = amount * tokenPrice;
        require(
            paymentToken.transferFrom(msg.sender, address(this), cost),
            "PropertyToken: payment failed"
        );
        
        // 스냅샷 업데이트
        _updateSnapshot(msg.sender);

        // 발행
        totalSupply += amount;
        balanceOf[msg.sender] += amount;
        
        compliance.created(msg.sender, amount);
        
        emit Transfer(address(0), msg.sender, amount);
        emit TokensPurchased(msg.sender, amount, cost);
    }
    
    /**
     * @dev 관리자 발행 (결제 없이)
     */
    function mint(address to, uint256 amount) external override onlyOwner whenNotPaused {
        require(initialized, "PropertyToken: not initialized");
        require(to != address(0), "PropertyToken: mint to zero");
        require(amount > 0, "PropertyToken: zero amount");
        require(totalSupply + amount <= maxSupply, "PropertyToken: exceeds max supply");
        
        // 신원 검증
        require(
            identityRegistry.isVerified(to),
            "PropertyToken: recipient not verified"
        );
        
        // 컴플라이언스 체크
        require(
            compliance.canTransfer(address(0), to, amount),
            "PropertyToken: compliance failed"
        );
        
        // 스냅샷 업데이트
        _updateSnapshot(to);

        totalSupply += amount;
        balanceOf[to] += amount;
        
        compliance.created(to, amount);
        
        emit Transfer(address(0), to, amount);
    }
    
    /**
     * @dev 토큰 소각 (환매)
     */
    function burn(address from, uint256 amount) external override onlyOwner whenNotPaused {
        require(from != address(0), "PropertyToken: burn from zero");
        require(balanceOf[from] >= amount, "PropertyToken: insufficient balance");

        // 스냅샷 업데이트
        _updateSnapshot(from);

        balanceOf[from] -= amount;
        totalSupply -= amount;
        
        compliance.destroyed(from, amount);
        
        emit Transfer(from, address(0), amount);
    }
    
    /**
     * @dev 토큰 전송
     */
    function transfer(address to, uint256 amount) 
        external whenNotPaused returns (bool) 
    {
        return _transfer(msg.sender, to, amount);
    }
    
    /**
     * @dev 위임 전송
     */
    function transferFrom(address from, address to, uint256 amount) 
        external whenNotPaused returns (bool) 
    {
        uint256 currentAllowance = allowance[from][msg.sender];
        require(currentAllowance >= amount, "PropertyToken: insufficient allowance");
        
        allowance[from][msg.sender] = currentAllowance - amount;
        
        return _transfer(from, to, amount);
    }
    
    /**
     * @dev 내부 전송 로직
     */
    function _transfer(address from, address to, uint256 amount) internal returns (bool) {
        require(from != address(0), "PropertyToken: from zero");
        require(to != address(0), "PropertyToken: to zero");
        require(balanceOf[from] >= amount, "PropertyToken: insufficient balance");
        
        // 신원 검증
        require(
            identityRegistry.isVerified(from),
            "PropertyToken: sender not verified"
        );
        require(
            identityRegistry.isVerified(to),
            "PropertyToken: recipient not verified"
        );
        
        // 컴플라이언스 체크
        require(
            compliance.canTransfer(from, to, amount),
            "PropertyToken: compliance failed"
        );

        // 스냅샷 업데이트 (전송 전!)
        _updateSnapshot(from);
        _updateSnapshot(to);
        
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        
        compliance.transferred(from, to, amount);
        
        emit Transfer(from, to, amount);
        return true;
    }
    
    // ============================================
    //              ERC-20 FUNCTIONS
    // ============================================
    
    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    // ============================================
    //              VIEW FUNCTIONS
    // ============================================
    
    function remainingSupply() external view returns (uint256) {
        return maxSupply - totalSupply;
    }
    
    function getContractBalance() external view returns (uint256) {
        return paymentToken.balanceOf(address(this));
    }
    
    function getCost(uint256 amount) external view returns (uint256) {
        return amount * tokenPrice;
    }
    
    // ============================================
    //            ADMIN FUNCTIONS
    // ============================================
    
    function withdraw(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "PropertyToken: zero address");
        require(
            paymentToken.transfer(to, amount),
            "PropertyToken: withdraw failed"
        );
        emit Withdrawn(to, amount);
    }
    
    function setTokenPrice(uint256 newPrice) external onlyOwner {
        require(newPrice > 0, "PropertyToken: zero price");
        uint256 oldPrice = tokenPrice;
        tokenPrice = newPrice;
        emit TokenPriceUpdated(oldPrice, newPrice);
    }
    
    function pause() external override onlyOwner {
        paused = true;
        emit Paused(msg.sender);
    }
    
    function unpause() external override onlyOwner {
        paused = false;
        emit Unpaused(msg.sender);
    }
    
    function setIdentityRegistry(address registry) external override onlyOwner {
        require(registry != address(0), "PropertyToken: zero address");
        identityRegistry = IIdentityRegistry(registry);
        emit IdentityRegistrySet(registry);
    }
    
    function setCompliance(address _compliance) external override onlyOwner {
        require(_compliance != address(0), "PropertyToken: zero address");
        compliance = IModularCompliance(_compliance);
        emit ComplianceSet(_compliance);
    }
    
    function setPropertyURI(string calldata uri) external onlyOwner {
        propertyURI = uri;
    }
    
    // ============================================
    //          FORCED TRANSFER (규제용)
    // ============================================
    
    function forcedTransfer(address from, address to, uint256 amount) 
        external onlyOwner returns (bool) 
    {
        require(balanceOf[from] >= amount, "PropertyToken: insufficient balance");
        
        // 스냅샷 업데이트
        _updateSnapshot(from);
        _updateSnapshot(to);
        
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        
        emit Transfer(from, to, amount);
        return true;
    }
}