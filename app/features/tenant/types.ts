export type TenantSummary = {
  id: string | number;
  name: string;
  slug: string;
  isActive: boolean;
  status: string;
};

export type TenantDomain = {
  domain: string;
  isActive: boolean;
};

export type TenantContextResponse = {
  tenant: TenantSummary | null;
  domain: TenantDomain | null;
};
