CREATE MIGRATION m13uvdeicyjavolvw6blojvprr632alscyhmmvrlx3qtctqc4f5mza
    ONTO m1j7jw5fjvnwz2fgpwzvuhrgep7wwcejnfvtd2d2royls4qukonjqa
{
  CREATE TYPE default::Message {
      CREATE MULTI LINK receiver -> default::User {
          ON TARGET DELETE ALLOW;
      };
      CREATE LINK sender -> default::User;
      CREATE REQUIRED PROPERTY date -> std::datetime;
      CREATE REQUIRED PROPERTY seen -> std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY text -> std::str;
  };
  ALTER TYPE default::Password_Reset RENAME TO default::Reset_Password;
};
