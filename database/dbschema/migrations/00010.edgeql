CREATE MIGRATION m17xs524lbx54latiseikmod4jit4c63eztdqp7drt7jnv2a7ieywa
    ONTO m1mhigwe4ub7acti5bqawtdido6pkndzxkpwlksqi6mgxjgl6qycna
{
  ALTER TYPE default::Password_Reset {
      ALTER PROPERTY token {
          RENAME TO urlToken;
      };
  };
};
