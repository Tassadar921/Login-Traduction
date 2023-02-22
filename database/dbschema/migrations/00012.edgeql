CREATE MIGRATION m152qmxwhgytovre2vrnw6pz4ho345tehak7khr74xqxplq7ldcrjq
    ONTO m1ik5proxe4jc4c3gduihwhqvzwshjij2p2rbuzqsrji6k24ypgqqq
{
  ALTER TYPE default::User {
      ALTER LINK friends {
          ON TARGET DELETE ALLOW;
      };
  };
  ALTER TYPE default::User {
      ALTER LINK notifications {
          ON TARGET DELETE ALLOW;
      };
  };
};
