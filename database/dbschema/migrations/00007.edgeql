CREATE MIGRATION m1tu6trahggqtru4xngpuopqqlr45hcluf3q6t55vjlj4ln3ezmwjq
    ONTO m1tf3643ro4hsplbfoodkib74rh2hoelhlegl6al5u4xde3l74fowa
{
  ALTER TYPE default::Account_Creation RENAME TO default::User_Creation;
};
