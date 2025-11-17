import Navigation from "@/components/Navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, ShoppingCart, User } from "lucide-react";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const Marketplace = () => {
  const listings = [
    {
      id: 1,
      property: "서울 강남 프리미엄 오피스",
      image: property1,
      seller: "김투자",
      tokens: 50,
      pricePerToken: 52000,
      originalPrice: 50000,
      change: 4.0,
      trending: "up",
    },
    {
      id: 2,
      property: "판교 테크노밸리 빌딩",
      image: property2,
      seller: "이부동산",
      tokens: 100,
      pricePerToken: 34500,
      originalPrice: 35000,
      change: -1.4,
      trending: "down",
    },
    {
      id: 3,
      property: "송도 센트럴파크 레지던스",
      image: property3,
      seller: "박자산",
      tokens: 30,
      pricePerToken: 66000,
      originalPrice: 65000,
      change: 1.5,
      trending: "up",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-gradient">토큰 마켓플레이스</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            투자자 간 자유로운 토큰 거래
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="card-gradient hover-lift animate-fade-in">
            <CardHeader>
              <p className="text-sm text-muted-foreground">총 거래량 (24시간)</p>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">KRWT125,450,000</p>
              <div className="flex items-center text-success mt-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">+12.5%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient hover-lift animate-fade-in">
            <CardHeader>
              <p className="text-sm text-muted-foreground">활성 거래</p>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">48개</p>
              <p className="text-sm text-muted-foreground mt-2">
                현재 판매 중인 토큰
              </p>
            </CardContent>
          </Card>

          <Card className="card-gradient hover-lift animate-fade-in">
            <CardHeader>
              <p className="text-sm text-muted-foreground">평균 가격 변동</p>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-success">+3.2%</p>
              <p className="text-sm text-muted-foreground mt-2">지난 7일간</p>
            </CardContent>
          </Card>
        </div>

        {/* Listings */}
        <Card className="card-gradient animate-fade-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">판매 중인 토큰</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  가격순
                </Button>
                <Button variant="outline" size="sm">
                  최신순
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="flex flex-col md:flex-row gap-6 p-6 rounded-lg bg-muted/30 border border-border hover-lift"
                >
                  {/* Property Image */}
                  <img
                    src={listing.image}
                    alt={listing.property}
                    className="w-full md:w-48 h-32 object-cover rounded-lg"
                  />

                  {/* Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold mb-2">
                          {listing.property}
                        </h3>
                        <div className="flex items-center text-muted-foreground">
                          <User className="w-4 h-4 mr-1" />
                          <span className="text-sm">판매자: {listing.seller}</span>
                        </div>
                      </div>
                      <Badge
                        className={
                          listing.trending === "up"
                            ? "bg-success"
                            : "bg-destructive"
                        }
                      >
                        {listing.trending === "up" ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {listing.change > 0 ? "+" : ""}
                        {listing.change}%
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          판매 수량
                        </p>
                        <p className="font-bold text-lg">{listing.tokens}개</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          토큰당 가격
                        </p>
                        <p className="font-bold text-lg text-accent">
                          KRWT{listing.pricePerToken.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          원래 가격
                        </p>
                        <p className="font-semibold text-muted-foreground line-through">
                          KRWT{listing.originalPrice.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          총 금액
                        </p>
                        <p className="font-bold text-lg">
                          KRWT
                          {(
                            listing.tokens * listing.pricePerToken
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Input
                        type="number"
                        placeholder="구매 수량"
                        defaultValue={1}
                        min={1}
                        max={listing.tokens}
                        className="max-w-32"
                      />
                      <Button className="bg-gradient-primary hover:opacity-90 glow-effect">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        구매하기
                      </Button>
                      <Button variant="outline">상세 보기</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sell CTA */}
        <Card className="card-gradient mt-8 animate-fade-in glow-effect">
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gradient">
                보유 토큰을 판매하고 싶으신가요?
              </h2>
              <p className="text-muted-foreground text-lg">
                간편하게 마켓플레이스에 등록하고 원하는 가격에 판매하세요
              </p>
              <Button
                size="lg"
                className="bg-gradient-primary hover:opacity-90 mt-6"
              >
                판매 등록하기
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Marketplace;
