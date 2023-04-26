CREATE MIGRATION m1jmdaymirfxony6zpfoal4jbm3npk7dotlkknycgvmx5lb42aesaa
    ONTO m17mhbicaq3rjc7ycvi7i2qjafvhljjas4vk4g3zux6zcglwmsctaa
{
  ALTER TYPE default::PendingRequest {
      DROP LINK receiver;
  };
};
