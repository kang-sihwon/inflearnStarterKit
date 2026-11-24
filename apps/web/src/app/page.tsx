import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Counter } from "@/components/counter";

const features = [
  { title: "Next.js 15", desc: "App Router, TypeScript, Tailwind CSS v4" },
  { title: "shadcn/ui", desc: "다크 모드와 반응형 레이아웃이 포함된 UI 컴포넌트" },
  { title: "Express API", desc: "환경 변수 검증, 에러 핸들링, 라우터 구조" },
  { title: "상태 관리", desc: "Zustand(클라이언트)와 TanStack Query(서버 상태)" },
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="space-y-4 py-8 text-center">
        <Badge variant="secondary">Monorepo Starter</Badge>
        <h1 className="text-4xl font-bold tracking-tight">Next.js + Express 스타터킷</h1>
        <p className="mx-auto max-w-xl text-muted-foreground">
          프론트엔드와 백엔드를 한 저장소에서 바로 시작하세요.
        </p>
        <div className="flex justify-center gap-2">
          <Link href="/todos" className={buttonVariants()}>
            API 예제 보기
          </Link>
          <Link href="/about" className={buttonVariants({ variant: "outline" })}>
            구조 알아보기
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {features.map((f) => (
          <Card key={f.title}>
            <CardHeader>
              <CardTitle>{f.title}</CardTitle>
              <CardDescription>{f.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Zustand 예제</CardTitle>
          <CardDescription>클라이언트 상태 관리 예시입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Counter />
        </CardContent>
      </Card>
    </div>
  );
}
