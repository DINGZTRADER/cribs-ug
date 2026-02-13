import { Injectable } from "@nestjs/common";
import { prisma } from "@repo/database";
import { SearchResponseDto } from "@repo/types";
import { PLAN_CATALOG } from "../subscriptions/plan-catalog";
import { SubscriptionsService } from "../subscriptions/subscriptions.service";
import { clampSearchRadius, maybeMaskContactPhone } from "./search-policy";

interface PropertyDetailRow {
  id: string;
  title: string;
  rent_amount: number;
  district: string;
  thumbnail_url: string | null;
  highres_url: string | null;
  landlord_name: string;
  landlord_badge_score: number;
  landlord_verified_owner: boolean;
  landlord_phone: string | null;
}

@Injectable()
export class SearchService {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  async searchNearby(
    userId: string | null,
    lat: number,
    lng: number,
    radiusMeters: number
  ): Promise<{ radiusUsedMeters: number; items: SearchResponseDto[] }> {
    const entitlements = userId
      ? await this.subscriptionsService.getEntitlements(userId)
      : PLAN_CATALOG.free.entitlements;
    const radiusUsedMeters = clampSearchRadius(radiusMeters, entitlements.maxRadiusMeters);

    const db = prisma as {
      $queryRawUnsafe<T = unknown>(
        query: string,
        ...values: unknown[]
      ): Promise<T>;
    };

    const rows = await db.$queryRawUnsafe<SearchResponseDto[]>(
      `
      SELECT
        p.id,
        p.title,
        COALESCE(pi.thumbnail_url, '') AS thumbnail_url,
        p.rent_amount,
        json_build_object(
          'badge_score', u.badge_score,
          'verified', lp.verified_owner
        ) AS landlord
      FROM properties p
      JOIN users u ON u.id = p.landlord_id
      LEFT JOIN landlord_profiles lp ON lp.user_id = u.id
      LEFT JOIN LATERAL (
        SELECT thumbnail_url
        FROM property_images
        WHERE property_id = p.id
        LIMIT 1
      ) pi ON true
      WHERE p.status = 'active'
      AND ST_DWithin(
        ST_SetSRID(ST_MakePoint(CAST(p.longitude AS double precision), CAST(p.latitude AS double precision)), 4326)::geography,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
        $3
      )
      ORDER BY p.rent_amount ASC
    `,
      lng,
      lat,
      radiusUsedMeters
    );

    return {
      radiusUsedMeters,
      items: rows
    };
  }

  async getPropertyDetail(userId: string | null, propertyId: string) {
    const entitlements = userId
      ? await this.subscriptionsService.getEntitlements(userId)
      : PLAN_CATALOG.free.entitlements;
    const canRevealPhone = entitlements.canRevealLandlordPhone;

    const db = prisma as {
      $queryRawUnsafe<T = unknown>(
        query: string,
        ...values: unknown[]
      ): Promise<T>;
    };

    const rows = await db.$queryRawUnsafe<PropertyDetailRow[]>(
      `
      SELECT
        p.id,
        p.title,
        p.rent_amount,
        p.district,
        pi.thumbnail_url,
        pi.highres_url,
        u.full_name AS landlord_name,
        u.badge_score AS landlord_badge_score,
        COALESCE(lp.verified_owner, false) AS landlord_verified_owner,
        u.phone AS landlord_phone
      FROM properties p
      JOIN users u ON u.id = p.landlord_id
      LEFT JOIN landlord_profiles lp ON lp.user_id = u.id
      LEFT JOIN LATERAL (
        SELECT thumbnail_url, highres_url
        FROM property_images
        WHERE property_id = p.id
        LIMIT 1
      ) pi ON true
      WHERE p.id = $1
        AND p.status = 'active'
      LIMIT 1
      `,
      propertyId
    );

    const row = rows[0];
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      title: row.title,
      rentAmount: row.rent_amount,
      district: row.district,
      image: {
        thumbnailUrl: row.thumbnail_url,
        highresUrl: row.highres_url
      },
      landlord: {
        name: row.landlord_name,
        badgeScore: row.landlord_badge_score,
        verifiedOwner: row.landlord_verified_owner,
        phone: maybeMaskContactPhone(canRevealPhone, row.landlord_phone)
      },
      contactLocked: !canRevealPhone
    };
  }
}
