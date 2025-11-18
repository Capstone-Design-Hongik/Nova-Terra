import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Wallet,
  TrendingUp,
  DollarSign,
  Calendar,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";

const Portfolio = () => {
  const portfolioStats = {
    totalInvestment: 15000000,
    currentValue: 16250000,
    totalReturn: 1250000,
    monthlyIncome: 125000,
    returnRate: 8.3,
  };

  const investments = [
    {
      id: 1,
      name: "서울 강남 프리미엄 오피스",
      image: property1,
      tokens: 200,
      investmentAmount: 10000000,
      currentValue: 10800000,
      monthlyReturn: 85000,
      returnRate: 8.5,
      change: 8.0,
    },
    {
      id: 2,
      name: "판교 테크노밸리 빌딩",
      image: property2,
      tokens: 150,
      investmentAmount: 5000000,
      currentValue: 5450000,
      monthlyReturn: 40000,
      returnRate: 7.2,
      change: 9.0,
    },
  ];

  const transactions = [
    {
      id: 1,
      type: "배당",
      property: "서울 강남 프리미엄 오피스",
      amount: 85000,
      date: "2025-01-15",
      status: "완료",
    },
    {
      id: 2,
      type: "구매",
      property: "판교 테크노밸리 빌딩",
      amount: -5000000,
      date: "2025-01-10",
      status: "완료",
    },
    {
      id: 3,
      type: "배당",
      property: "서울 강남 프리미엄 오피스",
      amount: 85000,
      date: "2024-12-15",
      status: "완료",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-gradient">내 포트폴리오</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            투자 현황과 수익을 한눈에 확인하세요
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="card-gradient hover-lift animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                총 투자금액
              </CardTitle>
              <Wallet className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                KRWT{portfolioStats.totalInvestment.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient hover-lift animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                현재 평가액
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                KRWT{portfolioStats.currentValue.toLocaleString()}
              </div>
              <div className="flex items-center text-sm text-success mt-1">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                {portfolioStats.returnRate}%
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient hover-lift animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                총 수익
              </CardTitle>
              <DollarSign className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                KRWT{portfolioStats.totalReturn.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient hover-lift animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                월 수익
              </CardTitle>
              <Calendar className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                KRWT{portfolioStats.monthlyIncome.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investments */}
        <Card className="card-gradient mb-12 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              보유 부동산
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {investments.map((investment) => (
                <div
                  key={investment.id}
                  className="flex flex-col md:flex-row gap-4 p-4 rounded-lg bg-muted/30 border border-border hover-lift"
                >
                  <img
                    src={investment.image}
                    alt={investment.name}
                    className="w-full md:w-32 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{investment.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          보유 토큰: {investment.tokens}개
                        </p>
                      </div>
                      <Badge className="bg-success">
                        {investment.returnRate}% 수익률
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          투자금액
                        </p>
                        <p className="font-semibold">
                          KRWT{investment.investmentAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          현재가치
                        </p>
                        <p className="font-semibold text-success">
                          KRWT{investment.currentValue.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          월 수익
                        </p>
                        <p className="font-semibold text-primary">
                          KRWT{investment.monthlyReturn.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Progress
                        value={(investment.change / 100) * 100}
                        className="flex-1 mr-4 h-2"
                      />
                      <span className="text-sm font-semibold text-success flex items-center">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        +{investment.change}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="card-gradient animate-fade-in">
          <CardHeader>
            <CardTitle>거래 내역</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border hover-lift"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.amount > 0 ? "bg-success/20" : "bg-primary/20"
                      }`}
                    >
                      {tx.amount > 0 ? (
                        <ArrowUpRight className="w-5 h-5 text-success" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{tx.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {tx.property}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        tx.amount > 0 ? "text-success" : "text-foreground"
                      }`}
                    >
                      {tx.amount > 0 ? "+" : ""}KRWT
                      {Math.abs(tx.amount).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Portfolio;
