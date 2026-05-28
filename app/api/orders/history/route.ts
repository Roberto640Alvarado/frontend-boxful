import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const fechaInicio = searchParams.get("fechaInicio");
  const fechaFin = searchParams.get("fechaFin");

  const params = new URLSearchParams();
  if (fechaInicio) params.set("fechaInicio", fechaInicio);
  if (fechaFin) params.set("fechaFin", fechaFin);

  const url = `${process.env.API_URL}/orders/history${params.toString() ? `?${params}` : ""}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}