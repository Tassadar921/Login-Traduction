CREATE MIGRATION m1yjhzq5hj2yeu5wwe6y6bbkvdlvtvosjxbw5diquwkdn3r3cr6d4q
    ONTO m1b6vte77nyn5ucro7cz6er374bcep7emhz7sjdt73jx2byc4vduca
{
  ALTER TYPE default::User {
      CREATE MULTI LINK blocked -> default::User {
          ON TARGET DELETE ALLOW;
      };
  };
};
