import { http, HttpResponse, delay } from "msw";
import { CREATED_STATUS } from "../form/services/httpStatus";

export const handlers = [
  http.post("/api/login", async () => {
    await delay(100);
    return HttpResponse.json("User logued");
  }),
];

export const handlersForm = [
  http.post("/api/createProduct", () => {
    delay(100);
    return new HttpResponse(null, { status: CREATED_STATUS });
  }),
];
