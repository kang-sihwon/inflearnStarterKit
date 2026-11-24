import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "소개" };

const tree = `apps/
├─ web/   Next.js 15 + Tailwind + shadcn/ui
└─ api/   Express + TypeScript (zod, helmet, cors)`;

export default function AboutPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>프로젝트 구조</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">{tree}</pre>
      </CardContent>
    </Card>
  );
}
