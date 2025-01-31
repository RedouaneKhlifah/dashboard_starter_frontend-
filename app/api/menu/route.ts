import http from "@/lib/http";
import { getDotenv } from "@/utils";
import { get } from "http";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const locale = searchParams.get("locale");
  const citySlug = searchParams.get("citySlug");
  const restaurantSlug = searchParams.get("restaurantSlug");
  const API_BASE_PATH = getDotenv("API_BASE_PATH");
  const res = await http(
    `${API_BASE_PATH}/cities/${citySlug}/restaurants/${restaurantSlug}/menu`,
    {
      headers: {
        "X-Locale": locale || "",
      },
      cache: "no-store",
    }
  );
  const data = await res.json();

  return Response.json(data);
}
