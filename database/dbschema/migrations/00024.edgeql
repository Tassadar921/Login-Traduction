CREATE MIGRATION m17mhbicaq3rjc7ycvi7i2qjafvhljjas4vk4g3zux6zcglwmsctaa
    ONTO m1mo2e3dtxr7wrupijrnqv6kebgj7f7rmexeghmckdejgioaphakba
{
  CREATE TYPE default::PendingRequest {
      CREATE LINK receiver -> default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE LINK sender -> default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY date -> std::datetime;
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK pendingRequests -> default::PendingRequest {
          ON SOURCE DELETE DELETE TARGET;
          ON TARGET DELETE ALLOW;
      };
  };
};
