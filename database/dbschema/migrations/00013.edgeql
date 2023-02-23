CREATE MIGRATION m1xuaso5fvmv3akfawzbgkq3vbstjckpzeqrp5krupcc3bpjsvjpaa
    ONTO m152qmxwhgytovre2vrnw6pz4ho345tehak7khr74xqxplq7ldcrjq
{
  ALTER TYPE default::User {
      ALTER LINK notifications {
          ON SOURCE DELETE DELETE TARGET;
      };
  };
};
