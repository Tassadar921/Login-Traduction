CREATE MIGRATION m1mhigwe4ub7acti5bqawtdido6pkndzxkpwlksqi6mgxjgl6qycna
    ONTO m1spmd26zyugshf6c6dmbg7zw52ts5unv5nmuvobgme3jn7ucki27a
{
  ALTER TYPE default::User_Creation {
      ALTER PROPERTY url {
          RENAME TO urlToken;
      };
  };
};
