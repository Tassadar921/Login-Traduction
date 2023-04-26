CREATE MIGRATION m1i53tog3rfwgmz4zzqiot6dvxzne5wywhays7iurvuh5m3ursreyq
    ONTO m1jmdaymirfxony6zpfoal4jbm3npk7dotlkknycgvmx5lb42aesaa
{
  ALTER TYPE default::PendingRequest {
      DROP LINK sender;
      DROP PROPERTY date;
  };
  ALTER TYPE default::User {
      DROP LINK pendingRequests;
  };
  DROP TYPE default::PendingRequest;
  ALTER TYPE default::User {
      CREATE MULTI LINK pendingFriendsRequests -> default::User {
          ON TARGET DELETE ALLOW;
      };
  };
};
