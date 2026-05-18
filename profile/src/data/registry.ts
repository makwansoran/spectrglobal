import type { CompanySeed } from "./seed-types";
import { equinorSeed } from "./equinor";

/**
 * Register every company that should be in the database.
 * After adding a file, import its seed here and run: npm run db:seed
 */
export const companySeeds: CompanySeed[] = [equinorSeed];
