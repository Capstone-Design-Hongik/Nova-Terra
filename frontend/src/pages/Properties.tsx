import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const Properties = () => {
  const [filter, setFilter] = useState("all");

  const properties = [
    {
      id: 1,
      name: "서울 강남 프리미엄 오피스",
      location: "서울시 강남구",
      image: property1,
      expectedReturn: "8.5%",
      totalTokens: "100,000",
      availableTokens: "45,000",
      pricePerToken: "KRWT50,000",
      category: "commercial",
    },
    {
      id: 2,
      name: "판교 테크노밸리 빌딩",
      location: "경기도 성남시",
      image: property2,
      expectedReturn: "7.2%",
      totalTokens: "150,000",
      availableTokens: "82,000",
      pricePerToken: "KRWT35,000",
      category: "commercial",
    },
    {
      id: 3,
      name: "송도 센트럴파크 레지던스",
      location: "인천시 연수구",
      image: property3,
      expectedReturn: "9.1%",
      totalTokens: "80,000",
      availableTokens: "21,000",
      pricePerToken: "KRWT65,000",
      category: "residential",
    },
  ];

  const filteredProperties =
    filter === "all"
      ? properties
      : properties.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-gradient">투자 가능한 부동산</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            블록체인 기술로 소유하는 프리미엄 부동산
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8 animate-fade-in">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-gradient-primary" : ""}
          >
            전체
          </Button>
          <Button
            variant={filter === "commercial" ? "default" : "outline"}
            onClick={() => setFilter("commercial")}
            className={filter === "commercial" ? "bg-gradient-primary" : ""}
          >
            상업용
          </Button>
          <Button
            variant={filter === "residential" ? "default" : "outline"}
            onClick={() => setFilter("residential")}
            className={filter === "residential" ? "bg-gradient-primary" : ""}
          >
            주거용
          </Button>
        </div>

        {/* Properties Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property, index) => (
            <Card
              key={property.id}
              className="card-gradient border-border hover-lift overflow-hidden group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <Badge className="absolute top-4 right-4 bg-success">
                  {property.expectedReturn} 수익률
                </Badge>
              </div>

              <CardHeader>
                <h3 className="text-xl font-bold mb-2">{property.name}</h3>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{property.location}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="w-4 h-4 mr-1" />
                    <span>총 토큰</span>
                  </div>
                  <span className="font-semibold">{property.totalTokens}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>남은 토큰</span>
                  </div>
                  <span className="font-semibold text-primary">
                    {property.availableTokens}
                  </span>
                </div>

                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      토큰당 가격
                    </span>
                    <span className="text-lg font-bold text-accent">
                      {property.pricePerToken}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Link to={`/properties/${property.id}`} className="w-full">
                  <Button className="w-full bg-gradient-primary hover:opacity-90 group">
                    상세 보기
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Properties;
