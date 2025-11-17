import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  TrendingUp,
  Users,
  Coins,
  Building2,
  Lock,
  Globe,
  ArrowRight,
  Zap,
  CheckCircle2,
} from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const Index = () => {
  const features = [
    {
      icon: Shield,
      title: "투명성",
      description: "블록체인 기반 스마트 컨트랙트로 모든 거래를 투명하게 관리",
    },
    {
      icon: Coins,
      title: "접근성",
      description: "소액으로도 프리미엄 부동산에 투자할 수 있는 기회",
    },
    {
      icon: TrendingUp,
      title: "유동성",
      description: "2차 마켓플레이스를 통한 자유로운 토큰 거래",
    },
    {
      icon: Users,
      title: "커뮤니티",
      description: "토큰 보유자들이 함께하는 의사결정과 거버넌스",
    },
  ];

  const properties = [
    {
      id: 1,
      name: "서울 강남 프리미엄 오피스",
      location: "서울시 강남구",
      image: property1,
      expectedReturn: "8.5%",
      totalTokens: "100,000",
      availableTokens: "45,000",
    },
    {
      id: 2,
      name: "판교 테크노밸리 빌딩",
      location: "경기도 성남시",
      image: property2,
      expectedReturn: "7.2%",
      totalTokens: "150,000",
      availableTokens: "82,000",
    },
    {
      id: 3,
      name: "송도 센트럴파크 레지던스",
      location: "인천시 연수구",
      image: property3,
      expectedReturn: "9.1%",
      totalTokens: "80,000",
      availableTokens: "21,000",
    },
  ];

  const stats = [
    { label: "총 거래액", value: "KRWT125억" },
    { label: "활성 투자자", value: "2,500+" },
    { label: "부동산 프로젝트", value: "18개" },
    { label: "평균 수익률", value: "8.3%" },
  ];

  const benefits = [
    "KYC 인증으로 안전한 투자 환경",
    "실시간 포트폴리오 관리",
    "월세 수익 자동 분배",
    "투명한 거버넌스 시스템",
    "전문가 검증 부동산",
    "24/7 토큰 거래 가능",
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
        </div>

        <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <Badge className="bg-primary/20 text-primary border-primary/30 px-6 py-2 text-sm">
              <Zap className="w-4 h-4 mr-2 inline" />
              블록체인 기반 부동산 투자 플랫폼
            </Badge>

            <h1 className="text-6xl md:text-7xl font-bold leading-tight">
              <span className="text-gradient">NovaTerra</span>
              <br />
              <span className="text-4xl md:text-5xl">
                부동산 투자의 새로운 시대
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              블록체인 기술로 누구나 쉽게 프리미엄 부동산에 투자하고
              <br />
              안정적인 수익을 창출하세요
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                size="lg"
                className="bg-gradient-primary hover:opacity-90 glow-effect text-lg px-8 py-6"
              >
                투자 시작하기
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-primary/30 hover:bg-primary/10"
              >
                플랫폼 알아보기
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover-lift"
                >
                  <p className="text-3xl font-bold text-accent mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">왜 NovaTerra인가?</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              기존 부동산 투자의 한계를 뛰어넘는 혁신적인 플랫폼
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="card-gradient hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 glow-effect">
                    <feature.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12 animate-fade-in">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-gradient">투자 가능한 부동산</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                엄선된 프리미엄 부동산 프로젝트
              </p>
            </div>
            <Link to="/properties">
              <Button variant="outline" className="hidden md:flex">
                전체 보기
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {properties.map((property, index) => (
              <Card
                key={property.id}
                className="card-gradient hover-lift overflow-hidden group animate-fade-in"
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
                  <CardTitle className="text-lg">{property.name}</CardTitle>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Building2 className="w-4 h-4 mr-1" />
                    {property.location}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">총 토큰</span>
                    <span className="font-semibold">
                      {property.totalTokens}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">남은 토큰</span>
                    <span className="font-semibold text-primary">
                      {property.availableTokens}
                    </span>
                  </div>
                  <Link to={`/properties/${property.id}`}>
                    <Button className="w-full mt-4 bg-gradient-primary hover:opacity-90 group">
                      투자하기
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <Link to="/properties" className="md:hidden">
            <Button variant="outline" className="w-full mt-6">
              전체 부동산 보기
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <Card className="card-gradient glow-effect">
            <CardContent className="p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-4xl font-bold">
                    <span className="text-gradient">
                      NovaTerra의
                      <br />
                      핵심 기능
                    </span>
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    블록체인 기술과 스마트 컨트랙트를 활용하여 안전하고
                    투명한 부동산 투자 환경을 제공합니다.
                  </p>
                  <Button
                    size="lg"
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    자세히 알아보기
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 animate-fade-in">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-4 rounded-lg bg-muted/30 border border-border hover-lift"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <Card className="card-gradient glow-effect overflow-hidden animate-fade-in">
            <CardContent className="p-16 text-center relative">
              <div className="absolute inset-0 bg-gradient-primary opacity-10" />
              <div className="relative z-10 space-y-6">
                <h2 className="text-5xl font-bold text-gradient">
                  지금 바로 시작하세요
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  간편한 KYC 인증만으로 프리미엄 부동산 투자의 세계로
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <Button
                    size="lg"
                    className="bg-gradient-primary hover:opacity-90 glow-effect text-lg px-8 py-6"
                  >
                    회원가입하기
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-6"
                  >
                    문의하기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold text-gradient">
                  NovaTerra
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                블록체인 기반 부동산 투자 플랫폼
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">서비스</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/properties" className="hover:text-primary">
                    부동산 투자
                  </Link>
                </li>
                <li>
                  <Link to="/marketplace" className="hover:text-primary">
                    마켓플레이스
                  </Link>
                </li>
                <li>
                  <Link to="/governance" className="hover:text-primary">
                    거버넌스
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">회사</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    회사 소개
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    팀
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    채용
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">지원</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    고객센터
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    이용약관
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    개인정보처리방침
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2025 NovaTerra. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
