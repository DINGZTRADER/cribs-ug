import {
  ForbiddenException,
  Injectable,
  MethodNotAllowedException,
  UnauthorizedException
} from "@nestjs/common";
import { prisma } from "@repo/database";
import { randomUUID } from "node:crypto";

interface IdRow {
  id: string;
}

const db = prisma as {
  $queryRawUnsafe<T = unknown>(query: string, ...values: unknown[]): Promise<T>;
  $executeRawUnsafe(query: string, ...values: unknown[]): Promise<number>;
};

@Injectable()
export class DevSeedService {
  async seedSearchData(seedKey?: string) {
    this.assertSeedingAllowed(seedKey);

    const landlordId = await this.ensureLandlord();
    const seeded = await this.seedProperties(landlordId);

    return {
      ok: true,
      seededProperties: seeded,
      landlordId
    };
  }

  private assertSeedingAllowed(seedKey?: string) {
    if ((process.env.NODE_ENV || "").toLowerCase() === "production") {
      throw new MethodNotAllowedException("Dev seed is disabled in production.");
    }
    if (!process.env.DEV_SEED_KEY) {
      throw new ForbiddenException("DEV_SEED_KEY is not configured.");
    }
    if (seedKey !== process.env.DEV_SEED_KEY) {
      throw new UnauthorizedException("Invalid seed key.");
    }
  }

  private async ensureLandlord(): Promise<string> {
    const seedPhone = "+256700000999";
    const rows = await db.$queryRawUnsafe<IdRow[]>(
      `
      SELECT id
      FROM users
      WHERE phone = $1
      LIMIT 1
      `,
      seedPhone
    );
    if (rows[0]?.id) {
      return rows[0].id;
    }

    const landlordId = randomUUID();
    await db.$executeRawUnsafe(
      `
      INSERT INTO users (
        id,
        role,
        full_name,
        phone,
        email,
        badge_score,
        is_identity_verified,
        created_at
      )
      VALUES ($1, 'landlord', $2, $3, $4, 40, true, NOW())
      `,
      landlordId,
      "Seed Landlord Kampala",
      seedPhone,
      "seed.landlord@example.com"
    );

    await db.$executeRawUnsafe(
      `
      INSERT INTO landlord_profiles (user_id, verified_owner)
      VALUES ($1, true)
      ON CONFLICT (user_id) DO NOTHING
      `,
      landlordId
    );

    return landlordId;
  }

  private async seedProperties(landlordId: string): Promise<number> {
    const templates = [
      {
        title: "Kampala Studio Near Makerere",
        rent: 380000,
        district: "Kampala",
        lat: 0.3369,
        lng: 32.5686
      },
      {
        title: "Ntinda Family Apartment",
        rent: 850000,
        district: "Kampala",
        lat: 0.3576,
        lng: 32.6121
      },
      {
        title: "Kololo Premium Flat",
        rent: 1800000,
        district: "Kampala",
        lat: 0.3274,
        lng: 32.5874
      }
    ];

    let seeded = 0;
    for (const template of templates) {
      const existing = await db.$queryRawUnsafe<IdRow[]>(
        `
        SELECT id
        FROM properties
        WHERE landlord_id = $1
          AND title = $2
        LIMIT 1
        `,
        landlordId,
        template.title
      );
      if (existing[0]?.id) {
        continue;
      }

      await db.$executeRawUnsafe(
        `
        INSERT INTO properties (
          id,
          landlord_id,
          title,
          rent_amount,
          district,
          latitude,
          longitude,
          status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
        `,
        randomUUID(),
        landlordId,
        template.title,
        template.rent,
        template.district,
        template.lat,
        template.lng
      );
      seeded += 1;
    }

    return seeded;
  }
}
