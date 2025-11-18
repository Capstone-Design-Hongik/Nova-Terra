import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  MapPin,
  TrendingUp,
  Users,
  Calendar,
  Building,
  DollarSign,
  ArrowLeft,
} from "lucide-react";
import property1 from "@/assets/property-1.jpg";

const PropertyDetail = () => {
  const { id } = useParams();
  const [tokenAmount, setTokenAmount] = useState(100);

  // Mock data
  const property = {
    id: 1,
    name: "서울 강남 프리미엄 오피스",
    location: "서울시 강남구 테헤란로 123",
    image: property1,
    expectedReturn: "8.5%",
    totalTokens: 100000,
    availableTokens: 45000,
    pricePerToken: 50000,
    description:
      "강남 중심부에 위치한 최고급 오피스 빌딩입니다. 안정적인 임차인과 장기 계약으로 안정적인 수익을 보장합니다.",
    details: {
      buildingType: "상업용 오피스",
      totalArea: "5,000㎡",
      buildYear: "2020년",
      tenants: "삼성전자, 네이버, 카카오 외 5개사",
      monthlyRent: "KRWT250,000,000",
      occupancyRate: "100%",
    },
  };

  const soldPercentage =
    ((property.totalTokens - property.availableTokens) / property.totalTokens) *
    100;

  const totalInvestment = tokenAmount * property.pricePerToken;
  const expectedMonthlyReturn = totalInvestment * 0.085 / 12;

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Back Button */}
        <Link to="/properties">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            목록으로
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden animate-fade-in">
              <img
                src={property.image}
                alt={property.name}
                className="w-full h-96 object-cover"
              />
              <Badge className="absolute top-6 right-6 bg-success text-lg px-4 py-2">
                {property.expectedReturn} 예상 수익률
              </Badge>
            </div>

            {/* Title & Location */}
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold mb-4 text-gradient">
                {property.name}
              </h1>
              <div className="flex items-center text-muted-foreground text-lg">
                <MapPin className="w-5 h-5 mr-2" />
                {property.location}
              </div>
            </div>

            {/* Description */}
            <Card className="card-gradient animate-fade-in">
              <CardHeader>
                <CardTitle>프로젝트 소개</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </CardContent>
            </Card>

            {/* Details */}
            <Card className="card-gradient animate-fade-in">
              <CardHeader>
                <CardTitle>부동산 상세 정보</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Building className="w-5 h-5 mr-3 mt-1 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">건물 유형</p>
                      <p className="font-semibold">{property.details.buildingType}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <TrendingUp className="w-5 h-5 mr-3 mt-1 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">총 면적</p>
                      <p className="font-semibold">{property.details.totalArea}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 mr-3 mt-1 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">준공연도</p>
                      <p className="font-semibold">{property.details.buildYear}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Users className="w-5 h-5 mr-3 mt-1 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">주요 임차인</p>
                      <p className="font-semibold">{property.details.tenants}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <DollarSign className="w-5 h-5 mr-3 mt-1 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">월 임대료</p>
                      <p className="font-semibold">
                        {property.details.monthlyRent}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <TrendingUp className="w-5 h-5 mr-3 mt-1 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">입주율</p>
                      <p className="font-semibold">
                        {property.details.occupancyRate}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Investment Panel */}
          <div className="space-y-6">
            <Card className="card-gradient sticky top-24 animate-fade-in">
              <CardHeader>
                <CardTitle>투자하기</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Token Stats */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">판매 진행률</span>
                    <span className="font-semibold">{soldPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={soldPercentage} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">남은 토큰</span>
                    <span className="font-semibold text-primary">
                      {property.availableTokens.toLocaleString()} / {property.totalTokens.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">토큰당 가격</p>
                  <p className="text-2xl font-bold text-accent">
                    KRWT{property.pricePerToken.toLocaleString()}
                  </p>
                </div>

                {/* Investment Amount */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">구매 수량</label>
                  <Input
                    type="number"
                    value={tokenAmount}
                    onChange={(e) => setTokenAmount(Number(e.target.value))}
                    min="1"
                    max={property.availableTokens}
                    className="text-lg"
                  />
                  <p className="text-xs text-muted-foreground">
                    최소 1개 ~ 최대 {property.availableTokens.toLocaleString()}개
                  </p>
                </div>

                {/* Calculation */}
                <div className="space-y-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex justify-between">
                    <span className="text-sm">총 투자금액</span>
                    <span className="font-bold">
                      KRWT{totalInvestment.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">예상 월 수익</span>
                    <span className="font-bold text-success">
                      KRWT{expectedMonthlyReturn.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <Button className="w-full bg-gradient-primary hover:opacity-90 glow-effect text-lg py-6">
                  토큰 구매하기
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  투자에는 원금 손실의 위험이 있습니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetail;
