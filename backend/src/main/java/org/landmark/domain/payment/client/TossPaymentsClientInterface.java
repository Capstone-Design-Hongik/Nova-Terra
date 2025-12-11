package org.landmark.domain.payment.client;

import org.landmark.domain.payment.dto.toss.TossVirtualAccountRequest;
import org.landmark.domain.payment.dto.toss.TossVirtualAccountResponse;

public interface TossPaymentsClientInterface {
    TossVirtualAccountResponse issueVirtualAccount(TossVirtualAccountRequest request);
}
