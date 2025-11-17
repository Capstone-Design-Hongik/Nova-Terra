import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Vote, Clock, Users, CheckCircle2, XCircle, ChevronDown, Building2 } from "lucide-react";

const Governance = () => {
  const [votes, setVotes] = useState<{ [key: number]: "yes" | "no" | null }>({});
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  // 내가 소유한 부동산 목록
  const properties = [
    {
      id: 1,
      name: "서울 강남 프리미엄 오피스",
      location: "강남구 테헤란로",
      value: "250억원",
      ownership: "15%",
      activeVotes: 2,
      tokens: 200,
    },
    {
      id: 2,
      name: "판교 테크노밸리 빌딩",
      location: "판교역 인근",
      value: "180억원",
      ownership: "8%",
      activeVotes: 1,
      tokens: 150,
    },
    {
      id: 3,
      name: "송도 센트럴파크 레지던스",
      location: "송도국제도시",
      value: "120억원",
      ownership: "12%",
      activeVotes: 0,
      tokens: 180,
    },
  ];

  const proposals = [
    {
      id: 1,
      title: "강남 오피스 건물 옥상 태양광 패널 설치",
      property: "서울 강남 프리미엄 오피스",
      description:
        "건물 옥상에 태양광 패널을 설치하여 전기료를 절감하고 친환경 건물로 전환합니다. 예상 설치 비용 5천만원, 연간 전기료 절감 예상액 1천만원.",
      status: "active",
      votesFor: 12500,
      votesAgainst: 3200,
      totalVotes: 15700,
      requiredVotes: 20000,
      endDate: "2025-02-15",
      myTokens: 200,
    },
    {
      id: 2,
      title: "판교 빌딩 1층 상가 임대료 인상",
      property: "판교 테크노밸리 빌딩",
      description:
        "1층 상가의 임대료를 현재 대비 15% 인상합니다. 주변 시세 대비 저렴한 편이며, 인상 시 연간 수익 2천만원 증가 예상.",
      status: "active",
      votesFor: 8900,
      votesAgainst: 7100,
      totalVotes: 16000,
      requiredVotes: 18000,
      endDate: "2025-02-20",
      myTokens: 150,
    },
    {
      id: 3,
      title: "송도 레지던스 외관 리모델링",
      property: "송도 센트럴파크 레지던스",
      description:
        "건물 외관을 현대적으로 리모델링하여 자산 가치를 높입니다. 총 예상 비용 3억원, 완공 후 평가액 10% 상승 예상.",
      status: "passed",
      votesFor: 25000,
      votesAgainst: 5000,
      totalVotes: 30000,
      requiredVotes: 25000,
      endDate: "2025-01-30",
      myTokens: 0,
    },
  ];

  // 선택된 부동산의 투표 필터링
  const filteredProposals = selectedProperty
    ? proposals.filter((p) => p.property === selectedProperty)
    : [];

  const handleVote = (proposalId: number, vote: "yes" | "no") => {
    setVotes({ ...votes, [proposalId]: vote });
  };

  const getVotePercentage = (votesFor: number, totalVotes: number) => {
    return totalVotes > 0 ? (votesFor / totalVotes) * 100 : 0;
  };

  const getProgressPercentage = (totalVotes: number, requiredVotes: number) => {
    return (totalVotes / requiredVotes) * 100;
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-gradient">DAO 거버넌스</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            토큰 보유자가 함께 만드는 의사결정
          </p>
        </div>

        {/* Properties and Proposals */}
        <div className="space-y-8">
          {/* Properties List */}
          <div>
            <h2 className="text-2xl font-bold mb-6">내 부동산 포트폴리오</h2>
            <div className="grid md:grid-cols-1 gap-4">
              {properties.map((property, index) => (
                <Card
                  key={property.id}
                  className={`card-gradient hover-lift animate-fade-in cursor-pointer transition-all ${
                    selectedProperty === property.name
                      ? "ring-2 ring-primary bg-primary/5"
                      : ""
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() =>
                    setSelectedProperty(
                      selectedProperty === property.name ? null : property.name
                    )
                  }
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 rounded-lg bg-primary/10 mt-1">
                          <Building2 className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">
                            {property.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mb-3">
                            {property.location}
                          </p>
                          <div className="flex gap-6 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                평가액
                              </span>
                              <p className="font-semibold text-primary">
                                {property.value}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                지분율
                              </span>
                              <p className="font-semibold">
                                {property.ownership}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                진행중인 투표
                              </span>
                              <p className="font-semibold text-accent">
                                {property.activeVotes}건
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <ChevronDown
                          className={`w-5 h-5 text-muted-foreground transition-transform ${
                            selectedProperty === property.name
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            보유 토큰
                          </p>
                          <p className="text-2xl font-bold text-accent">
                            {property.tokens}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Voting Proposals for Selected Property */}
          {selectedProperty && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">
                {properties.find((p) => p.name === selectedProperty)?.name} -
                투표 현황
              </h2>
              {filteredProposals.length > 0 ? (
                filteredProposals.map((proposal, index) => {
                  const votePercentage = getVotePercentage(
                    proposal.votesFor,
                    proposal.totalVotes
                  );
                  const progressPercentage = getProgressPercentage(
                    proposal.totalVotes,
                    proposal.requiredVotes
                  );
                  const userVote = votes[proposal.id];

                  return (
                    <Card
                      key={proposal.id}
                      className="card-gradient hover-lift animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge
                                className={
                                  proposal.status === "active"
                                    ? "bg-primary"
                                    : "bg-success"
                                }
                              >
                                {proposal.status === "active"
                                  ? "투표 진행중"
                                  : "가결"}
                              </Badge>
                              <span className="text-sm text-muted-foreground flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {proposal.endDate}까지
                              </span>
                            </div>
                            <CardTitle className="text-2xl mb-2">
                              {proposal.title}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-6">
                        {/* Description */}
                        <p className="text-muted-foreground leading-relaxed">
                          {proposal.description}
                        </p>

                        {/* Vote Stats */}
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              찬성률
                            </span>
                            <span className="font-semibold">
                              {votePercentage.toFixed(1)}%
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-success flex items-center">
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                찬성 {proposal.votesFor.toLocaleString()}표
                              </span>
                              <span className="text-destructive flex items-center">
                                <XCircle className="w-4 h-4 mr-1" />
                                반대 {proposal.votesAgainst.toLocaleString()}표
                              </span>
                            </div>
                            <Progress
                              value={votePercentage}
                              className="h-3"
                            />
                          </div>

                          <div className="pt-4 border-t border-border">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-muted-foreground">
                                투표 참여율
                              </span>
                              <span className="font-semibold">
                                {proposal.totalVotes.toLocaleString()} /{" "}
                                {proposal.requiredVotes.toLocaleString()}표
                              </span>
                            </div>
                            <Progress
                              value={progressPercentage}
                              className="h-2"
                            />
                          </div>
                        </div>
                      </CardContent>

                      {proposal.status === "active" && proposal.myTokens > 0 && (
                        <CardFooter className="flex gap-3">
                          {!userVote ? (
                            <>
                              <Button
                                className="flex-1 bg-success hover:bg-success/90"
                                onClick={() => handleVote(proposal.id, "yes")}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                찬성 ({proposal.myTokens}표)
                              </Button>
                              <Button
                                variant="outline"
                                className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                                onClick={() => handleVote(proposal.id, "no")}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                반대 ({proposal.myTokens}표)
                              </Button>
                            </>
                          ) : (
                            <div className="w-full p-4 rounded-lg bg-primary/10 border border-primary text-center">
                              <p className="font-semibold">
                                {userVote === "yes" ? "찬성" : "반대"} 투표 완료
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {proposal.myTokens}표로 투표하셨습니다
                              </p>
                            </div>
                          )}
                        </CardFooter>
                      )}

                      {proposal.status === "passed" && (
                        <CardFooter>
                          <div className="w-full p-4 rounded-lg bg-success/10 border border-success text-center">
                            <p className="font-semibold text-success">
                              투표가 가결되었습니다
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              제안이 실행될 예정입니다
                            </p>
                          </div>
                        </CardFooter>
                      )}
                    </Card>
                  );
                })
              ) : (
                <Card className="card-gradient">
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">
                      이 부동산에 진행 중인 투표가 없습니다
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Create Proposal CTA */}
        <Card className="card-gradient mt-12 animate-fade-in glow-effect">
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gradient">
                새로운 제안이 있으신가요?
              </h2>
              <p className="text-muted-foreground text-lg">
                100개 이상의 토큰 보유자는 직접 제안을 올릴 수 있습니다
              </p>
              <Button
                size="lg"
                className="bg-gradient-primary hover:opacity-90 mt-6"
              >
                <Vote className="w-5 h-5 mr-2" />
                제안 올리기
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Governance;
