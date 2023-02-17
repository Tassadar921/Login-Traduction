CREATE MIGRATION m1ik5proxe4jc4c3gduihwhqvzwshjij2p2rbuzqsrji6k24ypgqqq
    ONTO m17xs524lbx54latiseikmod4jit4c63eztdqp7drt7jnv2a7ieywa
{
  CREATE TYPE default::Notification {
      CREATE REQUIRED PROPERTY date -> std::datetime;
      CREATE REQUIRED PROPERTY name -> std::str;
      CREATE REQUIRED PROPERTY seen -> std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY text -> std::str;
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK notifications -> default::Notification;
  };
};
