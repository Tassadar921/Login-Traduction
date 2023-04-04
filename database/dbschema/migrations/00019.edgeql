CREATE MIGRATION m1xlopajfg5fl3yijiveqkdr6tlojpipbsbumvnyonuypp3dacev4a
    ONTO m1lamd3sqmiedtklv4ihqupwplpupstr5x4dd7iarmgsftryhpxejq
{
  CREATE TYPE default::Notification {
      CREATE LINK objectsMessage -> default::Message {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE LINK objectsUser -> default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY component -> std::str;
      CREATE REQUIRED PROPERTY date -> std::datetime;
      CREATE REQUIRED PROPERTY seen -> std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY title -> std::str;
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK notifications -> default::Notification {
          ON SOURCE DELETE DELETE TARGET;
          ON TARGET DELETE ALLOW;
      };
  };
};
