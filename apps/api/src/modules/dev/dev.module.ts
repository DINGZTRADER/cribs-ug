import { Module } from "@nestjs/common";
import { DevController } from "./dev.controller";
import { DevSeedService } from "./dev-seed.service";

@Module({
  providers: [DevSeedService],
  controllers: [DevController]
})
export class DevModule {}
