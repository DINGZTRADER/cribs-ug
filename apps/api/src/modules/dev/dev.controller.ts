import { Controller, Headers, Post } from "@nestjs/common";
import { DevSeedService } from "./dev-seed.service";

@Controller("dev")
export class DevController {
  constructor(private readonly devSeedService: DevSeedService) {}

  @Post("seed/search-data")
  seedSearchData(@Headers("x-dev-seed-key") seedKey?: string) {
    return this.devSeedService.seedSearchData(seedKey);
  }
}
