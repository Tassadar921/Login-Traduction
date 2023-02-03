CREATE MIGRATION m1spmd26zyugshf6c6dmbg7zw52ts5unv5nmuvobgme3jn7ucki27a
    ONTO m1tu6trahggqtru4xngpuopqqlr45hcluf3q6t55vjlj4ln3ezmwjq
{
  ALTER TYPE default::User_Creation {
      ALTER PROPERTY token {
          RENAME TO url;
      };
  };
};
