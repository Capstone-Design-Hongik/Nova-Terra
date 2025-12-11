import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Wallet, TrendingUp, Vote, Menu } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/properties", label: "부동산", icon: Building2 },
    { path: "/portfolio", label: "포트폴리오", icon: Wallet },
    { path: "/marketplace", label: "마켓플레이스", icon: TrendingUp },
    { path: "/governance", label: "거버넌스", icon: Vote },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center glow-effect">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-gradient">NovaTerra</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={`flex items-center space-x-2 ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground glow-effect"
                      : "hover:bg-muted"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost">로그인</Button>
            <Button className="bg-gradient-primary hover:opacity-90 glow-effect">
              시작하기
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            ))}
            <div className="pt-4 space-y-2 border-t border-border">
              <Button variant="ghost" className="w-full">
                로그인
              </Button>
              <Button className="w-full bg-gradient-primary">시작하기</Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
