import { Controller, Get, NotFoundException, Param, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/auth/current-user.decorator";
import { OptionalJwtAuthGuard } from "../../common/auth/optional-jwt-auth.guard";
import { RequestUser } from "../../common/auth/jwt-payload";
import { validateOrThrow } from "../../common/validation/validate-or-throw";
import { nearbySearchQuerySchema } from "./search.schemas";
import { SearchService } from "./search.service";

@Controller("search")
@UseGuards(OptionalJwtAuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get("nearby")
  searchNearby(
    @CurrentUser() user: RequestUser | null,
    @Query() query: Record<string, unknown>
  ) {
    const parsed = validateOrThrow(
      nearbySearchQuerySchema,
      query,
      "Invalid search query parameters."
    );
    return this.searchService.searchNearby(
      user?.id ?? null,
      parsed.lat,
      parsed.lng,
      parsed.radius ?? 5000
    );
  }

  @Get(":propertyId")
  async getPublicPropertyDetail(
    @CurrentUser() user: RequestUser | null,
    @Param("propertyId") propertyId: string
  ) {
    const property = await this.searchService.getPropertyDetail(user?.id ?? null, propertyId);
    if (!property) {
      throw new NotFoundException("Property not found.");
    }
    return property;
  }
}
